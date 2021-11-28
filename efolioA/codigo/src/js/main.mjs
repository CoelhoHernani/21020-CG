/*
    UC:             Computação Gráfica
    Efolio:         A
    Autor:          Hernâni Coelho
    Número Aluno:   1800045
    Curso:          Licenciatura em Engenharia Informática
*/

// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import {lineMP} from '../../lineMP.mjs';
export {init};

//Declaração objetos da cena
let scene, camera, renderer, controls, raycaster, mouse;                  
let pointA = {x:{}, y:{}};
let pointB = {x:{}, y:{}};
let arrayVerticesLMP = [];
let arrayLMP = [];
let pointFlag = 0;
let oldX = {}, newX = {};
let oldY = {}, newY = {};

//Função inicial para arrancar com o programa
function init(){
    createScene();              //Criar cena
    createPlane();              //Criar plano do tabuleiro
    drawAxelLines();            //Criar eixos do referencial x, y
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
    const geometrySquare = new THREE.BoxGeometry(1, 1, 0.1);                                    //Geometria do quadrado
    geometrySquare.name = "square";                                                             //Nome para o objeto quadrado
    const board = new THREE.Group();                                                            //Objeto para agrupar todos os cubos
    for (let x = 0; x < 21; x++) {                                                              //Criar o plano de 21 por 21 quadrados alternados
        for (let y = 0; y < 21; y++) {
            let cube;                                                                           //Criar objetos cubos que compõem o tabuleiro
            const leightColor = new THREE.MeshBasicMaterial({ color: 0xf68968 });             //Criar objetos do tipo material de determinada cor e definir nomes
            leightColor.name = "leightColor";
            const darkColor = new THREE.MeshBasicMaterial({ color: 0x8c89b4 });
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
    board.position.set(-10,-10, 0);                                                             //Definir posição da board no espaço
    board.name = "board"
    scene.add(board);                                                                           //Adicionar objeto à cena com nome definido
}

//Posição da Camera inicial
function initialCamera(){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);        //Criar objeto camara para prespetiva humana
    camera.name = "Camara Inicial";
    camera.position.y = -3;                                                    //Posição da camera nos eixos x y z
    camera.position.z = -5;
    camera.position.x = -5;

    controls = new OrbitControls(camera, renderer.domElement);                 //Biblioteca orbit permite controlo da camara em torno de um target
    controls.target.set(0, 0, 0);
    controls.enablePan = true;                                                 //opção de fazer pan está desativa para evitar sair do foco da página
    controls.minPolarAngle = 0;                                                 //Coordenadas polares (vertical) permitem rotação entre 0 e 90º, utilizador pode definir a prespetiva como quer ver
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = 0;                                               
    controls.maxAzimuthAngle = 0;
    controls.enableRotate = true;
    controls.enableDamping = true;
    scene.add(camera);
}
 
//função para gerar eixos x,y do plano
function drawAxelLines(){
    const materialX = new THREE.LineBasicMaterial({ color: 0x1507f7 });           //Eixo x azul
    const pointsX = [];
    pointsX.push( new THREE.Vector3( 0, 0, 0.09 ) );  //x, y, z                     //pontos inicial e final da reta
    pointsX.push( new THREE.Vector3( 10.5, 0, 0.09 ) );
    const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);            //formar linha, unindo vertices anteriores
    const lineX = new THREE.Line( geometryX, materialX );
    lineX.name = "axleX";
    scene.add(lineX);

   
    const materialY = new THREE.LineBasicMaterial({ color: 0xf71207 });           //Eixo y vermelho
    const pointsY = [];
    pointsY.push( new THREE.Vector3( 0, 0, 0.09 ) ); //x, y, z                      //pontos ponto inicial e final da reta
    pointsY.push( new THREE.Vector3( 0, 10.5, 0.09 ) );
   
    const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);            //formar linha, unindo vertices anteriores
    const lineY = new THREE.Line( geometryY, materialY );
    lineY.name = "axleY";
    scene.add(lineY);
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
        case 8:                                                                                 
            resetBoard();               //tecla backspace restaurar cenário inicial              
            break;
        case 88:
            obtainCoordinates(1);       //tecla x guardar coordenadas
            break;  
        default:
            console.log("Por favor selecione uma tecla válida! x para guardar coordenadas ou backspace para restaurar grelha!");
            break;                 
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
        intersects[0].object.material.color.set(0xf71207);
        arrayVerticesLMP.push(intersects[0].object);
        saveCoordinates();       
    }
}

