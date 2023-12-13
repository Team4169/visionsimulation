import { useEffect } from 'react';

import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';


function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    const axesHelper = new THREE.AxesHelper( 500 );
    //const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
    test.initialize();
    test.animate();

    var geo = new THREE.PlaneBufferGeometry(500, 500, 8, 8);
    var mat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    var plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = Math.PI / 2;
    plane.position.z = 250;
    plane.position.x = 250;
    test.scene.add(plane);

    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene;

      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = 10;
      gltfScene.scene.position.x = 150;
      gltfScene.scene.position.z = 150;
      gltfScene.scene.scale.set(10, 10, 10);
      test.scene.add(gltfScene.scene);
    });

    test.scene.add( axesHelper );
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
