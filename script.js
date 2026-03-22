// ===== ESTADO DO JOGO =====
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

let eventoAtivo = false;

// ===== ELEMENTOS =====
const historico = document.getElementById("historico");
const dinheiroEl = document.getElementById("dinheiro");
const diaEl = document.getElementById("dia");
const cargoEl = document.getElementById("cargo");

const eficienciaEl = document.getElementById("eficiencia");
const saudeEl = document.getElementById("saude");
const satisfacaoEl = document.getElementById("satisfacao");
const fabricaEl = document.getElementById("fabrica");
const progressoCargoEl = document.getElementById("progressoCargo");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");

// ===== IA DE TEXTO =====
function narrativa() {
  const textos = [
    "Seu desempenho foi observado.",
    "A pressão aumentou.",
    "O trabalho foi intenso.",
    "A fábrica exigiu mais produtividade.",
    "Você seguiu o ritmo da produção.",
    "Supervisores analisaram seu trabalho.",
    "Você manteve o padrão exigido."
  ];

  return textos[Math.floor(Math.random() * textos.length)];
}

// ===== ATUALIZAR HUD =====
function atualizarHUD() {
  dinheiroEl.innerText = "💰 " + dinheiro;
  diaEl.innerText = "📅 Dia " + dia + " - " + turno;
  cargoEl.innerText = "Cargo: " + cargo;

  eficienciaEl.style.width = eficiencia + "%";
  eficienciaEl.innerText = eficiencia + "%";

  saudeEl.style.width = saude + "%";
  saudeEl.innerText = saude + "%";

  satisfacaoEl.style.width = satisfacao + "%";
  satisfacaoEl.innerText = satisfacao + "%";

  fabricaEl.style.width = fabrica + "%";
  fabricaEl.innerText = fabrica + "%";

  progressoCargoEl.style.width = progressoCargo + "%";
}

// ===== HISTÓRICO =====
function log(texto) {
  historico.innerHTML = "📌 " + texto + "<br>" + historico.innerHTML;
  historico.scrollTop = 0;
}

// ===== TURNO =====
function proximoTurno() {
  if (turno === "Manhã") {
    turno = "Tarde";
  } else {
    turno = "Manhã";
    dia++;

    if (dia % 3 === 0) gerarEvento();
  }

  verificarPromocao();
  verificarFinal();

  log(narrativa());
  atualizarHUD();
}

// ===== AÇÕES =====
function trabalhar() {
  dinheiro += salario();
  eficiencia += 5;
  saude -= 5;
  progressoCargo += 10;

  log("Você trabalhou.");
  proximoTurno();
}

function descansar() {
  saude += 10;
  satisfacao += 5;
  eficiencia -= 3;

  log("Você descansou.");
  proximoTurno();
}

function arriscar() {
  if (Math.random() > 0.5) {
    dinheiro += 100;
    log("Você teve sorte!");
  } else {
    saude -= 10;
    log("Deu errado...");
  }
  proximoTurno();
}

// ===== SALÁRIO =====
function salario() {
  if (cargo === "Operário") return 20;
  if (cargo === "Supervisor") return 50;
  if (cargo === "Gerente") return 100;
}

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
  document.getElementById("btnFabrica").classList.remove("bloqueado");

  log("🏭 Você ganhou uma fábrica!");
}

document.getElementById("btnFabrica").onclick = () => {
  if (!temFabrica) return;

  popupTitulo.innerText = "🏭 Gerenciar Fábrica";
  popupTexto.innerText =
    "Investir (R$200) → +20% sucesso\n\nExpandir (R$300) → +30% sucesso";

  popup.classList.remove("hidden");

  window.escolhaEvento = (op) => {
    if (op === 1 && dinheiro >= 200) {
      dinheiro -= 200;
      fabrica += 20;
      log("Você investiu na fábrica.");
    } else if (op === 2 && dinheiro >= 300) {
      dinheiro -= 300;
      fabrica += 30;
      log("Você expandiu a fábrica.");
    }

    popup.classList.add("hidden");
    atualizarHUD();
  };
};

// ===== EVENTOS =====
function gerarEvento() {
  eventoAtivo = true;

  const eventos = [
    {
      titulo: "⚠️ Máquina quebrada",
      texto: "Consertar (-50 💰, +Eficiência) ou Ignorar (-Eficiência)",
      escolha1: () => {
        dinheiro -= 50;
        eficiencia += 10;
      },
      escolha2: () => {
        eficiencia -= 10;
      }
    },
    {
      titulo: "⚠️ Greve",
      texto: "Negociar (-💰, +Satisfação) ou Reprimir (-Satisfação)",
      escolha1: () => {
        dinheiro -= 80;
        satisfacao += 10;
      },
      escolha2: () => {
        satisfacao -= 15;
      }
    }
  ];

  const e = eventos[Math.floor(Math.random() * eventos.length)];

  popupTitulo.innerText = e.titulo;
  popupTexto.innerText = e.texto;
  popup.classList.remove("hidden");

  window.escolhaEvento = (op) => {
    if (op === 1) e.escolha1();
    else e.escolha2();

    popup.classList.add("hidden");
    eventoAtivo = false;

    log(e.titulo);
    atualizarHUD();
  };
}

// ===== FINAIS =====
function verificarFinal() {
  if (fabrica >= 100) {
    popupTitulo.innerText = "🏆 FINAL BOM";
    popupTexto.innerText = "Você construiu uma fábrica de sucesso!";
    popup.classList.remove("hidden");
  }

  if (satisfacao <= 0 || eficiencia <= 0) {
    popupTitulo.innerText = "💀 FINAL RUIM";
    popupTexto.innerText = "Você foi demitido.";
    popup.classList.remove("hidden");
  }
}

// ===== INICIAR =====
atualizarHUD();
log("Você começou como operário.");
