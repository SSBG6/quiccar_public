# Import necessary libraries
from transformers import BertTokenizer, BertForMaskedLM
import torch
import sys
import sys

# Function to generate title
def generate_title(year, make, model, condition):
    # Constructing the prompt for BERT
    prompt = f"{condition} {year} {make} {model} [MASK]"

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
    title = tokenizer.decode(modified_input_ids[0], skip_special_tokens=True)
    return title

# Extract arguments from command line
if __name__ == "__main__":
    year = sys.argv[1]
    make = sys.argv[2]
    model = sys.argv[3]
    condition = sys.argv[4]

    # Generate and print the title
    title = generate_title(year, make, model, condition)
    print(title)
