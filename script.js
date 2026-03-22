// ===== ESTADO =====
let dia = 1;
let turno = "Manhã";

let dinheiro = 0;
let eficiencia = 50;
let saude = 80;
let satisfacao = 60;

let cargo = "Operário";
let progressoCargo = 0;

let fabrica = 0;
let temFabrica = false;

// ===== ELEMENTOS =====
const dinheiroEl = document.getElementById("dinheiro");
const diaEl = document.getElementById("dia");
const cargoEl = document.getElementById("cargo");

const eficienciaEl = document.getElementById("eficiencia");
const saudeEl = document.getElementById("saude");
const satisfacaoEl = document.getElementById("satisfacao");
const fabricaEl = document.getElementById("fabrica");

const progressoCargoEl = document.getElementById("progressoCargo");

const historico = document.getElementById("historico");

// ===== LOG =====
function log(msg) {
  if (!historico) return;
  historico.innerHTML = "📌 " + msg + "<br>" + historico.innerHTML;
}

// ===== IA =====
function narrativa() {
  const frases = [
    "Seu desempenho foi observado.",
    "A pressão aumentou.",
    "O trabalho foi intenso.",
    "A fábrica exigiu mais produtividade.",
    "Você manteve o ritmo da produção."
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

// ===== HUD =====
function atualizarHUD() {
  if (dinheiroEl) dinheiroEl.innerText = "💰 " + dinheiro;
  if (diaEl) diaEl.innerText = "📅 Dia " + dia + " - " + turno;
  if (cargoEl) cargoEl.innerText = "Cargo: " + cargo;

  if (eficienciaEl) {
    eficienciaEl.style.width = eficiencia + "%";
    eficienciaEl.innerText = eficiencia + "%";
  }

  if (saudeEl) {
    saudeEl.style.width = saude + "%";
    saudeEl.innerText = saude + "%";
  }

  if (satisfacaoEl) {
    satisfacaoEl.style.width = satisfacao + "%";
    satisfacaoEl.innerText = satisfacao + "%";
  }

  if (fabricaEl) {
    fabricaEl.style.width = fabrica + "%";
    fabricaEl.innerText = fabrica + "%";
  }

  if (progressoCargoEl) {
    progressoCargoEl.style.width = progressoCargo + "%";
  }
}

// ===== TURNO =====
function proximoTurno() {
  if (turno === "Manhã") {
    turno = "Tarde";
  } else {
    turno = "Manhã";
    dia++;

    if (dia % 3 === 0) evento();
  }

  verificarPromocao();
  verificarFinal();

  log(narrativa());
  atualizarHUD();
}

// ===== SALÁRIO =====
function salario() {
  if (cargo === "Operário") return 20;
  if (cargo === "Supervisor") return 50;
  if (cargo === "Gerente") return 100;
}

// ===== AÇÕES =====
window.trabalhar = function () {
  dinheiro += salario();
  eficiencia += 5;
  saude -= 5;
  progressoCargo += 10;

  log("Você trabalhou.");
  proximoTurno();
};

window.descansar = function () {
  saude += 10;
  satisfacao += 5;
  eficiencia -= 3;

  log("Você descansou.");
  proximoTurno();
};

window.arriscar = function () {
  if (Math.random() > 0.5) {
    dinheiro += 100;
    log("Você ganhou dinheiro!");
  } else {
    saude -= 10;
    log("Você se deu mal!");
  }

  proximoTurno();
};

// ===== PROMOÇÃO =====
function verificarPromocao() {
  if (progressoCargo >= 100) {
    progressoCargo = 0;

    if (cargo === "Operário") {
      cargo = "Supervisor";
      log("🎉 Promoção: Supervisor!");
    } else if (cargo === "Supervisor") {
      cargo = "Gerente";
      log("🎉 Promoção: Gerente!");
      liberarFabrica();
    }
  }
}

// ===== FÁBRICA =====
function liberarFabrica() {
  temFabrica = true;
  log("🏭 Você desbloqueou a fábrica!");
}

window.fabricaClick = function () {
  if (!temFabrica) {
    alert("Fábrica bloqueada! Chegue a Gerente.");
    return;
  }

  let escolha = prompt(
    "1 - Investir (200) [+20%]\n2 - Expandir (300) [+30%]"
  );

  if (escolha == 1 && dinheiro >= 200) {
    dinheiro -= 200;
    fabrica += 20;
    log("Você investiu na fábrica.");
  } else if (escolha == 2 && dinheiro >= 300) {
    dinheiro -= 300;
    fabrica += 30;
    log("Você expandiu a fábrica.");
  } else {
    log("Dinheiro insuficiente.");
  }

  atualizarHUD();
};

// ===== EVENTOS =====
function evento() {
  const tipo = Math.random();

  if (tipo < 0.5) {
    let escolha = confirm(
      "⚠️ Máquina quebrou!\nOK = Consertar (-50 +Eficiência)\nCancelar = Ignorar (-Eficiência)"
    );

    if (escolha) {
      dinheiro -= 50;
      eficiencia += 10;
      log("Você consertou a máquina.");
    } else {
      eficiencia -= 10;
      log("Você ignorou o problema.");
    }
  } else {
    let escolha = confirm(
      "⚠️ Greve!\nOK = Negociar (-80 +Satisfação)\nCancelar = Reprimir (-Satisfação)"
    );

    if (escolha) {
      dinheiro -= 80;
      satisfacao += 10;
      log("Você negociou.");
    } else {
      satisfacao -= 15;
      log("Você reprimiu a greve.");
    }
  }
}

// ===== FINAIS =====
function verificarFinal() {
  if (fabrica >= 100) {
    alert("🏆 FINAL BOM: Você criou uma fábrica de sucesso!");
    location.reload();
  }

  if (satisfacao <= 0 || eficiencia <= 0) {
    alert("💀 FINAL RUIM: Você foi demitido!");
    location.reload();
  }
}

// ===== START =====
atualizarHUD();
log("Você começou como operário.");
