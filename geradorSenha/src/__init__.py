import random
import string

def execute():
    comprimento = int(input("Comprimento da senha desejado: "))
    usar_maiusculas = input("Incluir letras maiúsculas? (s/n): ").lower() == 's'
    usar_minusculas = input("Incluir letras minúsculas? (s/n): ").lower() == 's'
    usar_numeros = input("Incluir números? (s/n): ").lower() == 's'
    usar_caracteres_especiais = input("Incluir caracteres especiais? (s/n): ").lower() == 's'

    senha = passwordHash(comprimento, usar_maiusculas, usar_minusculas, usar_numeros, usar_caracteres_especiais)
    if senha:
        print("Senha gerada com sucesso:", senha)
    else:
        print("Não foi possível gerar a senha.")

def passwordHash(comprimento, usar_maiusculas=True, usar_minusculas=True, usar_numeros=True, usar_caracteres_especiais=True):
    caracteres = ''
    if usar_maiusculas:
        caracteres += string.ascii_uppercase
    if usar_minusculas:
        caracteres += string.ascii_lowercase
    if usar_numeros:
        caracteres += string.digits
    if usar_caracteres_especiais:
        caracteres += string.punctuation

    if not caracteres:
        print("Erro: Você deve escolher pelo menos um tipo de caractere para gerar a senha.")
        return None

    senha = ''.join(random.choice(caracteres) for _ in range(comprimento))
    return senha
