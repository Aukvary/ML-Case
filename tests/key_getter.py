from gigachat import GigaChat

giga = GigaChat(
    credentials="MDE5ZTIwYTAtZjg4OC03Y2Q3LTg1MDEtOGY5ZTEyYTcyNzljOjI5ZTk4NzE4LWEyMjAtNDIwOS1iYzNkLWNhYWUyZTNmYzMzZQ==",
    scope="GIGACHAT_API_PERS",
    model="GigaChat",
    ca_bundle_file="./../russian_ca.crt"
)

response = giga.chat("")

print(response)