// ===== ELEMENTOS =====
const historia = document.getElementById("historia");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const empresaBar = document.getElementById("empresaBar");
const cargoBar = document.getElementById("cargoBar");

const moneyTxt = document.getElementById("money");

// ===== ESTADO =====
let jogador = {
  dinheiro: 0,
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  empresa: 0,

  cargo: "Operário",
  progressoCargo: 0,

  dia: 1,
  turno: "Manhã",

  temFabrica: false
};

// ===== HISTÓRIA =====
function addHistoria(txt) {
  historia.innerHTML =
    `📅 Dia ${jogador.dia} (${jogador.turno})<br>${txt}<br><br>` +
    historia.innerHTML;

  historia.scrollTop = 0;
}

// ===== BARRAS =====
function atualizarBarras() {
  setBar(eficienciaBar, jogador.eficiencia, "⚙ Eficiência");
  setBar(saudeBar, jogador.saude, "❤️ Saúde");
  setBar(satisfacaoBar, jogador.satisfacao, "🙂 Satisfação");

  // FÁBRICA
  if (jogador.temFabrica) {
    setBar(empresaBar, jogador.empresa, "🏭 Fábrica");
    empresaBar.style.background = "#4169E1";
  } else {
    empresaBar.style.width = "100%";
    empresaBar.innerText = "Fábrica BLOQUEADA";
    empresaBar.style.background = "black";
  }

  // CARGO
  if (cargoBar) {
    cargoBar.style.width = jogador.progressoCargo + "%";
    cargoBar.innerText =
      "Cargo: " + jogador.cargo + " (" + jogador.progressoCargo + "%)";
  }

  moneyTxt.innerText = "💰 " + jogador.dinheiro;
}

function setBar(el, valor, nome) {
  valor = Math.max(0, Math.min(100, valor));
  el.style.width = valor + "%";
  el.innerText = `${nome} (${valor}%)`;
}

// ===== BOTÕES =====
function atualizarBotoes() {
  const esq = document.getElementById("opcoes-esquerda");
  const dir = document.getElementById("opcoes-direita");

  if (!esq || !dir) return;

  esq.innerHTML = "";
  dir.innerHTML = "";

  criarBotao(esq, "Trabalhar", trabalhar);
  criarBotao(esq, "Arriscar", arriscar);

  criarBotao(dir, "Descansar", descansar);

  const btnF = document.createElement("button");
  btnF.innerText = "Fábrica";
  btnF.onclick = abrirFabrica;

  if (!jogador.temFabrica) {
    btnF.style.background = "black";
    btnF.disabled = true;
  }

  dir.appendChild(btnF);
}

function criarBotao(container, texto, acao) {
  const btn = document.createElement("button");
  btn.innerText = texto;
  btn.onclick = acao;
  container.appendChild(btn);
}

// ===== BOTÃO + (PULAR TURNO) =====
document.querySelector(".botao-centro").onclick = () => {
  avancarTurno("⏩ Você avançou o tempo.");
};

// ===== AÇÕES =====
function trabalhar() {
  jogador.dinheiro += salario();
  jogador.eficiencia += 5;
  jogador.saude -= 3;

  progressoCargo(10);

  avancarTurno("Você trabalhou.");
}

function descansar() {
  jogador.saude += 10;
  jogador.satisfacao += 5;

  avancarTurno("Você descansou.");
}

function arriscar() {
  if (Math.random() > 0.5) {
    jogador.dinheiro += 100;
    jogador.eficiencia += 5;
    addHistoria("🔥 Deu certo!");
  } else {
    jogador.dinheiro -= 50;
    jogador.saude -= 5;
    addHistoria("💥 Deu ruim!");
  }

  avancarTurno("");
}

// ===== SALÁRIO =====
function salario() {
  if (jogador.cargo === "Operário") return 20;
  if (jogador.cargo === "Supervisor") return 50;
  if (jogador.cargo === "Gerente") return 100;
}

// ===== PROGRESSO DE CARGO =====
function progressoCargo(valor) {
  jogador.progressoCargo += valor;

  if (jogador.progressoCargo >= 100) {
    jogador.progressoCargo = 0;

    if (jogador.cargo === "Operário") {
      jogador.cargo = "Supervisor";
      addHistoria("📈 Promoção: Supervisor!");
    } else if (jogador.cargo === "Supervisor") {
      jogador.cargo = "Gerente";
      jogador.temFabrica = true;
      addHistoria("🏢 Você virou gerente e ganhou uma fábrica!");
    }
  }
}

// ===== FÁBRICA =====
function abrirFabrica() {
  if (!jogador.temFabrica) return;

  alert("Sistema de fábrica funcionando (pode evoluir depois 😈)");

  jogador.empresa += 10;
  jogador.dinheiro -= 50;

  avancarTurno("Você investiu na fábrica.");
}

// ===== EVENTOS =====
function gerarEvento() {
  if (jogador.dia % 3 !== 0 || jogador.turno !== "Manhã") return;

  alert("⚠ Evento aleatório ocorreu!");
}

// ===== TURNOS =====
function avancarTurno(msg) {
  if (msg) addHistoria(msg);

  if (jogador.turno === "Manhã") {
    jogador.turno = "Tarde";
  } else {
    jogador.turno = "Manhã";
    jogador.dia++;
  }

  gerarEvento();

  atualizarBarras();
  atualizarBotoes();
}

// ===== INÍCIO =====
addHistoria("Você começou como operário.");
atualizarBarras();
atualizarBotoes();
