let dia = 1;
let turno = 0;

let dinheiro = 0;

let eficiencia = 15; // corrigido
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let cargo = 0;
let progresso = 0;

let popupAtivo = false;
let jogoAtivo = true;

const cargos = ["Operário","Supervisor","Gerente","Dono"];
const salarios = [3,6,18,50];

function limitar(v){
  return Math.max(0, Math.min(100, v));
}

/* POPUP */
function popup(titulo, texto, botoes=[]){
  popupAtivo = true;

  document.getElementById("popupTitulo").innerText = titulo;
  document.getElementById("popupTexto").innerHTML = texto;

  let html = "";
  botoes.forEach(b=>{
    html += `<button onclick="${b.acao}">${b.nome}</button>`;
  });

  if(html===""){
    html = `<button onclick="fecharPopup()">OK</button>`;
  }

  document.getElementById("popupBtns").innerHTML = html;
  document.getElementById("popup").classList.remove("hidden");
}

function fecharPopup(){
  popupAtivo = false;
  document.getElementById("popup").classList.add("hidden");
}

/* UI */
function atualizarUI(){

  eficiencia = limitar(eficiencia);
  saude = limitar(saude);
  satisfacao = limitar(satisfacao);
  fabrica = limitar(fabrica);
  progresso = limitar(progresso);

  document.getElementById("money").innerText = "R$ "+dinheiro;

  document.getElementById("eficienciaBar").style.width = eficiencia+"%";
  document.getElementById("saudeBar").style.width = saude+"%";
  document.getElementById("satisfacaoBar").style.width = satisfacao+"%";
  document.getElementById("fabricaBar").style.width = fabrica+"%";

  document.getElementById("eficienciaTxt").innerText = eficiencia+"%";
  document.getElementById("saudeTxt").innerText = saude+"%";
  document.getElementById("satisfacaoTxt").innerText = satisfacao+"%";
  document.getElementById("fabricaTxt").innerText = fabrica+"%";

  document.getElementById("barraCargo").style.width = progresso+"%";
  document.getElementById("cargoPorcento").innerText = progresso+"%";

  document.getElementById("cargo").innerText = cargos[cargo];
  document.getElementById("turno").innerText = turno===0?"Manhã":"Tarde";

  // DONO
  if(cargo===3){
    document.getElementById("barraCargo").style.background="gold";
    document.getElementById("barraCargo").style.width="100%";
    document.getElementById("cargo").innerText="👑DONO👑";
  }

  if(cargo>=2){
    document.getElementById("btnFabrica").disabled=false;
  }

  checarFim();
}

/* LOG */
function log(msg){
  let logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>📅 Dia ${dia} (${turno===0?"Manhã":"Tarde"}): ${msg}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

/* TURNOS */
function passarTurno(){
  turno++;
  if(turno>1){
    turno=0;
    dia++;
  }
}

/* AÇÕES */
function trabalhar(){
  if(!jogoAtivo || popupAtivo) return;

  dinheiro += salarios[cargo];

  eficiencia += 10;
  saude -= 10;
  satisfacao -= 10;

  progresso += 12; // MAIS DIFÍCIL

  log("🔧 Você trabalhou.");

  promover();
  evento();
  passarTurno();
  atualizarUI();
}

function descansar(){
  if(!jogoAtivo || popupAtivo) return;

  dinheiro -= 5;

  eficiencia -= 10;
  saude += 20;
  satisfacao += 20;

  log("😴 Você descansou.");

  passarTurno();
  atualizarUI();
}

function arriscar(){
  if(!jogoAtivo || popupAtivo) return;

  if(Math.random()>0.5){
    dinheiro += 20;
    log("🎲 Você ganhou dinheiro!");
  } else {
    dinheiro -= 10;
    eficiencia -= 10;
    log("🎲 Deu ruim...");
  }

  passarTurno();
  atualizarUI();
}

/* EVENTOS */
function evento(){
  if(Math.random()<0.3){
    popup(
      "⚠️ Evento na fábrica",
      "Um problema apareceu! O que fazer?",
      [
        {nome:"Resolver (-R$10 +10% Eficiência)",acao:"resolver()"},
        {nome:"Ignorar (-10% Eficiência)",acao:"ignorar()"}
      ]
    );
  }
}

function resolver(){
  dinheiro -= 10;
  eficiencia += 10;
  fecharPopup();
  atualizarUI();
}

function ignorar(){
  eficiencia -= 10;
  fecharPopup();
  atualizarUI();
}

/* FÁBRICA */
function abrirFabrica(){
  if(popupAtivo) return;

  popup(
    "🏭 Melhorias da fábrica",
    "Escolha um investimento:",
    [
      {nome:"Máquinas (-20 +10%)",acao:"upgrade(20,10)"},
      {nome:"Automação (-40 +20%)",acao:"upgrade(40,20)"}
    ]
  );
}

function upgrade(c,g){
  if(dinheiro>=c){
    dinheiro-=c;
    fabrica+=g;
    log("🏭 Fábrica evoluiu!");
  } else {
    log("❌ Dinheiro insuficiente.");
  }

  fecharPopup();
  atualizarUI(); // atualização imediata
}

/* PROMOÇÃO */
function promover(){
  if(progresso>=100 && cargo<3){
    progresso=0;
    cargo++;

    popup(
      "📈 PROMOÇÃO!",
      "Agora você é <b>"+cargos[cargo]+"</b>",
      [{nome:"Continuar",acao:"fecharPopup()"}]
    );
  }
}

/* DIA */
function pularDia(){
  if(popupAtivo) return;

  if(turno===0){
    dia++;
    turno=0;
    log("⏩ Dia pulado.");
    atualizarUI();
  } else {
    popup("Erro","Só pode pular no início do dia.");
  }
}

/* FINAIS */
function checarFim(){

  if(!jogoAtivo) return;

  if(eficiencia<=0 || saude<=0 || satisfacao<=0){
    jogoAtivo=false;
    popup(
      "❌ Demissão",
      "Uma das barras zerou.",
      [{nome:"Recomeçar",acao:"restart()"}]
    );
  }

  if(dinheiro<-50){
    jogoAtivo=false;
    popup(
      "💸 Falência",
      "Dívida muito alta.",
      [{nome:"Recomeçar",acao:"restart()"}]
    );
  }

  if(fabrica>=100){
    jogoAtivo=false;
    popup(
      "🏆 Sucesso",
      "Sua fábrica chegou a 100%!",
      [{nome:"Recomeçar",acao:"restart()"}]
    );
  }
}

function restart(){
  location.reload();
}

/* INICIO */
window.onload = ()=>{
  popup(
    "📘 Tutorial",
    "Trabalhe, evolua e vire DONO 👑<br><br>Equilibre suas barras!",
    [{nome:"Começar",acao:"fecharPopup()"}]
  );

  atualizarUI();
  log("Você começou como Operário.");
      }
