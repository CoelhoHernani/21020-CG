// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';

import { lineMP } from '../../lineMP.mjs';

let scene, camera, renderer, controls, board; 
var raycaster, mouse;

function init(){
    //Criar cena
    createScene();
    //Criar plano do tabuleiro
    createPlane();
    
}

//Criar a cena
function createScene(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

//Criar o plano do tabuleiro no referencial x,y,z
function createPlane(){
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
        console.log(board);
    }
    board.position.set(-10,-10, 0);
    scene.add(board);

    initialCamera();
    drawAxelLines();    
    animate();
    //window.requestAnimationFrame(animate);

}

//Posição da Camera inicial
function initialCamera(){
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

//Obter Coordenas do rato sobre os pixeis da grelha
window.addEventListener( 'mousemove', onMouseMove, false );
function onMouseMove(event){
    mouse = new THREE.Vector2();
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    window.requestAnimationFrame(rendere);
}

function rendere() {
    raycaster = new THREE.Raycaster();
    //update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    //calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children[0].children );
    
    for ( let i = 0; i < intersects.length; i ++ ) {
        intersects[ i ].object.material.color.set(0xf71207);
        console.log(intersects[i]);
    }
    //console.log(intersects);
}

//Renderização da cena para actualizar
function animate() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

//Redimensionamento da janela
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );    
}

//função que é chamada inicialmente
window.onload = init();

