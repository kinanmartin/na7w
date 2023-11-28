import os
import stanza
from google.cloud import storage
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

logging.info(f"Hello from markText")
# Function to download a file from Google Cloud Storage
def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    logging.info(f"Starting download of {source_blob_name} to {destination_file_name}")
    blob.download_to_filename(destination_file_name)
    logging.info(f"Finished download of {source_blob_name}")

# Function to download the Stanza models
def download_stanza_models():
    bucket_name = 'na7w-406315.appspot.com'
    prefix = 'stanza_resources/ar/'  # The prefix of the model files in your bucket
    local_folder = '/tmp/stanza_resources/ar'
    os.makedirs(local_folder, exist_ok=True)

    # Initialize the Google Cloud Storage client
    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)

    for blob in blobs:
        # Construct the local path
        local_path = os.path.join(local_folder, blob.name.replace(prefix, ''))
        # Create subdirectories if not exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        # Download the blob to the local path
        download_blob(bucket_name, blob.name, local_path)

# Download models before creating the pipeline
download_stanza_models()

# Now that the models are downloaded, set the path to /tmp/stanza_resources
stanza_resources_dir = '/tmp/stanza_resources'

nlp = stanza.Pipeline(
    dir=stanza_resources_dir, # Uncomment when running locally
    lang='ar',
    processors='tokenize,mwt,pos,lemma',
    download_method=None
)

def mark_pos(text):
    doc = nlp(text)
    # print(doc)
    tagged = []
    for sent in doc.sentences:
        for i, token in enumerate(sent.tokens):
            # Special case for li + al = lil
            if len(token.words) < 1 and token.words[0].lemma == "لِ" and token.words[1].text[:2] == "ال" and 'Definite=Def' in token.words[1].feats:
                # Strip the inital alef
                token.words[1].text = token.words[1].text[1:]
            # Add space to end of token's text only if required:
            if i != len(sent.tokens) - 1 and token.end_char != sent.tokens[i + 1].start_char:
                token.words[-1].text = token.words[-1].text + ' '
            # If this token is a multi-word token, there will be multiple "words" in this list
            tagged.append([(word.text, word.xpos) for word in token.words])

    return tagged


if __name__ == '__main__':
    text = "بالنسبة- للسنوار، لم."
    print(mark_pos(text))