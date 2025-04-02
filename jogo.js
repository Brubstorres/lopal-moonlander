//Moonlander. um jogo de Alunissagem
//Bruna Torres (https://github.com/Brubstorres)
//28/03/2025
//Versão 0.1.0

/**@type {HTMLCanvasElement}*/

//Seção de Modelagem de dados
let canvas = document.querySelector('#jogo');
let contexto = canvas.getContext('2d');

let x;
let velocidadeX;
let angulo;

if( Math.round(Math.random()) == 0
){
    x = 100;
    velocidadeX = 2;
    angulo = -Math.PI/2;
} else{
    x = 700;
    velocidadeX = -2;
    angulo = Math.PI/2;
}



let moduloLunar = {
    posicao: {
        x:x,
        y:100
    },
    angulo: -Math.PI/2,
    largura: 20,
    altura:20,
    cor: 'lightgray',
    motorLigado: false,
    velocidade: {
        x: velocidadeX,
        y: 0
    },
    combustivel: 1000,
    rotacaoEsquerda: false,
    rotacaoDireita: false
}

let estrelas = [];
for( let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2),
        transparencia: 1.0, 
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    };
}

//Seção de Visualização
function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate (moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();
    if (moduloLunar.motorLigado){
        desenharChama();
    }
    contexto.restore();
}


function desenharChama(){
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5)
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random ()* 15);
    //contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura*0.5);
    contexto.closePath()
    contexto.fillStyle = 'orange';
    contexto.fill()
}


function mostrarvelocidade(){
    contexto.font = 'bold 18px Arial'
    contexto.textAlign = 'center'
    contexto.textBaseline = 'middle'
    contexto.fillStyle = 'lightgray'

    let velocidadeHorizontal = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(1)}`;
    contexto.fillText(velocidadeHorizontal, 125, 60);  // Posição para velocidade horizontal
    let velocidadeVertical = `Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`;
    contexto.fillText(velocidadeVertical, 110, 90);  
}


function mostrarAngulo(){
    contexto.font = 'bold 18px Arial'
    contexto.textAlign = 'center'
    contexto.textBaseline = 'middle'
    contexto.fillStyle = 'lightgray'

    let angulo = `Angulo: ${(moduloLunar.angulo * 180/Math.PI).toFixed(1)}°`;
    contexto.fillText(angulo, 375, 90);
}


function mostrarAltitude(){
    contexto.font = 'bold 18px Arial'
    contexto.textAlign = 'center'
    contexto.textBaseline = 'middle'
    contexto.fillStyle = 'lightgray'
    let altitude = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)}`;
    contexto.fillText(altitude, 60, 30);

}


function mostrarCombustivel(){
    contexto.font = 'bold 18px Arial'
    contexto.textAlign = 'center'
    contexto.textBaseline = 'middle'
    contexto.fillStyle = 'lightgray'
    let combustivel = `Combustível: ${((moduloLunar.combustivel /1000)* 100).toFixed(0)}%`;
    contexto.fillText(combustivel, 400, 60);
}


function gastarCombustivel(){
    if (moduloLunar.combustivel > 0){
        moduloLunar.combustivel --
    }else{
        moduloLunar.combustivel = 0
        moduloLunar.motorLigado = false
    }
}

function desenharEstrelas(){
    for ( let i = 0 ; i < estrelas.length; i++){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI)
        contexto.closePath();
        contexto.fillStyle = 'rgba(255, 255, 255, '+ estrela.transparencia + ')';
        contexto.fill();
        contexto.restore();
    }
}
      

function desenhar(){
    contexto.clearRect(0,0,canvas.width, canvas.height);
    //Essa função atualiza o posição do modulo lunar em função da gravidade 
     atracaoGravitacional();
     desenharModuloLunar();
     mostrarvelocidade();
     mostrarCombustivel();
     mostrarAngulo();
     mostrarAltitude();
     desenharEstrelas();
     //Essa função repete a execução de desenhar a cada atualização de tela (ou a cada quadro)
     if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura )) {
        if (moduloLunar.velocidade.y >= 0.5 || 
            moduloLunar.velocidade.x >= 0.5 || 
            5 < moduloLunar.angulo|| 
            moduloLunar.angulo < -5
        ) 
        {
            contexto.font = 'bold 40px Bangers'
            contexto.textAlign = 'center'
            contexto.textBaseline = 'middle'
            contexto.fillStyle = 'RED'
            return contexto.fillText("FIM DE JOGO",360, 270)
              
        }else {
            contexto.font = 'bold 30px Bangers'
            contexto.textAlign = 'center'
            contexto.textBaseline = 'middle'
            contexto.fillStyle = 'WHITE'
            return contexto.fillText("Você conseguiu pousar com sucesso!",360, 270);
             
        }
    }
     
     requestAnimationFrame (desenhar); 
}

   //Seção de controle
document.addEventListener('keydown', teclaPressionada);
function teclaPressionada(evento){
    if(evento.keyCode == 38 && moduloLunar.combustivel > 0){
        moduloLunar.motorLigado = true;
        gastarCombustivel()
    }
     else if(evento.keyCode == 39){
       moduloLunar.rotacaoEsquerda = true;
       
    }
     else if(evento.keyCode == 37){
        moduloLunar.rotacaoDireita = true;
    
    }
}
    //Soltando a tecla
document.addEventListener('keyup', teclaSolta);
function teclaSolta(evento){
    if(evento.keyCode == 38){
        moduloLunar.motorLigado = false;
        
    }else if(evento.keyCode == 39){
        moduloLunar.rotacaoEsquerda = false;
        
    }
     else if(evento.keyCode == 37){
        moduloLunar.rotacaoDireita = false;
        
    }
    
}

let gravidade = 0.01;
function atracaoGravitacional(){
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;

    if(moduloLunar.rotacaoEsquerda){
        moduloLunar.angulo += Math.PI/180;
    }else if (moduloLunar.rotacaoDireita){
        moduloLunar.angulo -= Math.PI/180;
    }


    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.115 * Math.sin(moduloLunar.angulo);
    }

    moduloLunar.velocidade.y += gravidade; 
   /* if (moduloLunar.posicao.y < 10){
        moduloLunar.posicao.y = 10;
        moduloLunar.velocidade.y = 0;
    }
    if (moduloLunar.posicao.y > 590){
        moduloLunar.posicao.y = 590;
        moduloLunar.velocidade.y = 0;
        
   }*/

}
desenhar();
