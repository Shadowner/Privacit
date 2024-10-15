# Print available devices
import torch
print("Available devices: ", torch.cuda.device_count())
print("Current device: ", torch.cuda.current_device())
print("Device name: ", torch.cuda.get_device_name(0))

from transformers import pipeline
emotion_pipeline = pipeline("sentiment-analysis", device=0, model="bhadresh-savani/distilbert-base-uncased-emotion")
sentiment_pipeline = pipeline("sentiment-analysis", device=0)

# Make a function to get sentiment analysis
def get_sentiment(data):
    print("Requesting sentiment analysis for data: ", data)
    #If data > 512 cut it 
    
    if(len(data)>512):
        data = data[:512]
    
    sentiment_result = sentiment_pipeline(data)
    emotion_result = emotion_pipeline(data)
    
    return {"sentiment": sentiment_result[0], "emotion": emotion_result[0]}