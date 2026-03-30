let dia = 1;
let turno = 0;

let dinheiro = 100;
let energia = 50;
let estresse = 20;
let eficiencia = 50;
let saude = 70;
let satisfacao = 60;

let cargo = 0;
let progresso = 0;

const cargos = ["Operário","Supervisor","Gerente","Dono"];

function clamp(v){ return Math.max(0, Math.min(100,v)); }

function atualizar(){
  document.getElementById("money").innerText = dinheiro;

  document.getElementById("energia").style.width = energia+"%";
  document.getElementById("estresse").style.width = estresse+"%";
  document.getElementById("eficiencia").style.width = eficiencia+"%";
  document.getElementById("saude").style.width = saude+"%";
  document.getElementById("satisfacao").style.width = satisfacao+"%";

  document.getElementById("cargoBar").style.width = progresso+"%";
  document.getElementById("cargoTxt").innerText = cargos[cargo];

  if(cargo === 3){
    document.getElementById("cargoTxt").innerText = "👑 DONO 👑";
  }

  document.getElementById("infoTempo").innerText =
    "Dia "+dia+" - "+(turno==0?"Manhã":"Tarde");
}

function popup(titulo,texto){
  document.getElementById("popupTitulo").innerText = titulo;
  document.getElementById("popupTexto").innerText = texto;
  document.getElementById("popup").classList.remove("hidden");
}

function fecharPopup(){
  document.getElementById("popup").classList.add("hidden");
}

function avancarTurno(){
  turno++;
  if(turno>1){
    turno=0;
    dia++;
  }
}

function acao(tipo){

  if(tipo==="trabalhar"){
    dinheiro += 50;
    energia -= 20;
    estresse += 15;
    eficiencia += 10;
  }

  if(tipo==="descansar"){
    energia += 25;
    estresse -= 20;
    saude += 10;
    satisfacao += 10;
    dinheiro -= 10;
  }

  if(tipo==="investir"){
    if(Math.random()>0.5){
      dinheiro += 80;
      eficiencia += 15;
    }else{
      dinheiro -= 40;
      estresse += 20;
    }
  }

  energia = clamp(energia);
  estresse = clamp(estresse);
  eficiencia = clamp(eficiencia);
  saude = clamp(saude);
  satisfacao = clamp(satisfacao);

  progresso += 20;

  if(progresso>=100 && cargo<3){
    cargo++;
    progresso=0;
    popup("Promoção", "Você virou "+cargos[cargo]);
  }

  verificarFim();

  avancarTurno();

  popup("Turno",
    `Dia ${dia} - ${(turno==0?"Manhã":"Tarde")}`
  );

  atualizar();
}

function verificarFim(){

  if(eficiencia<=0 || saude<=0 || satisfacao<=0){
    popup("❌ Final Ruim","Você falhou!");
    return;
  }

  if(dinheiro < -50){
    popup("❌ Falência","Você perdeu tudo!");
    return;
  }

  if(dinheiro>=400){
    if(estresse<=50){
      popup("🏆 Final Bom","Você venceu sendo equilibrado!");
    }else{
      popup("⚠️ Burnout","Você venceu, mas destruído!");
    }
  }
}

atualizar();
