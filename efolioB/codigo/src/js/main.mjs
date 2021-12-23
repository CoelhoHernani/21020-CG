/*
    UC:             Computação Gráfica
    Efolio:         B
    Autor:          Hernâni Coelho
    Número Aluno:   1800045
    Curso:          Licenciatura em Engenharia Informática
*/

// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import {bezier3} from '../../bezier3.mjs';
export {init};

//Declaração objetos da cena
let scene, camera, renderer, controls, raycaster, mouse;                  
let bezierParameters = {c0:new THREE.Vector3(4,4,0), c1:new THREE.Vector3(-4,-4,0), c2:new THREE.Vector3(-4,4,0), c3:new THREE.Vector3(4,-4,0), _t:0};
let selectedBall;

//Função inicial para arrancar com o programa
function init(){
    createScene();              //Criar cena
    createPlane();              //Criar plano do tabuleiro
    drawAxelLines();            //Criar eixos do referencial x, y, z
    createControlBalls();
    initialCamera();            //Setup da camera inicial
    animate();                  //rendirizar a cena para atualizar
}

//Função para criar a cena
function createScene(){
    scene = new THREE.Scene();                                                                          //Criar objeto cena 
    scene.name = "GraphicalMidlePointDemonstration";                                                    //Atribuir nome a cena
    renderer = new THREE.WebGLRenderer({antialias: true});                                              //Criar renderer da cena
    renderer.setSize(window.innerWidth, window.innerHeight);                                            //Definir size do renderer
    document.body.appendChild(renderer.domElement);                                                     //Adicionar renderer na páginaWb
}

//Função criar o plano do tabuleiro no referencial x,y,z
function createPlane(){
    const geometrySquare = new THREE.BoxGeometry(1, 1, 0.01);                                    //Geometria do quadrado
    geometrySquare.name = "square";                                                             //Nome para o objeto quadrado
    const board = new THREE.Group();                                                            //Objeto para agrupar todos os cubos
    for (let x = 0; x < 20; x++) {                                                              //Criar o plano de 21 por 21 quadrados alternados
        for (let y = 0; y < 20; y++) {
            let cube;                                                                           //Criar objetos cubos que compõem o tabuleiro
            const leightColor = new THREE.MeshBasicMaterial({ color: 0xf68968, transparent: true, opacity: 0.5 });             //Criar objetos do tipo material de determinada cor e definir nomes
            leightColor.name = "leightColor";
            const darkColor = new THREE.MeshBasicMaterial({ color: 0x8c89b4, transparent: true, opacity: 0.5 });
            darkColor.name = "darkColor";
            if (y % 2 == 0) {
                cube = new THREE.Mesh(geometrySquare, x % 2 == 0 ? leightColor : darkColor);    //Com base na paridade da posição definir a cor atribuir
            } else {
                cube = new THREE.Mesh(geometrySquare, x % 2 == 0 ? darkColor : leightColor);
            }
        cube.position.set(x, y, 0);                                                             //posição do cubo no plano ortogonal
        cube.name = "cube";                                                                     
        board.add(cube);                                                                        //Adicionar cubos ao objeto board, formando um grupo de objetos
        }
    }
    board.position.set(-9.5,-9.5, 0);                                                             //Definir posição da board no espaço
    board.name = "board"
    scene.add(board);                                                                           //Adicionar objeto à cena com nome definido
}

//Posição da Camera inicial
function initialCamera(){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);        //Criar objeto camara para prespetiva humana
    camera.name = "Camara Inicial";
    camera.position.y = 0;                                                    //Posição da camera nos eixos x y z
    camera.position.z = 30;
    camera.position.x = 0;

    controls = new OrbitControls(camera, renderer.domElement);                 //Biblioteca orbit permite controlo da camara em torno de um target
    controls.target.set(0, 10, -10);
    scene.add(camera);
}
 
//função para gerar eixos x, y, z do plano
function drawAxelLines(){
    const axes = new THREE.AxesHelper(10);                    //adiciona eixos x, y, z no tabuleiro
    axes.name = "ReferencialAxes";
    scene.add(axes);

}

class CustomSinCurve extends THREE.Curve {
	constructor( ) {
		super();                                                            //usado para ter acesso à classe pai de uma classe, neste caso da THREE.Curve
	}
	getPoint( t, optionalTarget = new THREE.Vector3() ) {
        let vectorC = new THREE.Vector3();
        bezierParameters._t = t;
        vectorC = bezier3(bezierParameters);
        return optionalTarget.set( vectorC[0], vectorC[1], vectorC[2] );
	}
}

function bezierCurveDraw(){
    const path = new CustomSinCurve();
    const geometry = new THREE.TubeGeometry( path, 64, 0.1, 8, false );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const tube = new THREE.Mesh( geometry, material );
    tube.name = "tube";
    scene.add(tube);
}

function createControlBalls(){
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);                                    //Geometria do quadrado
    sphereGeometry.name = "sphereGeometry";
    const yellowMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.5});
    const redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    const greenMaterial = new THREE.MeshBasicMaterial({color: 0x00cc00, transparent: true, opacity: 0.5});
    const blueMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.5});
    const yellowBall = new THREE.Mesh(sphereGeometry, yellowMaterial);
    yellowBall.name = "yellowBall";
    yellowBall.position.set(4, 4, 0);
    const redBall = new THREE.Mesh(sphereGeometry, redMaterial);
    redBall.name = "redBall";
    redBall.position.set(-4, -4, 0);
    const greenBall = new THREE.Mesh(sphereGeometry, greenMaterial);
    greenBall.name = "greenBall";
    greenBall.position.set(-4, 4, 0);
    const blueBall = new THREE.Mesh(sphereGeometry, blueMaterial);
    blueBall.name = "blueBall";
    blueBall.position.set(4, -4, 0);
    scene.add(yellowBall, redBall, greenBall, blueBall);
}

