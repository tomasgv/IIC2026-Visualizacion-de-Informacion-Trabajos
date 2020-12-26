import wikipedia
text = wikipedia.page("Chile", auto_suggest=False).content
# Imprimir los primeros 2000 caracteres
print(text[:2000], '...')