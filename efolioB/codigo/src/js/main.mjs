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
    createControlBalls();       //Criar bolas referentes aos pontos c0, c1, c2 e c3
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
    for (let x = 0; x < 20; x++) {                                                              //Criar o plano de 20 por 20 quadrados alternados
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

//Classe para construção de objetos do tipo curve da biblioteca THREE
class bezierCurve extends THREE.Curve {
	constructor( ) {
		super();                                                            //usado para ter acesso à classe pai de uma classe, neste caso da THREE.Curve
	}
	getPoint( t, coordinates = new THREE.Vector3() ) {
        let aux = new THREE.Vector3();
        bezierParameters._t = t;
        aux = bezier3(bezierParameters);                            //evocação da função bezier para calcular pontos da curva em cada instante de t 
        return coordinates.set( aux[0], aux[1], aux[2] );
	}
}

//função para criar objeto da curva bezier
function bezierCurveDraw(){
    const path = new bezierCurve();                                         //objeto da curva bezier
    const geometry = new THREE.TubeGeometry( path, 64, 0.1, 8, false );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const tube = new THREE.Mesh( geometry, material );
    tube.name = "tube";
    scene.add(tube);
}

//função para criação das bolas referentes aos pontos de controlo c0, c1, c2 e c3
function createControlBalls(){
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);                                    //Geometria da esfera
    sphereGeometry.name = "sphereGeometry";
    const yellowMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.5});     //bolas semi transparentes
    const redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    const greenMaterial = new THREE.MeshBasicMaterial({color: 0x00cc00, transparent: true, opacity: 0.5});
    const blueMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.5});
    const yellowBall = new THREE.Mesh(sphereGeometry, yellowMaterial);
    yellowBall.name = "yellowBall";
    const redBall = new THREE.Mesh(sphereGeometry, redMaterial);
    redBall.name = "redBall";
    const greenBall = new THREE.Mesh(sphereGeometry, greenMaterial);
    greenBall.name = "greenBall";
    const blueBall = new THREE.Mesh(sphereGeometry, blueMaterial);
    blueBall.name = "blueBall";
    scene.add(yellowBall, redBall, greenBall, blueBall);
    setOriginalBallPositions();                                 //posiciona a posição inicial das bolas
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
            moveSelectedBallOnXY();     //tecla espaço move bola selecionada para o ponto onde se encontra o rato
            break;
        case 49:
            selectBall("yellowBall");   //tecla 1 seleciona bola amarela
            break;
        case 50:
            selectBall("redBall");      //tecla 2 seleciona bola vermelha
            break;
        case 51:
            selectBall("greenBall");    //tecla 3 seleciona bola verde
            break;
        case 52:
            selectBall("blueBall");     //tecla 4 seleciona bola azul
            break;
        case 83:
            moveSelectedBallOnZ("down");    //tecla s move bola selecionada para baixo
            break
        case 87:
            moveSelectedBallOnZ("up");      //tecla w move bola selecionada para cima
            break;
        case 8:                                                                                 
            resetBoard();               //tecla backspace restaurar cenário inicial              
            break;
        case 88:
            bezierCurveDraw();       //tecla x desenha curva bezier
            break;  
        default:
            console.log("Por favor selecione uma tecla válida! x para guardar coordenadas ou backspace para restaurar grelha!");
            break;                 
    }
}

//função que atualiza a bola selecionada e altera a opacidade da mesma
function selectBall(ballColor){
    selectedBall = scene.getObjectByName(ballColor);
    selectedBall.material.opacity = 1;
    
}

//função que move a bola selecionada nos eixos x, y
function moveSelectedBallOnXY(){
    obtainCoordinates(1);                       //guardar coordenadas dos pontos de controlo bezier, conforme posição do rato
    if (selectedBall.name == "yellowBall"){     //conforme a bola que está selecionada, definir sua posição conforme os pontos de controlo bezier
        selectedBall.position.set(bezierParameters.c0.x, bezierParameters.c0.y, bezierParameters.c0.z);
    } else if (selectedBall.name == "redBall"){
        selectedBall.position.set(bezierParameters.c1.x, bezierParameters.c1.y, bezierParameters.c1.z);
    } else if (selectedBall.name == "greenBall"){
        selectedBall.position.set(bezierParameters.c2.x, bezierParameters.c2.y, bezierParameters.c2.z);
    } else if (selectedBall.name == "blueBall"){
        selectedBall.position.set(bezierParameters.c3.x, bezierParameters.c3.y, bezierParameters.c3.z);
    }
    prependicularBallLine();                //desenhar linha prependicular à bola
    updateTextBox();                        //atualizar informação para tela
}

