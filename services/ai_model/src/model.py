import os
import numpy as np

os.environ['TRANSFORMERS_OFFLINE'] = '1'
os.environ['HF_HUB_OFFLINE'] = '1'

from sentence_transformers import SentenceTransformer

class TextEmbedder:
    def __init__(self, model_path: str = '/app/models/e5-small'):

        # model path check
        if os.path.exists(model_path):
            self.model = SentenceTransformer(model_path)
        else:
            self.model = SentenceTransformer('intfloat/multilingual-e5-small')

        print(f"Загрузка модели из: {model_path}")

        self.dim = 384

    def get_embedding(self, text_val, type_val):
        full_text = f"{type_val}: {text_val}"

        embedding = self.model.encode(full_text)

        normal_embedding = embedding / np.linalg.norm(embedding)
        return normal_embedding.tolist()
    
    def split_text(self, text, chunk_size=500, overlap=50):
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            chunks.append(text[i:i + chunk_size])
        return chunks
    
def aggregate_vectors(vectors):
    np_vectors = np.array(vectors)
        
    summed_vector = np.sum(np_vectors, axis=0)
    
    norm = np.linalg.norm(summed_vector)
    if norm > 0:
        final_vector = summed_vector / norm
    else:
        final_vector = summed_vector
            
    return final_vector.tolist()