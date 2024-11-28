var playing = false;
var score;
var trialsLeft;
var step;
var action; //used for setInterval
var fruits = ['apple', 'banana', 'cherry', 'grapes', 'green_apple', 'mango', 'pear', 'pineapple', 'watermelon'];
$(function(){
    // ============================================
    // Início ou Reset do Jogo (Click no botão Start/Reset)
    // ============================================
    $("#startreset").click(function(){
        var sliceSound = $("#slicesound")[0];
        var damageSound = $("#damage")[0];
        var gameOverSound = $("#gameFinish")[0];
        // Definindo o volume dos sons
        sliceSound.volume = 0.2;  
        damageSound.volume = 0.2;
        gameOverSound.volume = 0.05; 
        // Verifica se o texto do botão é "Start Game"
        if ($("#startreset").html() == "Start Game") {
            // Pausa a música de game over, se estiver tocando
            gameOverSound.pause();
            gameOverSound.currentTime = 0; // Reseta o tempo para 0 segundos
        }
        // Caso já esteja jogando, reinicia o jogo
        if(playing == true){
            location.reload(); // Reload da página para reiniciar o jogo
        } else {
            // Caso o jogo não tenha iniciado, inicia o jogo
            playing = true; // Jogo iniciado
            // Reseta o placar
            score = 0;
            $("#scorevalue").html(score);
            // Mostra as tentativas restantes
            $("#trialsLeft").show();
            trialsLeft = 3;
            addHearts();
            // Esconde a caixa de Game Over
            $("#gameOver").hide();
            // Troca o texto do botão para Reset
            $("#startreset").html("Reset Game");
            // Inicia a ação de enviar frutas
            startAction();
        }
    });
    // ============================================
    // Ação de Cortar a Fruta (Click no Fruto)
    // ============================================
    $("#fruit1").click(function(){
        score++; // Incrementa a pontuação
        $("#scorevalue").html(score); // Atualiza o placar
        $("#slicesound")[0].play(); // Toca o som de corte
        // Para a fruta que está caindo
        clearInterval(action);
        // Esconde a fruta com uma animação de "explodir"
        $("#fruit1").hide("explode", 500); 
        // Inicia uma nova fruta
        setTimeout(startAction, 800);
    });
    // ============================================
    // Funções Auxiliares (Corações, Atualização de Tentar e Dimensões)
    // ============================================
    // Função para adicionar corações conforme as tentativas restantes
    function addHearts(){
        $("#trialsLeft").empty();
        for(i = 0; i < trialsLeft; i++){
            $("#trialsLeft").append('<img src="images/heart.png" class="life">');
        }
    }
    // Função para atualizar as dimensões do container
    function updateContainerDimensions() {
        containerWidth = $("#fruitsContainer").width();  // Largura do contêiner
        containerHeight = $("#fruitsContainer").height(); // Altura do contêiner
    }
    // Atualizar as dimensões quando a tela for redimensionada
    $(window).resize(function() {
        updateContainerDimensions();
    });
    // ============================================
    // Início da Ação (Envio das Frutas)
    // ============================================
    function startAction(){
        updateContainerDimensions(); // Atualiza as dimensões do container
        
        // Obtém a largura e a altura do contêiner
        var containerWidth = $("#fruitsContainer").width(); 
        var containerHeight = $("#fruitsContainer").height(); 
        
        // Obtém a largura da fruta
        var fruitWidth = $("#fruit1").width(); 
    
        // Gera uma nova fruta e escolhe aleatoriamente qual mostrar
        $("#fruit1").show();
        chooseFruit(); 
        
        // Define uma posição aleatória para a fruta dentro da largura do contêiner
        var leftPosition = Math.round(Math.random() * (containerWidth - fruitWidth)); // Posição aleatória dentro do container
        $("#fruit1").css({'left': leftPosition, 'top': -75}); // Define a posição inicial da fruta (acima da tela)
        
        // Gera uma velocidade aleatória para a queda da fruta
        step = 1 + Math.round(5 * Math.random()); // Variando a velocidade da queda
        
        // A cada 10ms, a fruta se move para baixo
        action = setInterval(function(){
            // Move a fruta para baixo de acordo com o "step" gerado
            $("#fruit1").css('top', $("#fruit1").position().top + step);                              
    
            // Verifica se a fruta caiu abaixo da área visível do contêiner
            if($("#fruit1").position().top > containerHeight){
                // Se ainda temos tentativas restantes
                if(trialsLeft > 1 ){
                    // Gera uma nova fruta
                    $("#fruit1").show();
                    chooseFruit(); // Escolhe uma fruta aleatória
                    updateContainerDimensions(); // Recalcula as dimensões do contêiner
                    // Define uma nova posição aleatória para a fruta
                    var leftPosition = Math.round(Math.random() * (containerWidth - fruitWidth)); // Nova posição aleatória
                    $("#fruit1").css({'left': leftPosition, 'top': -50}); // Posição nova
                    step = 1 + Math.round(5 * Math.random()); // Nova velocidade
                    trialsLeft--; // Diminui as tentativas restantes
                    addHearts(); // Atualiza os corações
                    // Toca o som de "dano" quando a vida é perdida
                    $("#damage")[0].play();
                } else { // Se o jogador perdeu todas as tentativas
                    playing = false; // Jogo terminado
                    $("#startreset").html("Start Game"); // Botão para começar novamente
                    $("#gameOver").show(); // Exibe a tela de Game Over
                    $("#gameOver").html('<p>Game Over!</p><p>Your score is '+ score +'</p>'); // Exibe a pontuação
                    $("#trialsLeft").hide(); // Esconde os corações
                    // Para a ação (frutas não caem mais)
                    stopAction();
                    // Toca o som de fim de jogo
                    $("#gameFinish")[0].play();
                }
            }
        }, 10);
    }
    // ============================================
    // Função de Escolher uma Fruta Aleatória
    // ============================================
    function chooseFruit(){
        $("#fruit1").attr('src' , 'images/' + fruits[Math.round(8 * Math.random())] + '.png');   
    }
    // ============================================
    // Função para Parar a Ação (Quando o Jogo Acaba ou Reinicia)
    // ============================================
    function stopAction(){
        clearInterval(action); // Para a queda das frutas
        $("#fruit1").hide(); // Esconde a fruta
    }
});
