from sentence_transformers import SentenceTransformer
import numpy as np

# МОДЕЛЬ
class TextEmbedder:
    def __init__(self, model_name: str = 'intfloat/multilingual-e5-small'):
        self.model = SentenceTransformer(model_name)
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

# ТЕСТ
# test_embedder = TextEmbedder()
# x_test = test_embedder.get_embedding("Sky is blue", "query")
# print(x_test)