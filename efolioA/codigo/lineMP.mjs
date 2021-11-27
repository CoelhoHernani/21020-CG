/*
    UC:             Computação Gráfica
    Efolio:         A
    Autor:          Hernâni Coelho
    Número Aluno:   1800045
    Curso:          Licenciatura em Engenharia Informática
*/

//Ficheiro lineMP.mjs

export {lineMP};                                //exportar a função lineMP como um modulo

function lineMP(pontoA, pontoB){
    let simetrico = false;                      //Variavel auxiliar para verificar se existiu trocas de valores
    let declive = false;                        //dos pontos devido a estarem noutro octante que não o padrão
    let x1 = pontoA.x;
    let y1 = pontoA.y;
    let x2 = pontoB.x;
    let y2 = pontoB.y;
    let dx = x2 - x1;                           //DeltaX
    let dy = y2 - y1;                           //DeltaY
    let pontos =[];
    
    let m = dx / dy;                            //Declive da reta
    if(m < 0){                                  //Verifica se declive é negativo
        simetrico = true;                       //Se for negativo atualiza valor de simetrico
        dy = -dy;                               //e troca valores de deltay e y1 e y2
        y1 = -y1;                               //para valores simétricos
        y2 = -y2;
    }
    if(Math.abs(dx)< Math.abs(dy)){             //Verifica se o valor (absoluto) de deltaX é infeior ao de deltaY 
        declive = true;                         //Se for atualiza o valor de declive
        let aux = x1;                           //e troca a ordem das coordenadas (x,y) para (y,x)
        x1 = y1;                                //de ambos os pontos
        y1 = aux;
        aux = x2;
        x2 = y2;
        y2 = aux;
        aux = dx;                               //e dos delta também
        dx = dy;
        dy = aux;
    }
    if( x1 > x2){                               //verifica se valor de x1 é superior ao de x2 
        let aux = x1;                           //Caso seja troca a ordem dos pontos 
        x1 = x2;
        x2 = aux;
        aux = y1;
        y1 = y2;
        y2 = aux;
        dx = -dx;                               //e troca os deltas para os valores simétricos deles
        dy = -dy;
    }
    
    let y = y1;                         
    let incrementoE = 2 * dy;                   //Incremento para E
    let incrementoNE = 2 * (dy -dx);            //Incremento para NE
    let d = 2 * dy - dx;                        //Valor de calculo base para os incrementos
    for (let x = x1; x< x2; x++){               //Calcula os pontos 
        pontos.push([x,y]);                     
        if(d <= 0){
            d += incrementoE;                   //Se d for negativo ou nulo incrementa d para E
        } else {
            y++;                                //Se d for positivo incrementa y 
            d += incrementoNE;                  //e d incrementa para NE
        }
    }
    pontos.push([x2,y2]);                       //Adiciona a ultima coordenada da extremidade da linha
    for(let i = 0; i < pontos.length; i++){     //Percorre o arrei de pontos Para atualizar os valores com base nas variáveis auxiliares
        let x = pontos[i][0];
        let y = pontos[i][1];
        if(declive == true){                    //Verifica se existiu troca de coordenadas    
            let aux = x;                        //Caso exista volta a trocar x com y (calculados)
            x = y;
            y = aux;
        }
        if(simetrico == true){                  //Verifica se existiu troca de valores para simétricos
            y = -y;                             //Caso exista volta a trocar y (calculado) para o seu simétrico
        }
        pontos[i]= [x,y];                       //Atualiza os valores no array de pontos
    }
   return pontos;
}
