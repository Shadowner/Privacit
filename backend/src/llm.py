import torch
import json
from transformers import pipeline

model_id = "meta-llama/Llama-3.2-1B-Instruct"
pipe = pipeline(
    "text-generation",
    model=model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)
rephrase_messages = [
    {"role": "system", "content": "You are an assistant that rephrase every and any phrase that is sent to you, your remove slur and derogatory languages, with a constraint of word with the format PHRASE: \n CONSTRAINT:! YOUR DONT PRINT SLURS"},
    {"role": "user", "content": "PHRASE: @PHRASE@\n CONSTRAIN: @CONSTRAINT@"},
]

messages = [
    {"role": "system", "content": "Analysez le texte pour identifier les affirmations présentées comme des faits. Retournez un JSON contenant les informations suivantes : 1) le texte potentiellement trompeur, 2) une explication courte de pourquoi c'est potentiellement trompeur, 3) un niveau de confiance entre 1 et 5 (5 étant le plus susceptible d'être trompeur). Format : {\"claim\": \"texte de l'affirmation\", \"explanation\": \"explication courte\", \"confidence\": niveau_de_confiance}"},
    {"role": "user", "content": "Le café est la boisson la plus consommée au monde, devant l'eau."},
    {"role": "assistant", "content": "{\"claim\": \"Le café est la boisson la plus consommée au monde, devant l'eau.\", \"explanation\": \"L'eau est généralement considérée comme la boisson la plus consommée au monde.\", \"confidence\": 4}"},
    {"role": "user", "content": "La Grande Muraille de Chine est visible depuis l'espace à l'œil nu."},
    {"role": "assistant", "content": "{\"claim\": \"La Grande Muraille de Chine est visible depuis l'espace à l'œil nu.\", \"explanation\": \"Cette affirmation est un mythe répandu. La Grande Muraille n'est généralement pas visible à l'œil nu depuis l'orbite terrestre basse.\", \"confidence\": 5}"},
    {"role": "user", "content": ""},
]

def rephrase(phrase, constraint):
    new_messages = rephrase_messages.copy()
    new_messages[1]["content"] = new_messages[1]["content"].replace("PHRASE", phrase).replace("CONSTRAINT", constraint)
    outputs = pipe(new_messages, max_new_tokens=512)
    return outputs[0]["generated_text"][-1]["content"]

def fact_checking(text):
    new_messages = messages.copy()
    new_messages[-1]["content"] = text
    outputs = pipe(new_messages, max_new_tokens=512)
    generated_text =  outputs[0]["generated_text"][-1]["content"]
    # test if the generated text is a valid json
    try:
        json.loads(generated_text)
        return generated_text
    except:
        return fact_checking(text)
