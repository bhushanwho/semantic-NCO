# semantic-nco: semantic search over nco-2015

this project lets you do semantic search over the nco-2015 table.  
basically: scrape website -> generate descriptions -> embed -> fastapi backend -> next frontend.

---
# TODOS for ETL
- [ ] fix pagination for semantic search 
- [ ] intuitive Semantic Ranking for semantic search

# demo


https://github.com/user-attachments/assets/66a79c0c-c4d4-4e06-8480-501f27efb87e



# future expansion aside from prototype
- standardized queries via a query processor
- support for multilingual queries - translation + query processor
- auto dispatch for query type (syntactic/semantic)
- relational DB for better group-by ordering and filtering

# what?

## 1. notebooks: data extraction + embedding

notebooks/ has jupyter notebooks that do most of the preprocessing

### data extraction
- scraped nco-2015 website
- cleaned data
- saved as csv

### description generation
- descriptors volume of NCO-2015 data was chunked & vectorized into FAISS
- used ollama + small lm gemma3:1b to generate descriptions
- each row now has a description

### embeddings + vectorstore
- chunked descriptions
- stored in FAISS vectorstore
- created embed_data column in csv with vector info (only 500 for this prototype)

---

## 2. backend: fastapi + langchain

### setup
- python (3.12.10)

```
uv venv
.venv/scripts/activate
uv pip install -r requirements.txt
```

### run
```
cd backend
uv run uvicorn main:app --reload
```

### api
- `/data` - fetch all rows
- `/exact_search?query=` - guess lol
- `/semantic_search?query= ?k=` - 🤓

### env
create .env in project root with:
```
LANGSMITH_TRACING="your-key-here"
LANGSMITH_API_KEY="your-key-here"
```
---

## 3. frontend: next

### setup
```
  pnpm install  
  pnpm run dev
```
- access at http://localhost:3000

### env
create .env.local in frontend root with:

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```
---

## 4. workflow

1. (OPTIONAL: `data/` contains everything - 500 for prototype) run notebooks to scrape + clean csv  
2. (OPTIONAL: `data/` contains everything - 500 for prototype) generate descriptions with ollama + gemma3:1b  
3. (OPTIONAL: `data/` contains everything - 500 for prototype) embed descriptions -> embed_data column  
4. start fastapi backend  
5. start next frontend
