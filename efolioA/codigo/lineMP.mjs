/*
    UC:             Computação Gráfica
    Efolio:         A
    Autor:          Hernâni Coelho
    Número Aluno:   1800045
    Curso:          Licenciatura em Engenharia Informática
*/

//Ficheiro lineMP.mjs

export {lineMP};                                //exportar a função lineMP

function verifyConditionsLMP (variable,pointA, pointB){
    let slope = variable.dy * variable.dx;                            //declive da reta
    if(slope < 0){                                                    //Verifica se declive é negativo
        variable.symmetric = true;                                
        variable.dy = -variable.dy;                                 //Substituir os valores de y de ambos os extremos pelos valores simetricos isto por não estarem no octante padrão
        pointA.y = -pointA.y;                       
        pointB.y = -pointB.y;
    }
    if(Math.abs(variable.dx)< Math.abs(variable.dy)){             //Verifica se valor absoluto, dx é inferior a dy 
        variable.slope = true;                                   
        let aux = pointA.x;                                         
        pointA.x = pointA.y;                                        
        pointA.y = aux;
        aux = pointB.x;
        pointB.x = pointB.y;                                    //troca valores das coordenadas e dos valores dx e dy
        pointB.y = aux;
        aux = variable.dx;                                         
        variable.dx = variable.dy;
        variable.dy = aux;
    }
    if( pointA.x > pointB.x){                                   //verifica se o x de A é superior ao x de B
        let aux = pointA.x;                                         
        pointA.x = pointB.x;
        pointB.x = aux;
        aux = pointA.y;                                        //troca a ordem dos pontos e aplicar simetrico dx e dy
        pointA.y = pointB.y;
        pointB.y = aux;
        variable.dx = -variable.dx;                              
        variable.dy = -variable.dy;
    }
}

function lineMP(pointA, pointB){
    let points =[];                             
    let variable = {symmetric:false,                            //variavel auxiliar para verificar retas fora do primeiro octante
                    slope:false,              
                    dx:pointB.x - pointA.x,     
                    dy:pointB.y - pointA.y};    
    
    verifyConditionsLMP(variable, pointA, pointB);               //Verificar condições de partida do LMP
    
    let d = 2 * variable.dy - variable.dx;                       //calculo base para os incrementos                       
    let incE = 2 * variable.dy;                            //incrementar no sentido E
    let incNE = 2 * (variable.dy -variable.dx);            //incrementar no sentido NE
    let y = pointA.y; 
    for (let x = pointA.x; x < pointB.x; x++){              //Calcular os pontos da reta do pontoA ao pontoB 
        points.push([x,y]);                     
        if(d <= 0){                                              
            d += incE;                                       
        } 
        else if(d > 0) {
            y++;                                                   
            d += incNE;                                     
        }
    }
    points.push([pointB.x,pointB.y]);                        //Adicionar ultimo ponto da linha
    for(let i = 0; i < points.length; i++){                  //Atualiza valores, caso seja uma reta fora do primeiro octante é necessário inverter a transformação
        let x = points[i][0];
        let y = points[i][1];
        if(variable.slope == true){                          //Verificar se existiu troca de coordenadas    
            let aux = x;                                         
            x = y;
            y = aux;
        }
        if(variable.symmetric == true){                     //Verificar se existiu troca coordenadas para simétricos
            y = -y;                                                 
        }
        points[i]= [x,y];
    }
   return points;                       //retorna array de pontos que forma a linha ponto médio
}