import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
	const [count, setCount] = useState(0);
	const [currentURL, setCurrentURL] = useState<string>();
	const [filterWord, setFilterWord] = useState("");
	const [filterList, setFilterList] = useState<string[]>([]);

	useEffect(() => {
		chrome.action.setBadgeText({ text: count.toString() });
	}, [count]);

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			setCurrentURL(tabs[0].url);
		});

		// Charger la liste de filtres existante
		chrome.storage.sync.get(['filterList'], (result) => {
			if (result.filterList) {
				setFilterList(result.filterList);
			}
		});
	}, []);

	const changeBackground = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0];
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						color: "#555555",
					},
					(msg) => {
						console.log("result message:", msg);
					},
				);
			}
		});
	};

	const handleSaveFilter = () => {
		if (filterWord && !filterList.includes(filterWord)) {
			const newFilterList = [...filterList, filterWord];
			setFilterList(newFilterList);
			setFilterWord("");

			// Sauvegarder la nouvelle liste dans le stockage Chrome
			chrome.storage.sync.set({ filterList: newFilterList }, () => {
				console.log('Filter list saved');
			});
		}
	};

	const removeWord = (word: string) => () => {
		const newFilterList = filterList.filter((w) => w !== word);
		setFilterList(newFilterList);

		// Sauvegarder la nouvelle liste dans le stockage Chrome
		chrome.storage.sync.set({ filterList: newFilterList }, () => {
			console.log('Filter list saved');
		});
	};

	return (
		<>
			<ul style={{ minWidth: "700px" }}>
				<li>Current URL: {currentURL}</li>
				<li>Current Time: {new Date().toLocaleTimeString()}</li>
			</ul>
			<p>
				Coucou <span> l'holocaust n'a jamais eu lieu </span>, mais c'est sympa
				de parler avec vous !
			</p>
			<button
				onClick={() => setCount(count + 1)}
				style={{ marginRight: "5px" }}
			>
				count up
			</button>
			<button onClick={changeBackground}>Mon bouton</button>
			<div style={{ marginTop: "20px" }}>
				<input
					type="text"
					value={filterWord}
					onChange={(e) => setFilterWord(e.target.value)}
					placeholder="Entrez un mot à filtrer"
				/>
				<button onClick={handleSaveFilter}>Sauvegarder</button>
			</div>
			<div>
				<h3>Liste des mots filtrés :</h3>
				<ul>
					{filterList.map((word, index) => (
						<li key={index} onClick={removeWord(word)}>{word}</li>
					))}
				</ul>
			</div>
		</>
	);
};

const root = createRoot(document.getElementById("root")!);

root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
);