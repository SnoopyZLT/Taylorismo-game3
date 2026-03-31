let dia = 1;
let turno = 0; // 0 manhã, 1 tarde
let dinheiro = 0;

let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let cargoNivel = 0;
let cargoProgresso = 0;

const cargos = ["Operário","Supervisor","Gerente","Dono"];

function clamp(v){ return Math.max(0, Math.min(100,v)); }

function atualizarUI(){
  document.getElementById("money").innerText = "R$ " + dinheiro;

  document.getElementById("cargoTexto").innerText =
    "Cargo: " + cargos[cargoNivel] + " • " + (turno==0?"Manhã":"Tarde");

  document.getElementById("cargoBarra").style.width = cargoProgresso + "%";
  document.getElementById("cargoPorcentagem").innerText = cargoProgresso+"%";

  document.getElementById("ef").style.width = eficiencia+"%";
  document.getElementById("sa").style.width = saude+"%";
  document.getElementById("st").style.width = satisfacao+"%";
  document.getElementById("fa").style.width = fabrica+"%";

  document.getElementById("efTxt").innerText = eficiencia+"%";
  document.getElementById("saTxt").innerText = saude+"%";
  document.getElementById("stTxt").innerText = satisfacao+"%";
  document.getElementById("faTxt").innerText = fabrica+"%";

  if(cargoNivel >=2){
    document.getElementById("btnFabrica").disabled=false;
  }
}

function log(txt){
  const r = document.getElementById("relatorio");
  r.innerHTML += "<p>"+txt+"</p>";
  r.scrollTop = r.scrollHeight;
}

function avancarTurno(){
  turno++;
  if(turno>1){
    turno=0;
    dia++;
    evento();
  }
  atualizarUI();
}

function trabalhar(){
  eficiencia = clamp(eficiencia+10);
  saude = clamp(saude-10);
  satisfacao = clamp(satisfacao-10);
  dinheiro += [3,6,18,50][cargoNivel];

  cargoProgresso += 10;
  if(cargoProgresso>=100 && cargoNivel<3){
    cargoNivel++;
    cargoProgresso=0;
    popup("Promoção","Você virou "+cargos[cargoNivel]);
  }

  log("Você trabalhou.");
  avancarTurno();
}

function descansar(){
  eficiencia = clamp(eficiencia-10);
  saude = clamp(saude+20);
  satisfacao = clamp(satisfacao+20);
  dinheiro -=5;

  log("Você descansou.");
  avancarTurno();
}

function arriscar(){
  let chance = Math.random();
  if(chance<0.5){
    dinheiro+=20;
    log("Você ganhou dinheiro!");
  }else{
    eficiencia-=15;
    log("Deu ruim...");
  }
  avancarTurno();
}

function abrirFabrica(){
  if(fabrica>=100){
    finalBom();
    return;
  }
  if(dinheiro>=20){
    dinheiro-=20;
    fabrica = clamp(fabrica+10);
    log("Você investiu na fábrica.");
  }else{
    popup("Sem dinheiro","Você precisa de dinheiro.");
  }
  atualizarUI();
}

function proximoDia(){
  if(turno==0){
    dia++;
    evento();
  }
  atualizarUI();
}

function evento(){
  if(Math.random()<0.3){
    popup("Problema na fábrica",
      "Máquina quebrou!",
      [
        {txt:"Consertar (-10$ +10 eficiência)",fn:()=>{
          dinheiro-=10;
          eficiencia=clamp(eficiencia+10);
        }},
        {txt:"Ignorar (-10 eficiência)",fn:()=>{
          eficiencia=clamp(eficiencia-10);
        }}
      ]
    );
  }
}

function popup(titulo,texto,opcoes=[]){
  document.getElementById("popup").classList.remove("hidden");
  document.getElementById("popupTitulo").innerText=titulo;
  document.getElementById("popupTexto").innerText=texto;

  let btns="";
  opcoes.forEach(o=>{
    btns+=`<button onclick="popupEscolha(${opcoes.indexOf(o)})">${o.txt}</button>`;
  });
  if(opcoes.length==0){
    btns='<button onclick="fecharPopup()">OK</button>';
  }

  window.popupOpcoes=opcoes;
  document.getElementById("popupBtns").innerHTML=btns;
}

function popupEscolha(i){
  window.popupOpcoes[i].fn();
  fecharPopup();
  atualizarUI();
}

function fecharPopup(){
  document.getElementById("popup").classList.add("hidden");
}

function finalBom(){
  popup("Final","Você criou uma fábrica de sucesso!");
}

atualizarUI();