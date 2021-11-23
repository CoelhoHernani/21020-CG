// Código Javascript que executa as funções solicitadas    
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'

import { lineMP } from "./lineMP.mjs";

export {desenhar};
//Ler Coordenadas do Formulário
function desenhar(){
    let texto = document.getElementById("coordenadas").value;              //Ler Conteudo do formulário
    let coord = texto.split(" ");                                          //Dividir o texto em coordenadas
    if(coord.length == 4){
        let p1 = {x:Number(coord[0]), y:Number(coord[1])};                    //Definir objeto literal p1
        let p2 = {x:Number(coord[2]), y:Number(coord[3])};                    //Definir objeto literal p2
        let pontos = lineMP(p1,p2);                                           //Obter Pontos a desenhar       
        //Desenhar os pontos gerados
        for(let i = 0; i< pontos.length; i++){
            let ponto = pontos[i];                                             //Obter Array das Coordenadas no Array
            let x = ponto[0];                                                  //Definir X com o primeiro valor do Array de Coordenadas
            let y = ponto[1];                                                  //Definir Y com o segundo  valor no array de coordenadas
            x = x*fatPixelSize+centerRef[0];                                   //Calcular as posições x e y
            y = y*fatPixelSize+centerRef[1];                                   //onde o cubo vai ser colocado
            drawPixel(x,y);                                                    //Desenhar o Pixel na cena
            renderer.render(cena,camera);                                      //Atualiza a Cena na camera                    
        }
        limparSelecao();                                                       //Colocar os pontos clicados ao estado Original
    }
    document.querySelector('button').addEventListener('click', desenhar);
}

function init(){
    let scene = new THREE.scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    
}