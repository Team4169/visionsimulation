import socket
import json
import time

host = '10.41.69.29'
port = 12345

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((host, port))

file_path = 'output.txt'
with open(file_path, 'w') as file:
    pass

iteration = 0
start_time = time.time()

while True:
    response = client_socket.recv(1024).decode('utf-8')
    with open(file_path, 'w') as file:
        file.write(response)

    iteration += 1
    elapsed_time = time.time() - start_time
    iterations_per_second = iteration / elapsed_time
    print(f"Iterations per second: {iterations_per_second:.2f}")

finally:
    # Close the socket
    client_socket.close()
