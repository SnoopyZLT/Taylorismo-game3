let dinheiro = 0;
let eficiencia = 15; // ✔ começa em 15%
let saude = 50;
let satisfacao = 50;
let fabrica = 0;

let cargoXP = 0;
let cargoNivel = 0;
let cargos = ["Operário","Supervisor","Gerente","Dono"];

let dia = 1;
let turno = "Manhã";

let jogoAtivo = true;

/* LIMITADOR */
function limite(v){
    return Math.max(0, Math.min(100, v));
}

/* ATUALIZA UI */
function atualizar(){

    eficiencia = limite(eficiencia);
    saude = limite(saude);
    satisfacao = limite(satisfacao);
    cargoXP = limite(cargoXP);

    // Barra cargo %
    let barra = document.getElementById("barraCargo");
    barra.style.width = cargoXP + "%";
    barra.innerText = cargoXP + "%";

    document.getElementById("dinheiro").innerText = "R$ " + dinheiro;

    document.getElementById("cargoTxt").innerText =
    "Cargo: " + cargos[cargoNivel] + " • Dia " + dia + " (" + turno + ")";

    verificarFim();
}

/* LOG */
function log(txt){
    let r = document.getElementById("relatorio");
    r.innerHTML += "<p>" + txt + "</p>";
    r.scrollTop = r.scrollHeight;
}

/* POPUP DINÂMICO MELHORADO */
function popup(txt, opcoes){
    let html = "";

    opcoes.forEach(op=>{
        html += `<button onclick="${op.acao}">${op.nome}</button>`;
    });

    document.getElementById("popupText").innerHTML = txt;
    document.getElementById("popupBtns").innerHTML = html;
    document.getElementById("popup").style.display = "block";
}

function fechar(){
    document.getElementById("popup").style.display = "none";
}

/* AÇÕES */
function acao(tipo){

    if(!jogoAtivo) return;

    if(tipo==="trabalhar"){
        dinheiro += 5;
        eficiencia += 10;
        saude -= 10;
        satisfacao -= 10;

        cargoXP += 25; // 🔥 aumento pra garantir progressão

        log("🔧 Você trabalhou duro.");
    }

    if(tipo==="descansar"){
        dinheiro -= 5;
        eficiencia -= 10;
        saude += 20;
        satisfacao += 20;

        log("😴 Você descansou.");
    }

    if(tipo==="arriscar"){
        if(Math.random()>0.5){
            dinheiro += 20;
            log("🎲 Você ganhou dinheiro!");
        }else{
            dinheiro -= 15;
            log("🎲 Você perdeu dinheiro!");
        }
    }

    subirCargo(); // 🔥 corrigido
    avancarTurno();
}

/* PROMOÇÃO CORRIGIDA */
function subirCargo(){

    if(cargoXP >= 100 && cargoNivel < 3){

        cargoXP = 0;
        cargoNivel++;

        popup(
        "📈 PROMOÇÃO!<br><br>Você virou: <b>"+cargos[cargoNivel]+"</b>",
        [{nome:"Continuar",acao:"fechar()"}]
        );

        // DONO FINAL
        if(cargoNivel === 3){
            let barra = document.getElementById("barraCargo");
            barra.style.background = "gold";
            barra.style.width = "100%";
            barra.innerText = "👑DONO👑";
        }
    }
}

/* TURNOS */
function avancarTurno(){

    if(turno === "Manhã"){
        turno = "Tarde";
    }else{
        turno = "Manhã";
        dia++;
    }

    atualizar();
}

/* FÁBRICA */
function abrirFabrica(){
    popup("🏭 Melhorias da fábrica",[
        {nome:"Máquinas (-20 +10%)",acao:"upgrade(20,10)"},
        {nome:"Automação (-40 +20%)",acao:"upgrade(40,20)"},
        {nome:"Expansão (-60 +30%)",acao:"upgrade(60,30)"}
    ]);
}

function upgrade(custo, ganho){

    if(dinheiro >= custo){
        dinheiro -= custo;
        fabrica += ganho;
        log("🏭 Fábrica evoluiu!");
    }else{
        log("❌ Dinheiro insuficiente.");
    }

    fechar();
    atualizar();
}

/* FINAIS MELHORADOS */
function verificarFim(){

    if(!jogoAtivo) return;

    if(eficiencia<=0 || saude<=0 || satisfacao<=0){
        jogoAtivo = false;

        popup(
        "❌ FIM DE JOGO<br><br>Você foi demitido.",
        [{nome:"Recomeçar",acao:"restart()"}]
        );
    }

    if(dinheiro < -50){
        jogoAtivo = false;

        popup(
        "💸 FALÊNCIA<br><br>Você perdeu tudo.",
        [{nome:"Recomeçar",acao:"restart()"}]
        );
    }

    if(fabrica >= 100){
        jogoAtivo = false;

        popup(
        "🏆 VITÓRIA!<br><br>Sua fábrica virou um sucesso!",
        [{nome:"Jogar novamente",acao:"restart()"}]
        );
    }
}

/* RESET */
function restart(){
    location.reload();
}

/* TUTORIAL DINÂMICO */
window.onload = () => {

    popup(
    "📘 COMO JOGAR<br><br>"+
    "🔧 Trabalhe → ganha dinheiro<br>"+
    "😴 Descanse → recupera status<br>"+
    "🎲 Arrisque → pode ganhar ou perder<br><br>"+
    "⚠️ Não deixe as barras zerarem<br>"+
    "👑 Chegue ao topo!",
    [{nome:"Começar",acao:"fechar()"}]
    );

    atualizar();
}
