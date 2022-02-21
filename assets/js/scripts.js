function start(){ //Inicio função start()
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo
    var podeAtirar = true;
    var fimDeJogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var jogo = {};
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 420);
    var TECLA = {
        W: 87,
        S: 83,
        L: 76
    };

    // Sons do jogo
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    // Música de fundo em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se usuário pressionou alguma tecla
    jogo.pressionou = [];
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    //Game Loop
    jogo.timer = setInterval(loop, 30);

    function loop(){
        moveFundo();
        moveJogador();
        placar();
        energia();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
    } //Fim função loop()

    function moveFundo(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 3);
    } //Fim função moveFundo()

    function moveJogador(){
        if (jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 8);

            if (topo < 15){
                $("#jogador").css("top", topo + 8);
            }
        }
        if (jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 8);

            if (topo > 420){
                $("#jogador").css("top", topo - 8);
            }
        }
        if (jogo.pressionou[TECLA.L]){
            disparo();
        }
    } //Fim função moveJogador()

    function moveInimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX-velocidade);
        $("#inimigo1").css("top", posicaoY);
        
            if (posicaoX < 0){
                posicaoY = parseInt(Math.random() * 420);
                $("#inimigo1").css("left", 689);
                $("#inimigo1").css("top", posicaoY);
            }
    } //Fim função moveInimigo1()

    function moveInimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 4);
        
            if (posicaoX < 0){
                $("#inimigo2").css("left", 785);
            }
    } //Fim função moveInimigo2()

    function moveAmigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);
        
            if (posicaoX > 920){
                $("#amigo").css("left", 0);
            }
    } //Fim função moveAmigo()

    function placar(){
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    } // Fim da função placar()

    function energia(){
        if (energiaAtual == 3){
            $("#energia").css("background-image", "url(assets/imgs/energia3.png")
        }
        if (energiaAtual == 2){
            $("#energia").css("background-image", "url(assets/imgs/energia2.png")
        }
        if (energiaAtual == 1){
            $("#energia").css("background-image", "url(assets/imgs/energia1.png")
        }
        if (energiaAtual == 0){
            $("#energia").css("background-image", "url(assets/imgs/energia0.png")
            gameOver();
        }
    } // Fim da função energia()

    function disparo(){
        if (podeAtirar == true) {
            
            somDisparo.play();
            podeAtirar = false;
            
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 50;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);
            
            var tempoDisparo=window.setInterval(executaDisparo, 30);
        }

        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);
            
                if (posicaoX > 900){
                    window.clearInterval(tempoDisparo);
                    tempoDisparo = null;
                    $("#disparo").remove();
                    podeAtirar = true;
                }
        }
    } // Fim da funçao disparo();

    function colisao(){
        colisao1 = ($("#jogador").collision ($("#inimigo1")));
        colisao2 = ($("#jogador").collision ($("#inimigo2")));
        colisao3 = ($("#disparo").collision ($("#inimigo1")));
        colisao4 = ($("#disparo").collision ($("#inimigo2")));
        colisao5 = ($("#jogador").collision ($("#amigo")));
        colisao6 = ($("#inimigo2").collision ($("#amigo")));

        if (colisao1.length > 0){
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 420);
            $("#inimigo1").css("left", 689);
            $("#inimigo1").css("top", posicaoY);
        }
        if (colisao2.length > 0){
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }
        if (colisao3.length > 0){
            pontos = pontos + 100;
            velocidade = velocidade + 0.1;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 420);
            $("#inimigo1").css("left", 689);
            $("#inimigo1").css("top", posicaoY);
        }
        if (colisao4.length > 0){
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            $("#disparo").css("left", 950);

            reposicionaInimigo2();
        }
        if (colisao5.length > 0){
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }
        if (colisao6.length > 0){
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();
        }
    } // Fim da função colisao()

    function explosao1(inimigo1X, inimigo1Y){
        somExplosao.play();        
        $("#fundoGame").append("<div id='explosao1'><div>");
        $("#explosao1").css("background-image", "url(assets/imgs/explosao.png)");
        
        var div = $("#explosao1");
        
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao(){
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
    } // Fim da função explosao1()
    
    function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();    
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(assets/imgs/explosao.png)");
        
        var div2=$("#explosao2");
        
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
            function removeExplosao2() {  
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2=null;
            }
    } // Fim da função explosao2()

    function explosao3(amigoX, amigoY){

        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(removeExplosao3, 1000);
        
            function removeExplosao3(){
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3=null;
            }
    } // Fim da funçao explosao3()

    function reposicionaInimigo2(){

        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimDeJogo == false){
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    } // Fim função reposicionaInimigo2()

    function reposicionaAmigo(){
        
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimDeJogo == false){
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    } // Fim da função reposicionaAmigo()

    function gameOver(){
        fimDeJogo = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p id='pontuacao'>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>")
    } //Fim da função GameOver()
} //Fim função start()

function reiniciaJogo(){
    somGameover.pause();
    $("#fim").remove();
    start();
} // Fim da função reiniciaJogo;