// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';

import {lineMP} from '../../lineMP.mjs';

let scene, camera, renderer, controls, board; 
let oldX = {}, newX = {};
let oldY = {}, newY = {};
var raycaster, mouse;
let pointA = {x:{}, y:{}};
let pointB = {x:{}, y:{}};
let arrayLMP;
let pointFlag = 0;

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
    board = new THREE.Group();
    let squareNumber = 1;
    //Criar o plano de 21 por 21 quadrados alternados
    for (let x = 0; x < 21; x++) {
        for (let y = 0; y < 21; y++) {
            let cube;
            const lightsquare = new THREE.MeshBasicMaterial( { color: 0xf68968 } );
            const darksquare = new THREE.MeshBasicMaterial( { color: 0x8c89b4 });
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
    scene.add(lineY);
}

//Obter Coordenas do rato sobre os pixeis da grelha
window.addEventListener( 'mousemove', onMouseMove, false );
function onMouseMove(event){
    mouse = new THREE.Vector2();
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //chama função para apresentar na consola as coordenadas 
    obtainCoordinates(0);
    //window.requestAnimationFrame(obtainCoordinates);
}

//Verifica se tecla foi presionada
window.addEventListener("keydown", KeyboardPress, false);      
//Função para aceitar os eventos da tecla
function KeyboardPress(event){
    let key = event.which;
    switch (key){
        case 8:                                                                                 
            //clean();              //tecla backspace restaurar cenário inicial              
            //break;
            break;
        case 88:
            obtainCoordinates(1);    //tecla x guardar coordenadas 
            break;  
        default:
            console.log("Por favor selecione uma tecla válida! x para guardar coordenadas ou backspace para restaurar grelha!");
            break;                 
    }
}

function obtainCoordinates(option) {
    raycaster = new THREE.Raycaster();
    //update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    //calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children[0].children);

    //for ( let i = 0; i < intersects.length; i++ ) {
        if(option == 0){
            if(intersects[0])
                Coordinates(intersects[0].point);
        }
        else if (option == 1){
            saveCoordinates();
            intersects[0].object.material.color.set(0xf71207);
        }
        
        //console.log(intersects[0]);
    //}
}

//Obter coordenadas dos quadrados no tabuleiro
function Coordinates(coordinates){
    //arredondamento para o inteiro que corresponde à posição do quadrado no referencial
    newX = Math.round(coordinates.x);
    newY = Math.round(coordinates.y);
    //Evita que faça log de coordenada que não alterou de quadrado
    if( newX == oldX && newY == oldY)
        return;
    else{
        oldX = newX;
        oldY = newY;
        console.log("x:", newX, "y:", newY);
    }
}

//Guardar as coordenadas do ponto A e do ponto B
function saveCoordinates(){
    if(/*newX && newY && */pointFlag == 0){
        pointA.x = newX;
        pointA.y = newY;
        pointFlag = 1;   
    }
    else if(/*newX && newY &&*/ pointFlag == 1){
        pointB.x = newX;
        pointB.y = newY;
        pointFlag = 0;
        arrayLMP = lineMP(pointA,pointB);
        drawTilesPM(arrayLMP);
        arrayLMP.length = 0;            //limpa array da linha já construida

    }
    console.log("Ax:",pointA.x, "Ay:",pointA.y,"Bx:", pointB.x, "By:", pointB.y);
}

//Coloca os tiles do ponto médio sobre o plano
function drawTilesPM(arrayLMP){
    const geometrySquare = new THREE.BoxGeometry(1, 1, 0.25);
    for (let i = 0; i < arrayLMP.length; i++){
        const materialSquare = new THREE.MeshBasicMaterial({color: 0xf7fb02, transparent: true, opacity: 0.5});
        let tile = new THREE.Mesh(geometrySquare, materialSquare);
        tile.position.x = arrayLMP[i][0];
        tile.position.y = arrayLMP[i][1];
        tile.position.z = 0.1;
        tile.name = "tile";
        scene.add(tile);
        drawLinePM(arrayLMP);
    }
}

function drawLinePM(arrayLMP){
    const lineMaterial = new THREE.LineBasicMaterial({color: 0x010101});
    let indexA = 0;
    let indexB = arrayLMP.length - 1;
    let pointA_x = arrayLMP[indexA][0];
    let pointA_y = arrayLMP[indexA][1];
    let pointB_x = arrayLMP[indexB][0];
    let pointB_y = arrayLMP[indexB][1];
    //pontos inicial e final da reta
    let linePoints = [];
    linePoints.push( new THREE.Vector3( pointA_x, pointA_y, 0.1 ) ); //x, y, z
    linePoints.push( new THREE.Vector3( pointB_x, pointB_y, 0.1 ) );
    //formar linha, unindo vertices anteriores
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const linePM = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(linePM);
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

