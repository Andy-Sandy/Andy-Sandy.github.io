import {
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    DirectionalLight,
    Vector3,
    AxesHelper,
    Raycaster,
    FogExp2,
} from './lib/three.module.js';
import * as THREE from './lib/three.module.js';
import Utilities from './lib/Utilities.js';
import {VRButton} from "./lib/VRButton.js";

import MouseLookController from './controls/MouseLookController.js';

import TextureSplattingMaterial from './materials/TextureSplattingMaterial.js';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry.js';

import { Water } from "./terrain/Water.js";
import SkyBox from './terrain/SkyBox.js';

import Grass from './objects/Grass.js';
import Tree from './objects/Tree.js';
import Cloud from './objects/Cloud.js';
import Box from './objects/Box.js';
import Boat from './objects/Boat.js';

async function main() {

    const scene = new Scene();

    /**
     *
     * @type {FogExp2}
     */
    scene.fog = new FogExp2(0xbc9fcc, 0.0025);

    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    /**
     * Camera
     * @type {PerspectiveCamera}
     */
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;
    camera.position.y = 100;
    camera.rotation.x -= Math.PI * 0.25;

    /**
     * Renderer
     * @type {WebGLRenderer}
     */
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);

    /**
     * Enable shadowMap and declare type
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    /**
     * Handle window resize:
     *  - update aspect ratio.
     *  - update projection matrix
     *  - update renderer size
     */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    /**
     * Add light
     */
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0,400, 300);

    directionalLight.castShadow = true;

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;

    let side = 1000;
    directionalLight.shadow.camera.top = side;
    directionalLight.shadow.camera.bottom = -side;
    directionalLight.shadow.camera.left = side;
    directionalLight.shadow.camera.right = -side;
    
    scene.add(directionalLight);

    // Set direction
    directionalLight.target.position.set(0, 15, 0);
    scene.add(directionalLight.target);

    /**
     * Add terrain:
     *
     * We have to wait for the image file to be loaded by the browser.
     * There are many ways to handle asynchronous flow in your application.
     * We are using the async/await language constructs of Javascript:
     *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
     */
    const heightmapImage = await Utilities.loadImage('resources/images/images.jpg');
    const width = 300;

    const terrainGeometry = new TerrainBufferGeometry({
        width,
        heightmapImage,
        numberOfSubdivisions: 128,
        height: 60
    });

    // Load grass texture
    const grassTexture = new TextureLoader().load('resources/textures/grass_02.png');
    grassTexture.wrapS = RepeatWrapping;
    grassTexture.wrapT = RepeatWrapping;
    grassTexture.repeat.set(5000 / width, 5000 / width);

    // Load rock texture
    const rockTexture = new TextureLoader().load('resources/textures/rock_03.png');
    rockTexture.wrapS = RepeatWrapping;
    rockTexture.wrapT = RepeatWrapping;
    rockTexture.repeat.set(1500 / width, 1500 / width);

    // Load splatMap
    const splatMap = new TextureLoader().load('resources/images/splatmap.jpg');

    const terrainMaterial = new TextureSplattingMaterial({
        color: 0xffffff,
        shininess: 0,
        textures: [rockTexture, grassTexture],
        splatMaps: [splatMap]
    });

    const terrain = new Mesh(terrainGeometry, terrainMaterial);

    terrain.receiveShadow = true;

    scene.add(terrain);


    /**
     * Add Grass
     */
    let GrassTexture = new TextureLoader().load('./resources/textures/Grassbillboardtexture.png');

    let x;
    let z;

    function makeGrass(grass){
        x = Math.floor(Math.random()*49) + 60;
        x *= Math.floor(Math.random()*2) === 1 ? 1 : -1;
        z = Math.floor(Math.random()*49) + 1;
        z *= Math.floor(Math.random()*2) === 1 ? 1 : -1;

        const raycaster = new Raycaster();
        const direction = new Vector3(0.0, -1.0, 0.0);

        raycaster.set(new Vector3(x, 150, z), direction);
        let array = raycaster.intersectObject(terrain);

        if(array[0].point.y<25 && array[0].point.y>10) {
            grass.position.set(array[0].point.x, array[0].point.y+0.3, array[0].point.z);
            scene.add(grass);
        }else{
            makeGrass(grass);
        }
    }

    for(let i =0; i<100; i++){
        const grass = new Grass({texture:GrassTexture});
        makeGrass(grass);
    }


    /**
     * Add trees
     */
    let tree = new Tree(scene, terrainGeometry);
    tree.generateTrees();


    /**
     * Add skybox
     */
    let skyBox = new SkyBox();
    scene.add(skyBox);


    /**
     * Add clouds
     */
    let clouds = new Cloud(scene);
    clouds.generateBillboardClouds();


    /**
     * Add water
     */
    const waterGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );

    let water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'resources/images/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            alpha: 1.0,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x68d9c6,
            distortionScale: 5,
            fog: true
        }
    );

    water.rotation.x = - Math.PI / 2;
    water.translateZ(6);
    scene.add( water );

    /**
     * Add box
     */
    let box = new Box(scene);
    scene.add(box);

    /**
     * Add boat
     */
    let boat = new Boat(scene);
    boat.generateBoat();

    const mouseLookController = new MouseLookController(camera);

    // We attach a click lister to the canvas-element so that we can request a pointer lock.
    // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
    const canvas = renderer.domElement;

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

    let yaw = 0;
    let pitch = 0;
    const mouseSensitivity = 0.001;

    function updateCamRotation(event) {
        yaw += event.movementX * mouseSensitivity;
        pitch += event.movementY * mouseSensitivity;
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas) {
            canvas.addEventListener('mousemove', updateCamRotation, false);
        } else {
            canvas.removeEventListener('mousemove', updateCamRotation, false);
        }
    });

    let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        speed: 0.01
    };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
            move.forward = true;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = true;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = true;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = true;
            e.preventDefault();
        } else if (e.code === 'Space') {
            move.up = true;
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') {
            move.forward = false;
            e.preventDefault();
        } else if (e.code === 'KeyS') {
            move.backward = false;
            e.preventDefault();
        } else if (e.code === 'KeyA') {
            move.left = false;
            e.preventDefault();
        } else if (e.code === 'KeyD') {
            move.right = false;
            e.preventDefault();
        } else if (e.code === 'Space') {
            move.up = false;
            e.preventDefault();
        }
    });


    /**
     * VR implementation
     */
    renderer.xr.enabled = true;
    //"Returns" canvas-element to index.html <body>
    document.body.appendChild(renderer.domElement);
    //Creates the button used to go into VR
    document.body.append(VRButton.createButton(renderer));

    renderer.setAnimationLoop(loop.bind(this));

    const velocity = new Vector3(0.0, 0.0, 0.0);

    let then = performance.now();
    function loop(now) {

        const delta = now - then;
        then = now;

        const moveSpeed = move.speed * delta * 5;

        velocity.set(0.0, 0.0, 0.0);

        if (move.left) {
            velocity.x -= moveSpeed;
        }

        if (move.right) {
            velocity.x += moveSpeed;
        }

        if (move.forward) {
            velocity.z -= moveSpeed;
        }

        if (move.backward) {
            velocity.z += moveSpeed;
        }

        if (move.up) {
            velocity.y += moveSpeed;
        }

        // update controller rotation.
        mouseLookController.update(pitch, yaw);
        yaw = 0;
        pitch = 0;

        // apply rotation to velocity vector, and translate moveNode with it.
        velocity.applyQuaternion(camera.quaternion);
        camera.position.add(velocity);

        // animate water
        water.material.uniforms[ 'time' ].value += 1.0 / 120.0;

        // render scene:
        renderer.render(scene, camera);

    }

}

main(); // Start application