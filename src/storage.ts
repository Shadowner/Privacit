import { writable, type Writable } from 'svelte/store';
import type { BaseContentSeeking } from './interfaces/BaseContentSeeking';
import type { GlobalOptions } from './interfaces/GlobalOptions';
import type { TchatAi } from './interfaces/TchatAi';

export async function GetValueFromChromeStorage<T>(key: string): Promise<T> {
    return new Promise((res, rej) => {
        chrome.storage.sync.get(key, (result) => {
            res(result[key]);
        });
    });
}

export function persistentStore<T>(key: string, initialValue: T): Writable<T> & { GetValueFromChromeStorage: () => Promise<T> } {
    const store = writable(initialValue);
    // Ensure each value is updated exactly once in store and in chrome storage
    let storeValueQueue: T[] = [];
    let chromeValueQueue: T[] = [];

    function watchStore() {
        store.subscribe((value) => {
            if (chromeValueQueue.length > 0 && value === chromeValueQueue[0]) {
                chromeValueQueue.shift();
                return;
            }

            storeValueQueue.push(value);
            chrome.storage.sync.set({ [key]: value });
        });
    }

    function watchChrome() {
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (!(Object.hasOwn(changes, key))) return;

            const value = changes[key].newValue as T;
            if (storeValueQueue.length > 0 && value === storeValueQueue[0]) {
                storeValueQueue.shift();
                return;
            }

            chromeValueQueue.push(value);
            store.set(value);
        });
    }

    // Initialize the store with the value from Chrome storage
    chrome.storage.sync.get(key).then((result) => {
        let value = Object.hasOwn(result, key) ? result[key] : initialValue;
        if (!Object.hasOwn(result, key)) {
            console.log(`Persistent store: couldn't find key [${key}] in chrome storage. Default to initial value [${initialValue}]`)
        }
        chromeValueQueue.push(value);
        store.set(value);
        watchStore();
        watchChrome();
    });

    //@ts-ignore
    store.GetValueFromChromeStorage = () => GetValueFromChromeStorage<T>(key);
    // @ts-ignore   
    return store;
}



export const contentSeeking = persistentStore<BaseContentSeeking[]>('contentSeeking', [{
    parentSelector: "div[data-answerid]",
    textSelector: 'div[itemprop="text"]',
    url: "stackoverflow",
    sentimentAnalysis: true,
    factCheck: false
},
{
    parentSelector: 'article[data-testid="tweet"]',
    textSelector: 'div[data-testid="tweetText"]',
    url: "x.com",
    sentimentAnalysis: true,
    factCheck: true,
    rephrase: true
},
{
    parentSelector: `div[id='body'].ytd-comment-view-model`,
    textSelector: '.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap',
    url: "youtube.com",
    sentimentAnalysis: true,
    factCheck: true,
    rephrase: true
}]);



export const filterList = persistentStore<string[]>("filter", [])
export const globalOptions = persistentStore<GlobalOptions>("options", {
    factCheck: false,
    filterComportment: "delete"
});
export const conversation = persistentStore<TchatAi[]>("conversation", []);