import {
    Sprite,
    SpriteMaterial,
    DoubleSide,
    TextureLoader
} from "../lib/three.module.js";

export default class Cloud {
    constructor(scene) {
        this.scene = scene;
    }

    generateBillboardClouds() {
        const loader = new TextureLoader();
        for (let i = 0; i < 50; i++) {
            let cloudTextures = [
                loader.load('resources/cloud/cloud1.png'), //Laster inn noen skyteksturer
                loader.load('resources/cloud/cloud2.png'),
                loader.load('resources/cloud/cloud3.png'),
                loader.load('resources/cloud/cloud4.png')
            ];

            let random = Math.floor(Math.random() * 3);
            let material = new SpriteMaterial({
                map: cloudTextures[random],
                color: 0xffffff,
                transparent: true,
                fog: true,
                opacity: 0.5,
                side: DoubleSide

            });

            let skyPlane = new Sprite(material);

            //Positions- plasser litt tilfeldig
            let pX = Math.random() * 1000 - 500;
            let pZ = Math.random() * 1000 - 500;
            let pY = Math.random() * 50 + 100;

            let s1 = 50;
            let s2 = 50;

            //Set positions and scale
            skyPlane.position.set(pX, pY, pZ);
            skyPlane.scale.set(s1, s2, 1);
            skyPlane.rotation.z = Math.PI / 2;

            this.scene.add(skyPlane);
        }
    }
}