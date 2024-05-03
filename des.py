# Import necessary libraries
from transformers import BertTokenizer, BertForMaskedLM
import torch
import sys


# Function to generate title
def generate_description(make, model, year, price, condition, mileage, exterior, interior):
    prompt = f"This {price} {year} {make} {model} has [MASK] features and a [MASK] design, it's a [MASK] {price} vehicle with just kilometers on the [MASK], it promises [MASK], Other Notable features:"

    # Load BERT model and tokenizer
    model_name = "bert-base-uncased"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForMaskedLM.from_pretrained(model_name)

    # Tokenizing the input prompt
    tokenized_input = tokenizer(prompt, return_tensors='pt')

    # Generate the sentence using the BERT model
    with torch.no_grad():
        outputs = model(**tokenized_input)

    logits = outputs.logits
    predicted_tokens = []

    # Collect predicted tokens for masked positions
    for masked_index in range(len(tokenized_input['input_ids'][0])):
        if tokenized_input['input_ids'][0][masked_index] == tokenizer.mask_token_id:
            masked_token_logits = logits[0, masked_index]
            predicted_token_index = torch.argmax(masked_token_logits).item()
            predicted_token = tokenizer.convert_ids_to_tokens([predicted_token_index])[0]
            predicted_tokens.append((masked_index, predicted_token))

    # Replace the masked tokens with the predicted tokens
    modified_input_ids = tokenized_input['input_ids'].clone().detach()
    for masked_index, predicted_token in predicted_tokens:
        modified_input_ids[0][masked_index] = tokenizer.convert_tokens_to_ids(predicted_token)

    # Generate the description
    description = tokenizer.decode(modified_input_ids[0], skip_special_tokens=True)
    return description

# Extract arguments from command line
if __name__ == "__main__":
    year = sys.argv[1]
    make = sys.argv[2]
    model = sys.argv[3]
    condition = sys.argv[4]
    price = sys.argv[5]
    mileage = sys.argv[6]
    exterior = sys.argv[7]
    interior = sys.argv[8]
title = generate_description(make, model, year, price, condition, mileage, exterior, interior)
print(title)
