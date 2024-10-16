#!/usr/bin/env python

import asyncio
import json
from llm import rephrase, fact_checking
from sentiment_analysis import get_sentiment
from websockets.asyncio.server import serve

import asyncio
import json

async def handle_message(websocket, message):
    try:
        print(f"Received message: {message}")
        data = json.loads(message)
        if "type" not in data:
            await websocket.send(json.dumps({"__id": data["__id"], "error": "Invalid request"}))
            return

        print(f"Parsed message: {data}")
        if data["type"] == "sentimentAnalysis":
            sentiment = get_sentiment(data["data"])
            await websocket.send(json.dumps({"__id": data["__id"], "data": sentiment}))

        elif data["type"] == "rephrase":
            rephrased = rephrase(data["data"]["phrase"], data["data"]["constraint"])
            await websocket.send(json.dumps({"__id": data["__id"], "data": rephrased}))

        elif data["type"] == "factCheck":
            fact_checked = fact_checking(data["data"])
            await websocket.send(json.dumps({"__id": data["__id"], "data": fact_checked}))

    except Exception as e:
        print(f"Error handling message: {e}")
        await websocket.send(json.dumps({"__id": data["__id"], "error": "Invalid request"}))

async def echo(websocket):
    print("New Socket Connected")
    async for message in websocket:
        asyncio.create_task(handle_message(websocket, message))
        
            
async def main():
    async with serve(echo, "localhost", 8765):
        await asyncio.get_running_loop().create_future()  # run forever

asyncio.run(main())