//Verifica se rato está mover-se
window.addEventListener('mousemove', onMouseMove, false);
//Obter Coordenas do rato sobre os pixeis da grelha
function onMouseMove(event){
    mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;                    //Calcular posição x,y do rato com base nas suas coordenadas normalizadas (-1 a 1)
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    obtainCoordinates(0);                                                       //chama função para apresentar na consola as coordenadas dos cubos na grelha, argumento 0 para apenas apresentar na consola 
}

//Verifica se tecla foi presionada
window.addEventListener("keydown", KeyboardPress, false);      
//Função para aceitar os eventos da tecla
function KeyboardPress(event){
    let key = event.which;
    switch (key){
        case 32:
            moveSelectedBallOnXY();
            break;
        case 49:
            selectBall("yellowBall");
            break;
        case 50:
            selectBall("redBall");
            break;
        case 51:
            selectBall("greenBall");
            break;
        case 52:
            selectBall("blueBall");
            break;
        case 83:
            moveSelectedBallOnZ("down");
            break
        case 87:
            moveSelectedBallOnZ("up");
            break;
        case 8:                                                                                 
            resetBoard();               //tecla backspace restaurar cenário inicial              
            break;
        case 88:
            bezierCurveDraw();       //tecla x guardar coordenadas
            break;  
        default:
            console.log("Por favor selecione uma tecla válida! x para guardar coordenadas ou backspace para restaurar grelha!");
            break;                 
    }
}

function selectBall(ballColor){
    selectedBall = scene.getObjectByName(ballColor);
    selectedBall.material.opacity = 1;
}

function moveSelectedBallOnXY(){
    obtainCoordinates(1);
    if (selectedBall.name == "yellowBall"){
        selectedBall.position.set(bezierParameters.c0.x, bezierParameters.c0.y, bezierParameters.c0.z);
    } else if (selectedBall.name == "redBall"){
        selectedBall.position.set(bezierParameters.c1.x, bezierParameters.c1.y, bezierParameters.c1.z);
    } else if (selectedBall.name == "greenBall"){
        selectedBall.position.set(bezierParameters.c2.x, bezierParameters.c2.y, bezierParameters.c2.z);
    } else if (selectedBall.name == "blueBall"){
        selectedBall.position.set(bezierParameters.c3.x, bezierParameters.c3.y, bezierParameters.c3.z);
    }
}

function moveSelectedBallOnZ(option){
    if (option == "up"){
        let z = selectedBall.position.z + 0.1;
        saveZCoordinate(z);
    } else {
        let z = selectedBall.position.z - 0.1;
        saveZCoordinate(z);
    }
    if (selectedBall.name == "yellowBall"){
        selectedBall.position.z = bezierParameters.c0.z;
    } else if (selectedBall.name == "redBall"){
        selectedBall.position.z = bezierParameters.c1.z;
    } else if (selectedBall.name == "greenBall"){
        selectedBall.position.z = bezierParameters.c2.z;
    } else if (selectedBall.name == "blueBall"){
        selectedBall.position.z = bezierParameters.c3.z;
    }
}

//Obter coordenadas dos cubos na grelha
function obtainCoordinates(option) {
    raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);                                         //Atualiza raycaster bom base na posição do rato e qual a camera escolhida para visualizar
    const intersects = raycaster.intersectObjects(scene.children[0].children);      //Verifica as interseções entre o rato e os objetos da cena, neste caso cubos
    if(option == 0){                                                                //se 0, então apenas faz log para consola
        if(intersects[0])
            showCoordinates(intersects[0].point);
    }
    else if (option == 1){                                                          //se 1, então altera cor do cubo e guarda coordenadas para calcular LMP
        saveXYCoordinates(intersects[0].point);       
    }
}

//Obter coordenadas dos quadrados no tabuleiro
function showCoordinates(coordinates){                                                       
    console.log("x:", parseFloat(coordinates.x).toFixed(3), "y:", parseFloat(coordinates.y).toFixed(3)); //Apresenta coordenadas em float arredondado a 3 casas decimais
}

function saveZCoordinate(z){
    if (selectedBall.name == "yellowBall"){
        bezierParameters.c0.z = z;
    } else if (selectedBall.name == "redBall"){
        bezierParameters.c1.z = z;
    } else if (selectedBall.name == "greenBall"){
        bezierParameters.c2.z = z;
    } else if (selectedBall.name == "blueBall") {
        bezierParameters.c3.z = z;
    }
}

//Guardar as coordenadas do ponto A e do ponto B da LMP A_____________B
function saveXYCoordinates(coordinates){
    if (selectedBall.name == "yellowBall"){
        bezierParameters.c0.x = coordinates.x;
        bezierParameters.c0.y = coordinates.y;
    } else if (selectedBall.name == "redBall"){
        bezierParameters.c1.x = coordinates.x;
        bezierParameters.c1.y = coordinates.y;
    } else if (selectedBall.name == "greenBall"){
        bezierParameters.c2.x = coordinates.x;
        bezierParameters.c2.y = coordinates.y;
    } else if (selectedBall.name == "blueBall") {
        bezierParameters.c3.x = coordinates.x;
        bezierParameters.c3.y = coordinates.y;
    }
}

//Função para restaurar a grelha inicial
function resetBoard(){
    //scene.clear();
    //init();
    animate();
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
    camera.aspect = window.innerWidth / window.innerHeight;             //Atualiza o aspecto ratio da cena para a nova janela
    camera.updateProjectionMatrix();                                    //Atualiza camara
    renderer.setSize( window.innerWidth, window.innerHeight );          //Renderização do ouput das novas dimensões
}

