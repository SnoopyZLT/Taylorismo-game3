let dia = 1;
let turno = 0; // 0 manhã | 1 tarde

let dinheiro = 0;

let eficiencia = 15;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let cargo = 0;
let progresso = 0;

const cargos = ["Operário","Supervisor","Gerente","Dono"];
const salarios = [3,6,18,50];

function limitar(v){
  return Math.max(0, Math.min(100, v));
}

/* ================= POPUP ================= */

function popup(titulo, texto){
  document.getElementById("popupTitulo").innerText = titulo;
  document.getElementById("popupTexto").innerText = texto;
  document.getElementById("popup").classList.remove("hidden");
}

function fecharPopup(){
  document.getElementById("popup").classList.add("hidden");
}

/* ================= UI ================= */

function atualizarUI(){

  document.getElementById("money").innerText = dinheiro;

  eficiencia = limitar(eficiencia);
  saude = limitar(saude);
  satisfacao = limitar(satisfacao);
  fabrica = limitar(fabrica);

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

  let turnoTxt = turno === 0 ? "Manhã" : "Tarde";

  document.getElementById("cargo").innerText = cargos[cargo];
  document.getElementById("turno").innerText = turnoTxt;

  /* DONO */
  if(cargo === 3){
    document.getElementById("barraCargo").style.background = "gold";
    document.getElementById("cargo").innerText = "👑DONO👑";
  }

  /* LIBERAR FÁBRICA */
  if(cargo >= 2){
    document.getElementById("btnFabrica").disabled = false;
  }

  checarFim();
}

/* ================= LOG ================= */

function log(msg){
  let logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>📅 Dia ${dia} (${turno === 0 ? "Manhã":"Tarde"}): ${msg}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

/* ================= TURNOS ================= */

function passarTurno(){

  turno++;

  if(turno > 1){
    turno = 0;
    dia++;
  }

  popup("Tempo",
    `Dia ${dia} • Turno ${turno === 0 ? "Manhã":"Tarde"}`
  );
}

/* ================= AÇÕES ================= */

function trabalhar(){
  dinheiro += salarios[cargo];

  eficiencia += 10;
  saude -= 10;
  satisfacao -= 10;

  progresso += 10;

  log("Você trabalhou.");

  promover();
  passarTurno();
  atualizarUI();
}

function descansar(){
  dinheiro -= 5;

  eficiencia -= 10;
  saude += 20;
  satisfacao += 20;

  log("Você descansou.");

  passarTurno();
  atualizarUI();
}

function arriscar(){
  let sorte = Math.random();

  if(sorte > 0.5){
    dinheiro += 20;
    log("Você ganhou dinheiro!");
  } else {
    dinheiro -= 10;
    eficiencia -= 10;
    log("Deu ruim...");
  }

  passarTurno();
  atualizarUI();
}

function abrirFabrica(){

  if(cargo < 2){
    popup("Bloqueado","Fábrica só libera no Gerente.");
    return;
  }

  if(dinheiro >= 20){
    dinheiro -= 20;
    fabrica += 10;
    log("Você investiu na fábrica.");
  } else {
    popup("Sem dinheiro","Você não tem dinheiro suficiente.");
  }

  atualizarUI();
}

/* ================= PROGRESSÃO ================= */

function promover(){
  if(progresso >= 100 && cargo < 3){
    cargo++;
    progresso = 0;

    popup("Promoção!",
      `Agora você é ${cargos[cargo]}`
    );
  }
}

/* ================= DIA ================= */

function pularDia(){

  if(turno === 0){

    let diaAntigo = dia;

    dia++;
    turno = 0;

    popup("Avanço de tempo",
      `Dia ${diaAntigo} → Dia ${dia}\nTurno Manhã`
    );

    log("Você pulou o dia.");

  } else {
    popup("Erro","Só pode pular no início do dia.");
  }

  atualizarUI();
}

/* ================= FINAIS ================= */

function checarFim(){

  if(eficiencia <= 0 || saude <= 0 || satisfacao <= 0){
    popup("🔴 Demissão",
      "Uma de suas barras zerou. Você foi demitido!"
    );
    setTimeout(()=>location.reload(),2000);
  }

  if(dinheiro < -50){
    popup("💸 Falência",
      "Sua dívida passou de R$50 negativos!"
    );
    setTimeout(()=>location.reload(),2000);
  }

  if(fabrica >= 100){
    popup("🟢 Sucesso",
      "Você construiu uma fábrica de sucesso!"
    );
    setTimeout(()=>location.reload(),2000);
  }
}

/* ================= INICIO ================= */

atualizarUI();
log("Você começou como Operário.");
