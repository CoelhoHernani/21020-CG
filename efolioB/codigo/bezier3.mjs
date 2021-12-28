/*
    UC:             Computação Gráfica
    Efolio:         B
    Autor:          Hernâni Coelho
    Número Aluno:   1800045
    Curso:          Licenciatura em Engenharia Informática
*/

//Ficheiro bezier3.mjs
import { biezer3Vetor } from "/src/js/main.mjs";
export {bezier3};                                //exportar a função bezier3

function bezier3(bezierParameters){
    let c0x = bezierParameters.c0.x;            //extração dos pontos do objeto literal, para variaveis com nome mais compacto, para facilitar legibilidade
    let c0y = bezierParameters.c0.y;
    let c0z = bezierParameters.c0.z;
    let c1x = bezierParameters.c1.x;
    let c1y = bezierParameters.c1.y;
    let c1z = bezierParameters.c1.z;
    let c2x = bezierParameters.c2.x;
    let c2y = bezierParameters.c2.y;
    let c2z = bezierParameters.c2.z;
    let c3x = bezierParameters.c3.x;
    let c3y = bezierParameters.c3.y;
    let c3z = bezierParameters.c3.z;
    let t = bezierParameters._t;

    //calculo das coordenadas (x, y e z) aplicando a expressão geral da curva bezier cúbica p(t) = p0(1-t)^3 + p1*3t(1-t)^2 + p2*3t^2(1-t) +p3*t^3
    biezer3Vetor.x = c0x * Math.pow(1-t, 3) + c1x * 3 * t * Math.pow(1-t, 2) + c2x * 3 * Math.pow(t, 2) * (1-t) + c3x * Math.pow(t, 3);
    biezer3Vetor.y = c0y * Math.pow(1-t, 3) + c1y * 3 * t * Math.pow(1-t, 2) + c2y * 3 * Math.pow(t, 2) * (1-t) + c3y * Math.pow(t, 3);
    biezer3Vetor.z = c0z * Math.pow(1-t, 3) + c1z * 3 * t * Math.pow(1-t, 2) + c2z * 3 * Math.pow(t, 2) * (1-t) + c3z * Math.pow(t, 3);

    return biezer3Vetor;    //retorna vetor3 
}