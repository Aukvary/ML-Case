import requests

url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"

payload={
  'scope': 'GIGACHAT_API_PERS'
}
headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json',
  'RqUID': 'b1d179d1-106f-4301-8f7d-9988bd46b99d',
  'Authorization': 'Basic MDE5ZTIwYTAtZjg4OC03Y2Q3LTg1MDEtOGY5ZTEyYTcyNzljOjI5ZTk4NzE4LWEyMjAtNDIwOS1iYzNkLWNhYWUyZTNmYzMzZQ=='
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)