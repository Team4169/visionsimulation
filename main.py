import socket, json

# Client configuration
host = '10.41.69.29'  # Replace with the server's IP address or hostname
port = 12345         # Use the same port number as the server

# Create a socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to the server
client_socket.connect((host, port))

while True:
    # Receive a response from the server
    response = client_socket.recv(1024).decode('utf-8')
    print(eval(response)["apriltags"])

# Close the socket
client_socket.close()