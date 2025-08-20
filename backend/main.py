from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import List

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores.faiss import FAISS

ALLOWED_FIELDS = [
    "occupation_title", "nco_2015", "nco_2004",
    "division", "subdivision", "group", "family"
]

class Occupation(BaseModel):
    occupation_title: str
    nco_2015: str
    nco_2004: str
    division: str
    subdivision: str
    group: str
    family: str
    similarity_score: float | None = None


df = pd.read_csv("../nco_500_embed.csv", dtype=str)
df = df.fillna("")

texts = texts = df["embed_data"].tolist()
metadatas = df.drop(columns=["description", "embed_data"]).to_dict(orient="records")

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
faiss_store = FAISS.from_texts(texts, embeddings, metadatas=metadatas)

app = FastAPI(title="NCO Semantic Search")

origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data", response_model=List[Occupation])
def get_data():
    return df[ALLOWED_FIELDS].to_dict(orient="records")

@app.get("/exact_search", response_model=List[Occupation])
def exact_search(query: str = Query(..., description="Search query")):
    mask = df["occupation_title"].str.contains(query, case=False, na=False)
    return df.loc[mask, ALLOWED_FIELDS].to_dict(orient="records")

@app.get("/semantic_search", response_model=List[Occupation])
def semantic_search(query: str = Query(...), k: int = 10):
    results = faiss_store.similarity_search_with_score(query, k=k)
    rows = []
    for doc, score in results:
        row = {f: doc.metadata.get(f, "") for f in ALLOWED_FIELDS}
        row["similarity_score"] = float(score)
        rows.append(row)
    return rows