import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import net from 'net';
import SceneInit from './lib/SceneInit';

export default function App() {
  function createImageMesh(id, position, rotation) {
    const paddedId = id.toString().padStart(5, '0');
    const textureLoader = new THREE.TextureLoader();
    const imageTexture = textureLoader.load(`src/tag16h5/tag16_05_${paddedId}.png`);
    imageTexture.magFilter = THREE.NearestFilter;
    imageTexture.minFilter = THREE.NearestFilter;
    
    const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, side: THREE.FrontSide }); // Set side to THREE.FrontSide
    const imageGeometry = new THREE.BoxBufferGeometry(1, 1, 0.1);
    const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
    imageMesh.position.set(position.x, position.y, position.z);
    imageMesh.rotation.set(rotation.x, rotation.y, rotation.z);

    return imageMesh;
  }

  function createTextMesh(id, position) {
    const textGeometry = new THREE.TextGeometry(`ID: ${id}`, {
      font: new FontLoader().load('path/to/font.json'), // Use FontLoader from the imported module
      size: 1,
      height: 0.1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y, position.z);

    return textMesh;
  }

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    const axesHelper = new THREE.AxesHelper(20);
    test.initialize();
    test.animate();

    const positions = [
      { id: 0, x: 0, y: 0, z: 0, rotation: { x: Math.PI / 2, y: 0, z: 0 } },
      { id: 1, x: 5, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } },
    ];

    positions.forEach((position) => {
      const imageMesh = createImageMesh(position.id, position, position.rotation);
      test.scene.add(imageMesh);

      console.log('ID:', position.id);

      const textMesh = createTextMesh(position.id, { x: position.x, y: position.y - 3, z: position.z });
      test.scene.add(textMesh);
    });

    test.scene.add(axesHelper);
  }, []);

  useEffect(() => {
    // Client configuration
    const host = '10.41.69.29';  // Replace with the server's IP address or hostname
    const port = 12345;          // Use the same port number as the server

    // Create a socket
    const clientSocket = new net.Socket();

    // Connect to the server
    clientSocket.connect(port, host, () => {
      console.log('Connected to the server');
    });

    // Listen for data from the server
    clientSocket.on('data', (data) => {
      const response = data.toString('utf-8');
      console.log(JSON.parse(response).apriltags);
    });

    // Listen for the connection close event
    clientSocket.on('close', () => {
      console.log('Connection closed');
    });

    // Listen for errors
    clientSocket.on('error', (error) => {
      console.error('Error:', error.message);
    });

    // Clean up the socket on component unmount
    return () => {
      clientSocket.destroy();
    };
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}