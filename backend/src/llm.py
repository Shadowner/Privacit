import torch
import json
from transformers import pipeline

#model_id = "meta-llama/Llama-3.1-8B-Instruct"
model_id = "meta-llama/Llama-3.2-1B-Instruct"
pipe = pipeline(
    "text-generation",
    model=model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)
rephrase_messages = [
    {"role": "system", "content": "Vous êtes un assistant qui paraphrase toute phrase qui vous est envoyée. Vous supprimez le langage grossier et désobligeant, et vous respectez les contraintes de mots fournies. Répondez uniquement avec la phrase paraphrasée, sans autre commentaire."},
    {"role": "user", "content": "PHRASE: Ce foutu boulot me rend dingue, j'en ai marre !\nCONTRAINTE: foutu, dingue"},
    {"role": "assistant", "content": "Ce travail difficile m'exaspère, je suis à bout de patience."},
    {"role": "user", "content": "PHRASE: T'es vraiment con ou tu le fais exprès ?\nCONTRAINTE: con"},
    {"role": "assistant", "content": "Agissez-vous ainsi par inadvertance ou intentionnellement ?"},
    {"role": "user", "content": "PHRASE: Je vais lui casser la gueule s'il continue à m'emmerder.\nCONTRAINTE: casser la gueule, emmerder"},
    {"role": "assistant", "content": "Je vais confronter cette personne si elle persiste à me contrarier."},
    {"role": "user", "content": "PHRASE: Cette putain de voiture ne démarre jamais quand j'en ai besoin !\nCONTRAINTE: putain"},
    {"role": "assistant", "content": "Cette voiture peu fiable refuse systématiquement de démarrer dans les moments cruciaux."},
    {"role": "user", "content": "PHRASE: @PHRASE@\nCONTRAINTE: @CONSTRAINT@"},
]

messages = [
    {"role": "system", "content": "Analysez le texte pour identifier les affirmations factuelles spécifiques qui pourraient nécessiter une vérification. Si aucun fait vérifiable n'est présent, ne retournez rien. Sinon, retournez un JSON contenant : 1) le fait spécifique à vérifier, 2) une explication courte de pourquoi une vérification est nécessaire, 3) un niveau de confiance de 1 à 5 (5 étant le plus susceptible d'être trompeur ou nécessitant une vérification urgente), et 4) une phrase de recherche Google pertinente pour vérifier l'information. Format : {\"claim\": \"fait spécifique\", \"explanation\": \"raison de la vérification\", \"confidence\": niveau_de_confiance, \"search_query\": \"phrase de recherche Google\"}"},
    {"role": "user", "content": "Le café est la boisson la plus consommée au monde, devant l'eau."},
    {"role": "assistant", "content": "{\"claim\": \"Le café est la boisson la plus consommée au monde\", \"explanation\": \"Cette affirmation est probablement inexacte car l'eau est généralement considérée comme la boisson la plus consommée.\", \"confidence\": 4, \"search_query\": \"Quelle est la boisson la plus consommée dans le monde statistiques\"}"},
    {"role": "user", "content": "J'adore le café, c'est vraiment délicieux !"},
    {"role": "assistant", "content": ""},
    {"role": "user", "content": "La Grande Muraille de Chine est visible depuis l'espace à l'œil nu."},
    {"role": "assistant", "content": "{\"claim\": \"La Grande Muraille de Chine est visible depuis l'espace à l'œil nu\", \"explanation\": \"C'est un mythe répandu. La Grande Muraille n'est généralement pas visible à l'œil nu depuis l'orbite terrestre basse.\", \"confidence\": 5, \"search_query\": \"Est-ce que la Grande Muraille de Chine est réellement visible depuis l'espace\"}"},
    {"role": "user", "content": "Je pense que je vais aller me promener cet après-midi, le temps a l'air agréable."},
    {"role": "assistant", "content": ""},
    {"role": "user", "content": "Le National Weather Service a émis près de 90 alertes à la tornade avant l'arrivée de l'ouragan Milton. Mais c'est pas un petit coup de vent qui fera du mal a qui que ce soit"},
    {"role": "assistant", "content": "{\"claim\": \"l'arrivée de l'ouragan Milton\", \"explanation\": \"L'existence et l'arrivée de l'ouragan Milton nécessitent une vérification, car il pourrait s'agir d'une information météorologique importante.\", \"confidence\": 3, \"search_query\": \"Ouragan Milton alertes National Weather Service récentes\"}"},
    {"role": "user", "content": "Les chats sont vraiment des animaux fascinants, j'aime les observer."},
    {"role": "assistant", "content": ""},
    {"role": "user", "content": ""},
]

def rephrase(phrase, constraint):
    new_messages = rephrase_messages.copy()
    rephrase_messages[-1]["content"] = "PHRASE: " + phrase + "\nCONTRAINTE: " + ",".join(constraint)
    # print(new_messages, phrase, constraint)
    outputs = pipe(new_messages, max_new_tokens=512)
    return outputs[0]["generated_text"][-1]["content"]

def fact_checking(text):
    new_messages = messages.copy()
    new_messages[-1]["content"] = text
    outputs = pipe(new_messages, max_new_tokens=512)
    generated_text =  outputs[0]["generated_text"][-1]["content"]
    # test if the generated text is a valid json
    return generated_text

# print(rephrase("Elon Musk est un vrai enculé, il ose créé des machines pour nous remplacer nous HUMAINS !", "enculé"));
# print(rephrase("Vous êtes tous des ravagés, vous ne pensez qu'à vous remplir les poches !", "ravagés"));
print(fact_checking("En 2002, Ce putain de musk fonde le complot SpaceX, un fabricant aérospatial et une société de services voué a nous enculer a sec pour du transport spatial, et il en est le PDG"))