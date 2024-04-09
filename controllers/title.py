from transformers import BertTokenizer, BertForMaskedLM
import torch

def title(form_data):
    # Constructing the prompt for BERT
    prompt = f"[MASK] {form_data['condition']} {form_data['year']} {form_data['make']} {form_data['model']} [MASK]."

    # Load BERT model and tokenizer
    model_name = "bert-base-uncased"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForMaskedLM.from_pretrained(model_name)

    # Check if CUDA is available, else use CPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Tokenizing the input prompt
    tokenized_input = tokenizer.encode(prompt, return_tensors='pt').to(device)

    # Generate the sentence using the BERT model
    with torch.no_grad():
        output = model(tokenized_input)

    logits = output.logits
    predicted_tokens = []

    # Collect predicted tokens for masked positions
    for masked_index in range(len(tokenized_input[0])):
        if tokenized_input[0][masked_index] == tokenizer.mask_token_id:
            masked_token_logits = logits[0][masked_index]
            predicted_token_index = masked_token_logits.argmax().item()
            predicted_token = tokenizer.convert_ids_to_tokens([predicted_token_index])[0]
            predicted_tokens.append((masked_index, predicted_token))

    # Replace the masked tokens with the predicted tokens
    modified_input_ids = tokenized_input.clone().detach()
    for masked_index, predicted_token in predicted_tokens:
        modified_input_ids[0][masked_index] = tokenizer.convert_tokens_to_ids(predicted_token)

    # Generate the description
    title = tokenizer.decode(modified_input_ids[0], skip_special_tokens=True)

    return title
