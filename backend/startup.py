import os
from google.cloud import storage
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    logging.info(f"Starting download of {source_blob_name} to {destination_file_name}")
    blob.download_to_filename(destination_file_name)
    logging.info(f"Finished download of {source_blob_name}")

def download_stanza_models():
    bucket_name = 'na7w-406315.appspot.com'
    prefix = 'stanza_resources/ar/'
    local_folder = '/tmp/stanza_resources/ar'
    os.makedirs(local_folder, exist_ok=True)

    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)

    for blob in blobs:
        local_path = os.path.join(local_folder, blob.name[len(prefix):])
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        download_blob(bucket_name, blob.name, local_path)

if __name__ == '__main__':
    download_stanza_models()