//Obter coordenadas dos quadrados no tabuleiro
function showCoordinates(coordinates){                                                       
    newX = Math.round(coordinates.x);                               //arredondamento para o inteiro que corresponde à posição do quadrado no referencial
    newY = Math.round(coordinates.y);                                                               
    if( newX == oldX && newY == oldY)                               //Evita que faça log de coordenada que não alterou de quadrado
        return;
    else{                                                           //Se mudou, então atualiza x e y "antigo", e faz log na consola
        oldX = newX;
        oldY = newY;
        console.log("x:", newX, "y:", newY);
    }
}

//Guardar as coordenadas do ponto A e do ponto B da LMP A_____________B
function saveCoordinates(){
    if(pointFlag == 0){                         //verifica que é o ponto A
        pointA.x = newX;
        pointA.y = newY;
        pointFlag = 1;   
    }
    else if(pointFlag == 1){                    //Verifica que é o ponto B
        pointB.x = newX;
        pointB.y = newY;
        pointFlag = 0;
        arrayLMP = lineMP(pointA,pointB);       //Calcula o ponto médio, passando à lineMP os objetos literais,ponto A e B. Retorna um array de pontos 
        drawTilesMP(arrayLMP);                  //Desenhar os ladrilhos da LMP e a linha
        drawlineMP(arrayLMP);                   //Desenhar a linha do PM
        arrayLMP.length = [];                    //limpa array da linha já construida

    }
    console.log("Ax:",pointA.x, "Ay:",pointA.y,"Bx:", pointB.x, "By:", pointB.y);   //Log do ponto A e B na consola
}

//Coloca os tiles do ponto médio sobre o plano
function drawTilesMP(arrayLMP){
    const geometrySquare = new THREE.BoxGeometry(1, 1, 0.25);                                                       //Definir geometria do ladrilho a sobrepor
    const tilesGroup = new THREE.Group();
    for (let i = 0; i < arrayLMP.length; i++){
        const materialSquare = new THREE.MeshBasicMaterial({color: 0xf7fb02, transparent: true, opacity: 0.5});     //Define cor a transparencia do ladrilho a sobrepor na grelha
        let tile = new THREE.Mesh(geometrySquare, materialSquare);
        tile.position.x = arrayLMP[i][0];                                                                           //Define a posição dos ladrilhos de acordo com as posições dos pontos da LMP 
        tile.position.y = arrayLMP[i][1];
        tile.position.z = 0.1;
        tile.name = "tile";
        tilesGroup.add(tile);
    }
    tilesGroup.name = "tilesGroup";
    scene.add(tilesGroup);
}

//Função para desenhar a linha do PM
function drawlineMP(arrayLMP){
    const lineMaterial = new THREE.LineBasicMaterial({color: 0x010101});        
    let indexA = 0;                                                 //Posição do ponto A no array de pontos da LMP
    let indexB = arrayLMP.length - 1;                               //Posição do ponto B no array de pontos da LMP
    let pointA_x = arrayLMP[indexA][0];                             //Extração das coordenadas x, y dos pontos
    let pointA_y = arrayLMP[indexA][1];
    let pointB_x = arrayLMP[indexB][0];
    let pointB_y = arrayLMP[indexB][1];
    let linePoints = [];                                            //pontos inicial e final da reta
    linePoints.push( new THREE.Vector3(pointA_x, pointA_y, 0.1 )); //x, y, z
    linePoints.push( new THREE.Vector3(pointB_x, pointB_y, 0.1 ));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);      
    const lineMP = new THREE.Line(lineGeometry, lineMaterial);                  //formar linha, unindo vertices anteriores
    lineMP.name = "lineMP";
    scene.add(lineMP);
}

//Função para restaurar a grelha inicial
function resetBoard(){
    cleanLineLMP();
    cleanTilesLMP();
    resetCubeColor();
    animate();
}

//Função que limpa os tiles da LMP da cena
function cleanTilesLMP(){
    let objectTiles;
    do{
        objectTiles = scene.getObjectByName("tilesGroup");          //Procura objeto e remove do objeto cena
        scene.remove(objectTiles);                              
    }while(objectTiles);
}

//Função que limpa a linha LMP da cena
function cleanLineLMP(){
    let objectLine;
    do{                                                             
        objectLine = scene.getObjectByName("lineMP");               //Procura objeto e remove do objeto cena
        scene.remove(objectLine);                                   
    }while(objectLine);
}

//Função que restaura a cor inicial dos quadrados que foram selecionados 
function resetCubeColor(){
    for(let i = 0; i< arrayVerticesLMP.length; i++){                //Percorre array dos pontos selecionados e restaura a cor de acordo com o que era antes
        if(arrayVerticesLMP[i].material.name == "leightColor")
            arrayVerticesLMP[i].material.color.set(0xf68968);
        else
            arrayVerticesLMP[i].material.color.set(0x8c89b4);
    }
    arrayVerticesLMP = [];                                           //Limpa array para não acomular pontos desnecessários
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

