import {GLTFLoader} from "../loaders/GLTFLoader.js";
import {Object3D} from "../lib/three.module.js";

/**
 * Add trees
 */

export default class Tree extends Object3D {
    constructor(scene, terrainGeometry) {
        super();
        this.scene = scene;
        this.terrainGeometry = terrainGeometry;
    }

    generateTrees() {
        // instantiate a GLTFLoader:
        const loader = new GLTFLoader();

        loader.load(
            // resource URL
            'resources/models/kenney_nature_kit/tree_thin.glb',
            // called when resource is loaded
            (object) => {
                for (let x = -125; x < 222; x += 10) {
                    for (let z = -125; z < 222; z += 10) {

                        const px = x + 1 + (6 * Math.random()) - 3;
                        const pz = z + 1 + (6 * Math.random()) - 3;

                        const height = this.terrainGeometry.getHeightAt(px, pz);

                        if (height < 30 && height > 10) {
                            const tree = object.scene.children[0].clone();

                            tree.traverse((child) => {
                                if (child.isMesh) {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            });

                            tree.position.x = px;
                            tree.position.y = height - 0.01;
                            tree.position.z = pz;

                            tree.rotation.y = Math.random() * (2 * Math.PI);

                            tree.scale.multiplyScalar(3 + Math.random() * 7);


                            this.scene.add(tree);
                        }

                    }
                }
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }
}