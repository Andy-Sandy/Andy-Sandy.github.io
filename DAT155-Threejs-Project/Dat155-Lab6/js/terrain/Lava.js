import {MeshPhongMaterial, Object3D, PlaneGeometry, TextureLoader, Mesh, RepeatWrapping} from "../lib/three.module.js";

export default class Lava extends Object3D {
    constructor() {
        super();

        let loader = new TextureLoader();

        let lavaGeometry = new PlaneGeometry(45, 85, 32, 32);

        let lavaTexture = loader.load('resources/textures/lava4.png');
        let lavaNormalMap = loader.load('resources/images/lava_normal.jpg');

        //lavaTexture.wrapS = RepeatWrapping;
        //lavaTexture.wrapT = RepeatWrapping;
        //lavaTexture.repeat.set(14, 20);

        let lavaMaterial = new MeshPhongMaterial({
            map: lavaTexture,
            normalMap: lavaNormalMap,
            side: 2
        })

        this.lava = new Mesh(lavaGeometry, lavaMaterial);

        this.lava.rotation.x = -Math.PI / 2;
        this.lava.position.set(0, 5, 30)

        this.add(this.lava);
    }
}