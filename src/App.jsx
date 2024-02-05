import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import SceneInit from './lib/SceneInit';

export default function App() {
  function createImageMesh(id, position, rotation) {
    const paddedId = id.toString().padStart(5, '0');
    const textureLoader = new THREE.TextureLoader();
    const imageTexture = textureLoader.load(`src/tag16h5/tag16_05_${paddedId}.png`);
    imageTexture.magFilter = THREE.NearestFilter;
    imageTexture.minFilter = THREE.NearestFilter;

    const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, side: THREE.FrontSide });
    const imageGeometry = new THREE.BoxBufferGeometry(1, 1, 0.1);
    const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
    imageMesh.position.set(position.x, position.y, position.z);
    imageMesh.rotation.set(rotation.x, rotation.y, rotation.z);

    return imageMesh;
  }

  function createTextMesh(id, position) {
    const textGeometry = new THREE.TextGeometry(`ID: ${id}`, {
      font: new FontLoader().load('path/to/font.json'),
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
    const host = 'ws://10.41.69.29:12345'; // Use WebSocket address
    const webSocket = new WebSocket(host);

    // WebSocket on open
    webSocket.onopen = () => {
      console.log('Connected to the server');
    };

    // WebSocket on message
    webSocket.onmessage = (event) => {
      console.log(event);
      const response = JSON.parse(event.data);
      console.log(response.apriltags);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    
      // Additional error information
      console.error('WebSocket readyState:', webSocket.readyState);
      console.error('WebSocket extensions:', webSocket.extensions);
      console.error('WebSocket protocol:', webSocket.protocol);
    };
    
    // WebSocket on close
    webSocket.onclose = (event) => {
      console.log('Connection closed:', event);
    
      // Additional close information
      console.log('WebSocket close code:', event.code);
      console.log('WebSocket close reason:', event.reason);
      console.log('WebSocket wasClean:', event.wasClean);
    };
    

    // Clean up the WebSocket on component unmount
    return () => {
      webSocket.close();
    };
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}
