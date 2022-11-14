import {
    Object3D,
    TextureLoader,
    MeshBasicMaterial,
    BackSide,
    BoxGeometry,
    Mesh} from "../lib/three.module.js";

export default class SkyBox extends Object3D {

    constructor() {
        super();

        let loader = new TextureLoader();

        let skyGeometry = new BoxGeometry( 1200, 700, 1200);


        let texture_bk = loader.load('resources/skybox/yonder_bk.jpg');
        let texture_dn = loader.load('resources/skybox/yonder_dn.jpg');
        let texture_ft = loader.load('resources/skybox/yonder_ft.jpg');
        let texture_lf = loader.load('resources/skybox/yonder_lf.jpg');
        let texture_rt = loader.load('resources/skybox/yonder_rt.jpg');
        let texture_up = loader.load('resources/skybox/yonder_up.jpg');


        let mat_bk = new MeshBasicMaterial( {
            map: texture_bk,
            side: BackSide
        });


        let mat_dn = new MeshBasicMaterial( {
            map: texture_dn,
            side: BackSide
        });
        let mat_ft = new MeshBasicMaterial( {
            map: texture_ft,
            side: BackSide
        });
        let mat_lf = new MeshBasicMaterial( {
            map: texture_lf,
            side: BackSide
        });
        let mat_rt = new MeshBasicMaterial( {
            map: texture_rt,
            side: BackSide
        });
        let mat_up = new MeshBasicMaterial( {
            map: texture_up,
            side: BackSide
        });

        let materialArray = [];
        materialArray.push(mat_ft);
        materialArray.push(mat_bk);
        materialArray.push(mat_up);
        materialArray.push(mat_dn);
        materialArray.push(mat_rt);
        materialArray.push(mat_lf);

        for(let i =0; i < 6; i++)
            materialArray[i].side = BackSide;

        let skybox = new Mesh( skyGeometry, materialArray );
        this.add( skybox );
    }
}