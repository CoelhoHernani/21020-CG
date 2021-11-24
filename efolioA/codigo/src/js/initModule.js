// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

import { lineMP } from '../../lineMP.mjs';

let scene, camera, renderer, cube, controls, board;
let centerRef = [0, 0, 0];

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    const square = new THREE.BoxGeometry(1, 1, 0.1);
    const lightsquare = new THREE.MeshBasicMaterial( { color: 0xf68968 } );
    const darksquare = new THREE.MeshBasicMaterial( { color: 0x8c89b4 });
    
    board = new THREE.Group();
    
    let squareNumber = 1;
    for (let x = 0; x < 21; x++) {
        for (let y = 0; y < 21; y++) {
            let cube;
            if (y % 2 == 0) {
                cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
                if (x % 2 != 0) {
                cube.userData.squareNumber = squareNumber;
                squareNumber++;
                }
            } else {
                cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
                if (x % 2 == 0) {
                cube.userData.squareNumber = squareNumber;
                squareNumber++;
                }
            }
        //posição do cubo no plano ortogonal
        cube.position.set(x, y, 0);
        board.add(cube);
        }
    }
    board.position.set(-10,-10, 0);
    scene.add(board);

    //Posição da camera
    camera.position.y = -15;
    camera.position.z = 15;
    camera.position.x = 0;
    
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
    controls.enableRotate = true;
    controls.enableDamping = true;

    drawAxelLines();
    
    window.requestAnimationFrame(animate);
}

function createScene(){
    
}
 
//Renderização da cena para actualizar
function animate() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}


function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );    
}

//função para gerar eixos x,y do plano
function drawAxelLines(){

    //Eixo x azul
    const materialX = new THREE.LineBasicMaterial( { color: 0x1507f7 } );
    const pointsX = [];
    //pontos inicial e final da reta
    pointsX.push( new THREE.Vector3( 0, 0, 0.09 ) ); //x, y, z
    pointsX.push( new THREE.Vector3( 10.5, 0, 0.09 ) );
    //formar linha, unindo vertices anteriores
    const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
    const lineX = new THREE.Line( geometryX, materialX );
    scene.add(lineX);

    //Eixo y vermelho
    const materialY = new THREE.LineBasicMaterial( { color: 0xf71207 } );
    const pointsY = [];
    //pontos ponto inicial e final da reta
    pointsY.push( new THREE.Vector3( 0, 0, 0.09 ) ); //x, y, z
    pointsY.push( new THREE.Vector3( 0, 10.5, 0.09 ) );
    //formar linha, unindo vertices anteriores
    const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
    const lineY = new THREE.Line( geometryY, materialY );
    scene.add( lineY );
}

window.addEventListener('resize', onWindowResize);

window.onload = init;