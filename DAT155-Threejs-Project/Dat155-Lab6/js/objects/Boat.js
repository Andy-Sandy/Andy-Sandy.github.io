import {
    Object3D,
    TextureLoader,
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    DoubleSide
} from "../lib/three.module.js";


export default class Boat extends Object3D {
    constructor(scene) {
        super();
        this.scene = scene;

        // Texture Loading
        let loader = new TextureLoader();
        let texture = loader.load('resources/models/box/crate0_diffuse.png');
        let bumpMap = loader.load('resources/models/box/crate0_bump.png');
        let normalMap = loader.load('resources/models/box/crate0_normal.png');

        // Create mesh with these textures
        let boat = new Mesh(
            new BoxGeometry(10, 10, 10),
            new MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
                bumpMap: bumpMap,
                normalMap: normalMap,
                side: DoubleSide
            })
        );

        boat.position.set(0, 10, 0);

        boat.receiveShadow = true;
        boat.castShadow = true;

        this.add(boat);

    }
}
