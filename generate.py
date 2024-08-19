import sys
from transformers import pipeline

def generate_text(prompt):
    generator = pipeline('text-generation', model='gpt2')
    response = generator(prompt, max_length=150)[0]['generated_text']
    return response

if __name__ == "__main__":
    prompt = sys.argv[1]
    print(generate_text(prompt))
