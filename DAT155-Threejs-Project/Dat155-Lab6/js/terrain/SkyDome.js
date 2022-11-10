import {
    Mesh,
    TextureLoader,
    MeshBasicMaterial,
    SphereBufferGeometry,
    Object3D
} from "../lib/three.module.js";

/**
 *  Creating a skydome
 */

export default class SkyDome extends Object3D {

    constructor() {
        super();

        let loader = new TextureLoader();

        let skyTexture = loader.load('resources/skydome/sky.jpeg');
        let skyGeometry = new SphereBufferGeometry(256, 32, 16, Math.PI / 2, Math.PI * 2, 0, 0.5 * Math.PI);

        let skyMaterial = new MeshBasicMaterial( {
            map: skyTexture,
            opacity: 5.0,
            side: 2,
            color: 0xffb3f6
        });

        this.skyDome = new Mesh(skyGeometry, skyMaterial);

        this.add(this.skyDome);
    }
}


