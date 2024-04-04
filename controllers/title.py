from transformers import BertTokenizer, BertForMaskedLM
import torch

def generate_description_from_form_data(form_data):
    # Constructing the prompt for BERT
    prompt = f"a {form_data['condition']} {form_data['year']} {form_data['make']} {form_data['model']}."

    # Load BERT model and tokenizer
    model_name = "bert-base-uncased"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForMaskedLM.from_pretrained(model_name)

    # Tokenizing the input prompt
    tokenized_input = tokenizer.encode(prompt, return_tensors='pt')

    # Generate the sentence using the BERT model
    input_ids = tokenized_input['input_ids'].to(device)
    attention_mask = tokenized_input['attention_mask'].to(device)

    with torch.no_grad():
        output = model(input_ids, attention_mask=attention_mask)

    logits = output.logits
    predicted_tokens = []

    # Collect predicted tokens for masked positions
    for masked_index in range(len(tokenized_input['input_ids'][0])):
        if tokenized_input['input_ids'][0][masked_index] == tokenizer.mask_token_id:
            masked_token_logits = logits[0][masked_index]
            predicted_token_index = masked_token_logits.argmax().item()
            predicted_token = tokenizer.convert_ids_to_tokens([predicted_token_index])[0]
            predicted_tokens.append((masked_index, predicted_token))

    # Replace the masked tokens with the predicted tokens
    modified_input_ids = input_ids.clone().detach()
    for masked_index, predicted_token in predicted_tokens:
        modified_input_ids[0][masked_index] = tokenizer.convert_tokens_to_ids(predicted_token)

    # Generate the description
    generated_title = tokenizer.decode(modified_input_ids[0], skip_special_tokens=True)

    return generated_title
