let dinheiro = 0;
let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let dia = 1;
let turno = 0; // 0 manhã | 1 tarde
let turnosTotais = 0;

let cargo = 0;
let cargoXP = 0;

let descansosSeguidos = 0;

const cargos = ["Operário","Supervisor","Gerente","Dono"];
const salario = [3,6,18,50];

function log(msg){
  let el = document.getElementById("log");
  el.innerHTML += `<p>📅 Dia ${dia}: ${msg}</p>`;
  el.scrollTop = el.scrollHeight;
}

function atualizar(){
  document.getElementById("money").innerText = dinheiro;

  document.getElementById("ef").style.width = eficiencia+"%";
  document.getElementById("sd").style.width = saude+"%";
  document.getElementById("st").style.width = satisfacao+"%";
  document.getElementById("fb").style.width = fabrica+"%";

  document.getElementById("cargoBar").style.width = cargoXP+"%";
  document.getElementById("cargoPct").innerText = cargoXP+"%";

  let turnoTxt = turno===0?"Manhã":"Tarde";
  document.getElementById("cargoTexto").innerText =
  `Cargo: ${cargos[cargo]} • ${turnoTxt}`;

  if(cargo===3){
    document.getElementById("cargoBar").style.background="gold";
  }

  if(cargo>=2){
    document.getElementById("btnFabrica").disabled=false;
  }
}

function passarTurno(){
  turno++;
  turnosTotais++;

  if(turno>1){
    turno=0;
    dia++;
  }

  if(turnosTotais%6===0){
    evento();
  }

  if(dia>200) finalBom();
}

function acao(tipo){

  if(turno>1) return;

  if(tipo==="trabalhar"){
    dinheiro+=salario[cargo];
    eficiencia+=10;
    saude-=10;
    satisfacao-=10;
    cargoXP+=10;
    descansosSeguidos=0;
    log("Você trabalhou.");
  }

  if(tipo==="descansar"){
    dinheiro-=5;
    eficiencia-=10;
    saude+=20;
    satisfacao+=20;
    descansosSeguidos++;
    log("Você descansou.");

    if(descansosSeguidos>=3){
      dinheiro-=30;
      log("Você descansou demais!");
    }
  }

  if(tipo==="arriscar"){
    let r=Math.random();
    if(r>0.5){
      dinheiro+=20;
      log("Deu sorte!");
    } else {
      dinheiro-=10;
      log("Deu ruim...");
    }
    descansosSeguidos=0;
  }

  promover();
  checarFim();

  passarTurno();
  atualizar();
}

function promover(){
  if(cargoXP>=100 && cargo<3){
    cargo++;
    cargoXP=0;
    log("Promoção!");
  }
}

function evento(){
  let custo=[10,15,30][cargo]||30;

  if(confirm("⚠ Problema na fábrica!\nResolver?")){
    dinheiro-=custo;
    eficiencia+=10;
    log("Problema resolvido.");
  } else {
    eficiencia-=15;
    log("Você ignorou.");
  }
}

function abrirFabrica(){
  if(dinheiro>=30){
    dinheiro-=30;
    fabrica+=10;
    log("Investiu na fábrica.");
  }
}

function pularDia(){
  if(turno===0 || turno===2){
    dia++;
    turno=0;
    log("Dia pulado.");
  }
  atualizar();
}

function checarFim(){
  if(eficiencia<=0 || saude<=0 || satisfacao<=0){
    alert("🔴 Você foi demitido!");
    location.reload();
  }

  if(dinheiro<-50){
    alert("🔴 Falência!");
    location.reload();
  }

  if(fabrica>=100){
    finalBom();
  }
}

function finalBom(){
  alert("🟢 Você criou uma fábrica de sucesso!");
  location.reload();
}

atualizar();
log("Você começou como operário.");
