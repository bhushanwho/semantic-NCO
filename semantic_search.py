from langchain_community.document_loaders import PyPDFLoader

file_path = r"C:\Users\bhushan\Desktop\dev1\semantic_st25\data\NCO_2015_stripped_descriptions.pdf"
loader = PyPDFLoader(file_path)

docs = loader.load()