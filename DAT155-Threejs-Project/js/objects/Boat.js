import {
    Object3D,
} from "../lib/three.module.js";
import {GLTFLoader} from "../loaders/GLTFLoader.js";


export default class Boat extends Object3D {
    constructor(scene) {
        super();
        this.scene = scene;
    }

    generateBoat(){
        // instantiate a GLTFLoader:
        const loader = new GLTFLoader();
        let loadedBoat;

        loader.load(
            // resource URL
            'resources/models/boat/boat.glb',
            // called when resource is loaded
            (boat) => {
                boat.scene.traverse(c =>{
                    c.castShadow = true;
                });
                loadedBoat = boat;
                loadedBoat.scene.position.y = 6;

                this.scene.add(boat.scene);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );

        let t = 0;
        function animateBoat(){
            if(loadedBoat){
                t += 0.001;
                loadedBoat.scene.position.x = 225*Math.cos(t);
                loadedBoat.scene.position.z = 225*Math.sin(t);
                loadedBoat.scene.rotation.y -= 0.001;
            }
            requestAnimationFrame(animateBoat);
        }
        animateBoat();
    }

}
