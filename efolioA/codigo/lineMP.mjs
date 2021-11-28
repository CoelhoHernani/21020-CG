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
    let slope = variable.dy / variable.dx;                            //declive da reta
    if(slope < 0){                                                    //Verifica se declive é negativo
        variable.symmetric = true;                                
        variable.dy = -variable.dy;                                 
        pointA.y = -pointA.y;                                      //troca para valores simétricos dos pontos por estarem num octante que não o padrão
        pointB.y = -pointB.y;
    }
    if(Math.abs(variable.dx)< Math.abs(variable.dy)){             //Verifica se em modulo, dx é inferior a dy 
        variable.slope = true;                                   
        let aux = pointA.x;                                         
        pointA.x = pointA.y;                                        
        pointA.y = aux;
        aux = pointB.x;
        pointB.x = pointB.y;                                    //troca a ordem dos pontos e dos delta
        pointB.y = aux;
        aux = variable.dx;                                         
        variable.dx = variable.dy;
        variable.dy = aux;
    }
    if( pointA.x > pointB.x){                                   //verifica se o x de A é superior ao x de B
        let aux = pointA.x;                                         
        pointA.x = pointB.x;
        pointB.x = aux;
        aux = pointA.y;                                        //troca a ordem dos pontos e simetrico dos deltas
        pointA.y = pointB.y;
        pointB.y = aux;
        variable.dx = -variable.dx;                              
        variable.dy = -variable.dy;
    }
}

function lineMP(pointA, pointB){
    let points =[];                             
    let variable = {symmetric:false,           
                    slope:false,              
                    dx:pointB.x - pointA.x,     
                    dy:pointB.y - pointA.y};    
    verifyConditionsLMP(variable, pointA, pointB);               //Verificar condições de partida do LMP
    let d = 2 * variable.dy - variable.dx;                       //calculo base para os incrementos                       
    let incrementE = 2 * variable.dy;                            //incrementar no sentido E
    let incrementNE = 2 * (variable.dy -variable.dx);            //incrementar no sentido NE
    let y = pointA.y; 
    for (let x = pointA.x; x < pointB.x; x++){                   //Calcular os pontos da reta do pontoA ao pontoB 
        points.push([x,y]);                     
        if(d <= 0){
            d += incrementE;                                       
        } 
        else if(d > 0) {
            y++;                                                   
            d += incrementNE;                                     
        }
    }
    points.push([pointB.x,pointB.y]);                        //Adicionar ultimo ponto da linha
    for(let i = 0; i < points.length; i++){                  //Percorrer array e atualizar valores
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