//função que move bola selecionada no eixo z
function moveSelectedBallOnZ(option){
    if (option == "up"){                                //guardar coordenada z do ponto controlo bezier conforme bola seleccionada
        let z = selectedBall.position.z + 0.1;
        saveZCoordinate(z);
    } else {
        let z = selectedBall.position.z - 0.1;
        saveZCoordinate(z);
    }
    if (selectedBall.name == "yellowBall"){                 //atualizar coordelada z da bola selecionada
        selectedBall.position.z = bezierParameters.c0.z;
    } else if (selectedBall.name == "redBall"){
        selectedBall.position.z = bezierParameters.c1.z;
    } else if (selectedBall.name == "greenBall"){
        selectedBall.position.z = bezierParameters.c2.z;
    } else if (selectedBall.name == "blueBall"){
        selectedBall.position.z = bezierParameters.c3.z;
    }
    updateTextBox(); 
    prependicularBallLine();
}

//função que adiciona linha auxiliar prependicular ao tabuleiro quando as bolas estão acima ou abaixo do tabuleiro
function prependicularBallLine(){
    cleanBallLine();                    //limpar linha prependicular, para atualizar de seguida 
    let string = "";
    let BallLineMaterial = new THREE.LineBasicMaterial({ color: 0xccffff});
    let BallLinePoints = [];
    BallLinePoints.push( new THREE.Vector3( selectedBall.position.x, selectedBall.position.y, 0 ) );  //x, y, z                     //pontos inicial e final da reta
    BallLinePoints.push( new THREE.Vector3( selectedBall.position.x, selectedBall.position.y, selectedBall.position.z));
    let BallLineGeometry = new THREE.BufferGeometry().setFromPoints(BallLinePoints);            //formar linha, unindo vertices anteriores
    let BallLine = new THREE.Line(BallLineGeometry, BallLineMaterial );
    BallLine.name = string.concat(selectedBall.name, "Line");            
    scene.add(BallLine);
}

//Obter coordenadas na grelha
function obtainCoordinates(option) {
    raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);                                         //Atualiza raycaster bom base na posição do rato e qual a camera escolhida para visualizar
    const intersects = raycaster.intersectObjects(scene.children[0].children);      //Verifica as interseções entre o rato e os objetos da cena, neste caso cubos
    if(option == 0){                                                                //se 0, então apenas faz log para consola
        if(intersects[0])
            showCoordinates(intersects[0].point);                                  
    }
    else if (option == 1){                                                          //se 1, então guarda as coordenadas em x e y
        saveXYCoordinates(intersects[0].point);       
    }
}

//Obter coordenadas dos quadrados no tabuleiro
function showCoordinates(coordinates){                                                       
    console.log("x:", parseFloat(coordinates.x).toFixed(3), "y:", parseFloat(coordinates.y).toFixed(3)); //Apresenta coordenadas em float arredondado a 3 casas decimais
}

//função para guardar a coordenada z da bola selecionada
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

//função para guardar coordenadas x e y da bola selecionada
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
    clearBezierTubes();
    cleanLines();
    setOriginalBallPositions();
    animate();
}

//função para limpar as beziers desenhadas
function clearBezierTubes(){
    let tube;
    do{
        tube = scene.getObjectByName("tube");
        scene.remove(tube);
    }while (tube);
}

//função para limpar a linha prependicular, desatualizda, da bola selecionada 
function cleanBallLine(){
    let string = "";
    let line = scene.getObjectByName(string.concat(selectedBall.name, "Line"));
    scene.remove(line);
}

//função para limpar todas as linhas prependiculares 
function cleanLines(){
    let line = scene.getObjectByName("yellowBallLine");
    scene.remove(line);
    line = scene.getObjectByName("redBallLine");
    scene.remove(line);
    line = scene.getObjectByName("greenBallLine");
    scene.remove(line);
    line = scene.getObjectByName("blueBallLine");
    scene.remove(line);
}

//função para definir posições iniciais das bolas
function setOriginalBallPositions(){
    let ball;
    ball = scene.getObjectByName("yellowBall");
    ball.position.set(4,4,0);
    ball = scene.getObjectByName("redBall");
    ball.position.set(-4,-4,0);
    ball = scene.getObjectByName("greenBall");
    ball.position.set(-4,4,0);
    ball = scene.getObjectByName("blueBall");
    ball.position.set(4,-4,0);
}

//função para atualizar caixa de texto que indica a bola selecionada e as suas coordenadas
function updateTextBox(){
    let string = ""; 
    let outputTextCoord = string.concat("x:", parseFloat(selectedBall.position.x).toFixed(3), " y:", parseFloat(selectedBall.position.y).toFixed(3), " z:", parseFloat(selectedBall.position.z).toFixed(3));
    document.getElementById("Ball").value = selectedBall.name;
    document.getElementById("coordinates").value = outputTextCoord;
    
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

