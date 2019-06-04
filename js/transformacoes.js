//Declaração de variavéis para inicialização
var painelids=["matrizorigi","matriztransf","matrizresult"];
var colors=[]
var matrizTranformacao = math.identity(3);
var matrizOriginal;
var matrizResultante;
var layout = {
  title: '',
  autosize: true,
  
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 65
  },

};
//Preenche um vetor com 64 cores para os vetores
for(var i=0;i<64;i++)colors.push(getRandomColor());

//FUNÇÕES UTILITARIAS

//Obtem uma cor hex aleatória
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// Obtem um elemento pelo ID
function dom(id){return document.getElementById(id)}
// Arredonda a matriz 
function roundmatrix(size,matrix)
{
  for(var i=0;i<size[0];i++)
    for(var j=0;j<size[1];j++)
      matrix._data[i][j]=math.round(matrix._data[i][j],5);
  return matrix;
}

// Converte Graus para Radianos
function toRadian(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


//FUNÇÕES QUE TRATAM DO LAYOUT 

// Troca o número de vetores da matriz original conforme a quantidade digitada 

function changeNumVects()
{
  matrizOriginal= savematriz(0,matrizOriginal);
  tempmatrix= math.zeros(3,parseInt(dom("numvects").value));
  
  var sz= [3,parseInt(dom("numvects").value)];
  console.log("hey");
  oldsz = math.size(matrizOriginal)._data;
  
  for(var i=0 ;i<sz[0];i++)
  {
    if(i==oldsz[0])break;
    for(var j=0;j<sz[1];j++)
    {
      if(j==oldsz[1])break;
      tempmatrix._data[i][j]=matrizOriginal._data[i][j];
    }
  }
  matrizOriginal= tempmatrix;
  escreveMatriz([3,parseInt(dom("numvects").value)],0,matrizOriginal,false);
}

//Salva o valor de um quadrante em uma variavel que representa a matriz correspondente 

function savematriz(panelId,matrix)
{
  var panel = dom(painelids[panelId]);
  var inputs = panel.getElementsByTagName("input");
  var x=[];
  var y=[];
  var z=[];
  module= inputs.length/3;
  for (var i=0;i<inputs.length;i++){
    var div= Math.floor(i/module);
    if( (div) ==0)
      {
      x.push(parseFloat( inputs[i].value==""?0:inputs[i].value));
    }
    else if((div)==1)
    {
      y.push(parseFloat( inputs[i].value==""?0:inputs[i].value));
    }
    else {
      z.push(parseFloat(inputs[i].value==""?0:inputs[i].value));
    }
    
  }
 
  matrix = math.matrix([x,y,z]);

  switch (panelId){
    case 0: 
    matrizOriginal= matrix;
    break;
    case 1:
    matrizTranformacao= matrix;
    break;
  }
  return matrix;
}

// Cria a matriz no quadrante selecionado, com os valores 0 

function criaMatriz(size,painelid,result)
{
  var panel = dom(painelids[painelid]);
  var eix=["X","Y","Z"]
  panel.innerHTML="";
  for(var i=0;i<3;i++)
  {
    var resultHtml=` <div class="form-row my-2">
                                <div class="col-3">
                                    <label class="my-1 mr-2" for="inlineFormCustomSelectPref">`+eix[i]+`:</label>
      
      
                                </div> `;
        if(painelid==0||painelid==2)
        {
          resultHtml=`  <div class="form-row my-2 teste" >
                          <div class="teste2" >
                              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">`+eix[i]+`</label>
                          </div>`;
        }
        for(var j=0;j<size[1];j++)
        {
          if(painelid==0||painelid==2)
          {
            resultHtml+=` <div class="teste2" >
                                  <input type="number" value=2  class="form-control" id="" `+(result?`disabled`:"")  +` placeholder="">
    
                              </div> `;
            continue;
          }
          resultHtml+=` <div class="col-3">
                                        <input type="number" class="form-control" id="" `+(result?`disabled`:"")  +` value=0 placeholder="">
          
                                    </div>`;
          
        }
        resultHtml+="</div>";
        panel.innerHTML+=resultHtml;
  }
  var elements= document.getElementsByClassName("teste");
  for(var i=0;i<elements.length;i++)
  {
    elements[i].style="width:"+75*(size[1]+1)+"px";
  }

}

//Escreve a matriz variavel para o painel selecionado e plota no gráfico

function escreveMatriz(size,panelId,matrix,result)
{
  criaMatriz(size,panelId,result);
  var panel = dom(painelids[panelId]);

  var inputs = panel.getElementsByTagName("input");

  for(var i=0;i<3;i++)
  {
    for(var j=0;j<size[1];j++)
    {
      inputs[(i*size[1])+j].value= matrix._data[i][j];
    }
  }
  plotthis(panelId,matrix);

}

//Plota a matriz no gráfico selecionado pelo ID

function plotthis(oanelid,matrix)
{
  matrix= savematriz(oanelid,matrix)
  var retas=[]
   retas = ploxmatrix(matrix,"pontos");
   Plotly.newPlot('chart'+oanelid, retas, layout); 
   
}

//Gera o eixo cartesiano e um vetor de retas a serem plotados no gráfico, cada reta dessa é um vetor preso a origem
function ploxmatrix(matrix,name)
{
  var maxval= math.max(math.max(matrix));
  
  maxval=maxval<10?10:(maxval<20?20:maxval<50?50:maxval+3);
  var data=[];
  var cordinates = {
  x: [0,maxval,-maxval,0,0,0,0,0,0],
  y: [0,0,0,0,maxval,-maxval,0,0,0],
  z:[0,0,0,0,0,0,0,maxval,-maxval],
  mode: 'lines',
  marker: {
    color: "#00000080",
    size: 0,
    symbol: 'circle',
    line: {
      color: "#00000080",
      width: 0
    }},
  line: {
    color: "#00000080",
    width: 3
  },
  name:"eixos",
  type: 'scatter3d'
};
  data.push(cordinates);
  var size = math.size(matrix);
  console.log(matrix);
  for(var i=0;i<size["_data"][1];i++)
  {
    var color = colors[i];
    var trace1 = {
    x: [0,matrix._data[0][i]],
    y: [0,matrix._data[1][i]],
    z:[0,matrix._data[2][i]],
    mode: 'lines+markers',
    marker: {
      color: color,
      size: 3,
      symbol: 'circle',
      line: {
        color: color,
        width: 4
      }},
    line: {
      color: color,
      width: 5
    },
    name:'Vetor '+i,
    type: 'scatter3d'
  }; data.push(trace1);
  }

   return data;

}

// edita o resultado da matriz resultante, copiando ela para a matriz original
function editresult()
{
  matrix = savematriz(2,matrizResultante);
  dom("mresult").hidden=true;
  escreveMatriz(math.size(matrizResultante)._data,0,matrix,false);
 
}

//FUNÇÕES MATEMÁTICAS 

//Normaliza um Vetor 
function normalize(vecc)
{ 
    //console.log(vec);
    norma= math.norm(vecc);
    vecc= math.divide(vecc,norma);
    return vecc;
}
// Efetua a transformação linear
function dotransform()
{
  matrizOriginal= savematriz(0,matrizOriginal);
  matrizTranformacao=savematriz(1,matrizResultante);
  matrizResultante= math.multiply(matrizTranformacao,matrizOriginal);
  plotthis(1,matrizTranformacao);
  plotthis(0,matrizOriginal);
  escreveMatriz(math.size(matrizResultante)._data,2,matrizResultante,true);
  dom("mresult").hidden=false;
}

// Calcula o determinante da matriz
function Determinante(panelId,matrix)
{

  matrix= savematriz(panelId,matrix);
  var sizes= math.size(matrix)._data;
  if(sizes[0]!=sizes[1])
  {
    alert("A matriz deve ser quadrada para calcular o determinante");
    return;
  }
  
  alert("O determinante é "+ math.det(matrix));
}

// Calcula a inversa da matriz
function Inversa(panelId,matrix)
{
  matrix= savematriz(panelId,matrix);
  var sizes= math.size(matrix)._data;
  if(sizes[0]!=sizes[1])
  {
    alert("A matriz deve ser quadrada para calcular a sua Inversa");
    return;
  }
  matrix= math.inv(matrix);
  escreveMatriz(math.size(matrix)._data,panelId,matrix,false);
}

//Calcula a transposta da matriz
function Transposta(panelId,matrix)
{
  matrix= savematriz(panelId,matrix);
  matrix= math.transpose(matrix);
  escreveMatriz(math.size(matrix)._data,panelId,matrix,false);
}

// Calcula os autovalores e autovetores de uma matriz 
function autov()
{
  matrix= savematriz(1,matrizTranformacao);
  var values=numeric.eig(matrix._data);
  
  //console.log(values);
  var resu="";
  for( var i=0;i<3;i++)
  {
    resu +=("O autovalor : "+ math.round( values.lambda.x[i],2) +"\nPossui o autovetor : ["+ math.round(values.E.x[0][i],2)+","+ math.round(values.E.x[1][i],2)+","+ math.round(values.E.x[2][i],2)+"] \n");
  }
  alert(resu);
}
//Efetua o algorítimo de grand smith para ortogonalizar os vetores
function gsmi(panelId,matrix){
  matrix= savematriz(panelId,matrix);
  size = math.size(matrix)._data;
  console.log("meu tamanho "+ size);
  for(var i =0;i<size[1];i++)
  {
    vec =[]
    for(var j =0;j<size[0];j++)
    {
      vec.push(matrix._data[j][i]);
    }

    if(i==0){
    vec= normalize(vec);
    }
    else {
      proj=math.zeros(3);
      for(var j=i-1;j>=0;j--)
      {
        vec2=[]
        for(var z =0;z<size[0];z++)
        {
          vec2.push(matrix._data[z][j]);
        }
        temp = math.multiply(math.dot(vec,vec2),vec2);
        
        proj= math.add(proj,temp);
       
      }
      vec= math.subtract(vec,proj._data);
      vec= normalize(vec);
      
    }

    for(var j =0;j<size[0];j++)
    {
      matrix._data[j][i] = vec[j];
    }

   // console.log("resposta cada vetor "+i);
    //console.log(matrix._data);

  }
  
  for(var i=0;i<size[0];i++)
    for(var j=0;j<size[1];j++)
      matrix._data[i][j]=math.round(matrix._data[i][j],4);
      escreveMatriz(size,0,matrix,false);


}
//função que retorna (1-cos(angulo)) para facilitar na escrita da matriz de rotação
function umc(angle)
{
  return (1-math.cos(angle));
}
// Seno de um angulo
function sen(angle){
  return math.sin(angle);
}
//Coseno de um angulo
function cos(angle)
{
  return math.cos(angle);
}


//Funções para a caixa de transformação

//Matriz de reflexão sobre o eixo
function reflex(eix)
{
  finalmatrix= math.identity(3,3);
  switch(eix){
    case "x":
    finalmatrix._data[0][0]=-1;
    break;
    case "y":
    finalmatrix._data[1][1]=-1;

    break;
    case "z":
    finalmatrix._data[2][2]=-1;

    break;
  }
  escreveMatriz([3,3],1,finalmatrix,false);
  dom("closemodal").click();
}

//Matriz de projeção sobre o eixo 
function proj(eix)
{
  finalmatrix= math.zeros(3,3);
  switch(eix){
    case "x":
    finalmatrix._data[0][0]=1;
    break;
    case "y":
    finalmatrix._data[1][1]=1;

    break;
    case "z":
    finalmatrix._data[2][2]=1;

    break;
  }
  escreveMatriz([3,3],1,finalmatrix,false);
  dom("closemodal").click();
}

//Matriz de rotação sobre um vetor qualquer
function rotvec()
{
  vec =[parseFloat(dom("vecrotx").value),parseFloat(dom("vecroty").value),parseFloat(dom("vecrotz").value)];
  vec= normalize(vec);
  angle= parseFloat( dom("rotationfactor").value);
  console.log(angle);
  matrix= rotationMatrix(angle,vec);
  console.log(matrix);
  escreveMatriz([3,3],1,matrix,false);
  dom("closemodal").click();
}

//Matriz de rotação sobre o eixo determinado
function rot(eix)
{
  finalmatrix=[0,0,0];
  switch(eix){
    case "x":
    finalmatrix[0]=1;
    break;
    case "y":
    finalmatrix[1]=1;

    break;
    case "z":
    finalmatrix[2]=1;
    break;
  }
  finalmatrix= normalize(finalmatrix);
  angles= parseFloat( dom("rotationfactor").value);
  finalmatrix= rotationMatrix(angles,finalmatrix);
  console.log(finalmatrix);
  escreveMatriz([3,3],1,finalmatrix,false);
  dom("closemodal").click();
}
//Função que retorna a matriz de rotação correspondente para o vetor e angulo de rotação, recebe o angulo em graus e o eixo já normalizado
function rotationMatrix(angle,eix)
{
  a=eix[0];
  b=eix[1];
  c=eix[2];
  angle = toRadian(angle);

  rotmatrix= math.matrix([[cos(angle)+ umc(angle)*(a*a),umc(angle)*(a*b)+sen(angle)*c,umc(angle)*a*c-sen(angle)*b],
                [umc(angle)*b*a- sen(angle)*c, cos(angle)+umc(angle)*b*b,umc(angle)*b*c+sen(angle)*a],
                [umc(angle)*c*a+sen(angle)*b, umc(angle)*c*b-sen(angle)*a, cos(angle)+umc(angle)*c*c]
   ]);
   rotmatrix= roundmatrix([3,3],rotmatrix);
   return rotmatrix;
}

//Função para expandir a matriz
function expand()
{ 
  finalmatrix= math.identity(3,3);
  finalmatrix= math.multiply(finalmatrix,parseFloat(dom("expandfactor").value));

  escreveMatriz([3,3],1,finalmatrix,false);
  dom("closemodal").click();

}
//Função que projeta a matriz, na reta x=y=z
function projret()
{
  finalmatrix= math.ones(3,3);
  finalmatrix= math.multiply(finalmatrix,1/2);

  escreveMatriz([3,3],1,finalmatrix,false);
  dom("closemodal").click();
}








