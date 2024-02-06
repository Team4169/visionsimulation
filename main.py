import socket

host = '10.41.69.29'
port = 12345

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((host, port))

while True:
    response = client_socket.recv(1024).decode('utf-8')

    with open("data.json", "w") as file:
        file.write(response.replace("'", '"'))

client_socket.close()
