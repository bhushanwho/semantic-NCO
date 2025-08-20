# semantic-nco: semantic search over nco-2015

this project lets you do semantic search over the nco-2015 table.  
basically: scrape website -> generate descriptions -> embed -> fastapi backend -> next frontend.

---

## 1. notebooks: data extraction + embedding

### structure
notebooks/ has jupyter notebooks that do most of the preprocessing

### data extraction
- scraped nco-2015 website
- cleaned data
- saved as csv

### description generation
- descriptors volume of NCO-2015 data was chunked & vectorized
- used ollama + small lm gemma3:1b to generate descriptions
- each row now has a description

### embedding + vectorstore
- chunked descriptions
- stored in vectorstore
- created embed_data column in csv with vector info

---

## 2. backend: fastapi + langchain

### setup
- python (hell if i cared about the version. 3.12.10 i believe)

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
- /data - fetch all rows
- /exact_search?query= - guess lol
- /semantic_search?query= ?k= - 🤓

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

1. (OPTIONAL: data/ contains everything) run notebooks to scrape + clean csv  
2. (OPTIONAL: data/ contains everything) generate descriptions with ollama + gemma3:1b  
3. (OPTIONAL: data/ contains everything) embed descriptions -> embed_data column  
4. start fastapi backend  
5. start react frontend and search