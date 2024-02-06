import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import SceneInit from './lib/SceneInit';
import data from '../data.json';

export default function App() {
  const cameraRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3());
  const [cameraRotation, setCameraRotation] = useState(new THREE.Euler());

  function createImageMesh(id, position, rotation) {
    const paddedId = id.toString().padStart(5, '0');
    const textureLoader = new THREE.TextureLoader();
    const imageTexture = textureLoader.load(
      `src/tag16h5/tag16_05_${paddedId}.png`
    );
    imageTexture.magFilter = THREE.NearestFilter;
    imageTexture.minFilter = THREE.NearestFilter;

    const imageMaterial = new THREE.MeshBasicMaterial({
      map: imageTexture,
      side: THREE.FrontSide,
    });
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
    test.scene.add(axesHelper);

    let data_array = Array.from(data['apriltags']);
    const positions = data_array.map((item) => ({
      id: item.id,
      x: item.tvec[0][0],
      y: item.tvec[1][0],
      z: item.tvec[2][0],
      rotation: { x: item.rvec[0][0], y: item.rvec[1][0], z: item.rvec[2][0] },
    }));

    positions.forEach((position) => {
      const imageMesh = createImageMesh(
        position.id,
        position,
        position.rotation
      );
      test.scene.add(imageMesh);

      const textMesh = createTextMesh(position.id, {
        x: position.x,
        y: position.y - 3,
        z: position.z,
      });
      test.scene.add(textMesh);
    });
  }, []);

  return <canvas id="myThreeJsCanvas" />;
}
