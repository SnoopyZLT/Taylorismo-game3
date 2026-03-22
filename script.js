// ===== ESTADO DO JOGO =====
let dia = 1;
let turno = "Manhã";

let dinheiro = 0;
let cargo = "Operário";
let progressoCargo = 0;

let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let fabricaDesbloqueada = false;

// ===== ELEMENTOS =====
const historico = document.getElementById("historico");
const dinheiroEl = document.getElementById("dinheiro");
const cargoEl = document.getElementById("cargo");
const barraCargo = document.getElementById("barraCargo");

const eficienciaEl = document.getElementById("eficiencia");
const saudeEl = document.getElementById("saude");
const satisfacaoEl = document.getElementById("satisfacao");
const fabricaEl = document.getElementById("fabrica");

const btnFabrica = document.getElementById("btnFabrica");

// ===== INICIO =====
log("📌 Você começou como operário.");
updateUI();

// ===== FUNÇÕES PRINCIPAIS =====

function trabalhar() {
  let ganho = getSalario();
  dinheiro += ganho;
  eficiencia += rand(3,7);
  saude -= rand(2,5);
  satisfacao -= rand(1,4);
  progressoCargo += rand(5,10);

  log(`🔧 Você trabalhou e ganhou 💰 ${ganho}.`);
  updateUI();
}

function descansar() {
  saude += rand(5,10);
  satisfacao += rand(3,6);
  eficiencia -= rand(2,4);

  log("😴 Você descansou.");
  updateUI();
}

function arriscar() {
  if (Math.random() > 0.5) {
    dinheiro += 50;
    satisfacao += 5;
    log("🎲 Deu certo! Você ganhou dinheiro.");
  } else {
    dinheiro -= 30;
    saude -= 5;
    log("💥 Deu errado! Você perdeu dinheiro.");
  }
  updateUI();
}

function passarDia() {
  if (turno === "Manhã") {
    turno = "Tarde";
  } else {
    turno = "Manhã";
    dia++;

    if (dia % 3 === 0) gerarEvento();
  }

  narrativaIA();
  checarPromocao();
  checarFinal();

  updateUI();
}

// ===== IA NARRATIVA =====
function narrativaIA() {
  let frases = [
    "O ritmo da fábrica aumentou.",
    "Supervisores observaram seu desempenho.",
    "O trabalho foi intenso.",
    "Nada fora do comum aconteceu.",
    "Os trabalhadores reclamaram da pressão."
  ];

  log(`📅 Dia ${dia} (${turno})`);
  log(frases[rand(0, frases.length-1)]);
}

// ===== EVENTOS =====
function gerarEvento() {
  let eventos = [
    "Uma máquina quebrou!",
    "Funcionários estão insatisfeitos!",
    "A produção caiu!",
    "Greve pode acontecer!"
  ];

  document.getElementById("popupEvento").classList.remove("hidden");
  document.getElementById("eventoTexto").innerText = eventos[rand(0,3)];
}

function resolverEvento() {
  eficiencia += 5;
  satisfacao += 5;
  dinheiro -= 20;
  log("✅ Você resolveu o problema.");
  fecharPopup();
  updateUI();
}

function ignorarEvento() {
  eficiencia -= 5;
  satisfacao -= 5;
  log("❌ Você ignorou o problema.");
  fecharPopup();
  updateUI();
}

// ===== FÁBRICA =====
function abrirFabrica() {
  if (!fabricaDesbloqueada) return;

  document.getElementById("popupFabrica").classList.remove("hidden");
}

function melhorarMaquinas() {
  if (dinheiro >= 200) {
    dinheiro -= 200;
    fabrica += 10;
    log("⚙ Máquinas melhoradas!");
  }
  updateUI();
}

function contratarFuncionarios() {
  if (dinheiro >= 150) {
    dinheiro -= 150;
    fabrica += 8;
    log("👷 Funcionários contratados!");
  }
  updateUI();
}

function marketing() {
  if (dinheiro >= 250) {
    dinheiro -= 250;
    fabrica += 12;
    log("📢 Marketing feito!");
  }
  updateUI();
}

// ===== PROMOÇÃO =====
function checarPromocao() {
  if (progressoCargo >= 100) {
    progressoCargo = 0;

    if (cargo === "Operário") {
      cargo = "Supervisor";
      log("🎉 Promoção: Supervisor!");
    } else if (cargo === "Supervisor") {
      cargo = "Gerente";
      log("🏆 Promoção: Gerente!");
      desbloquearFabrica();
    }
  }
}

function desbloquearFabrica() {
  fabricaDesbloqueada = true;
  btnFabrica.disabled = false;
  btnFabrica.style.background = "#2f5fd0";
  log("🏭 Você ganhou acesso à fábrica!");
}

// ===== FINAIS =====
function checarFinal() {
  if (fabrica >= 100) {
    mostrarFinal("🏆 FINAL BOM", "Você construiu uma fábrica de sucesso!");
  }

  if (satisfacao <= 0 || saude <= 0) {
    mostrarFinal("💀 FINAL RUIM", "Você foi demitido.");
  }
}

function mostrarFinal(titulo, texto) {
  document.getElementById("popupFinal").classList.remove("hidden");
  document.getElementById("finalTitulo").innerText = titulo;
  document.getElementById("finalTexto").innerText = texto;
}

function reiniciarJogo() {
  location.reload();
}

// ===== UTIL =====
function fecharPopup() {
  document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
}

function log(msg) {
  historico.innerHTML = msg + "<br>" + historico.innerHTML;
}

function updateUI() {
  dinheiroEl.innerText = "💰 " + dinheiro;
  cargoEl.innerText = "Cargo: " + cargo;

  barraCargo.style.width = progressoCargo + "%";

  eficienciaEl.style.width = eficiencia + "%";
  saudeEl.style.width = saude + "%";
  satisfacaoEl.style.width = satisfacao + "%";
  fabricaEl.style.width = fabrica + "%";

  // Limites
  eficiencia = clamp(eficiencia);
  saude = clamp(saude);
  satisfacao = clamp(satisfacao);
}

function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSalario() {
  if (cargo === "Operário") return 20;
  if (cargo === "Supervisor") return 50;
  if (cargo === "Gerente") return 100;
}
