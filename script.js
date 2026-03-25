let dinheiro = 0;
let dia = 1;

let turno = 0; // 0 = manhã, 1 = tarde
let turnosTotais = 0;

let eficiencia = 10;
let saude = 80;
let satisfacao = 10;
let fabrica = 0;
let progressoCargo = 0;

let cargo = "Operário";

/* ===== UI ===== */
function atualizarUI() {
  document.getElementById("money").innerText = "💰 " + dinheiro;
  document.getElementById("cargo").innerText =
    `${cargo} | ${nomeTurno()}`;

  setBar("eficiencia", eficiencia);
  setBar("saude", saude);
  setBar("satisfacao", satisfacao);
  setBar("fabricaBar", fabrica);
  setBar("barraCargo", progressoCargo);
}

/* ===== TURNOS ===== */
function nomeTurno() {
  return turno === 0 ? "Manhã" : "Tarde";
}

function usarTurno() {
  if (turno >= 2) {
    log("⚠️ Você já usou todos os turnos do dia!");
    return false;
  }

  turno++;
  turnosTotais++;

  // 🔥 EVENTO INTELIGENTE
  if (turnosTotais % 4 === 0 || Math.random() < 0.2) {
    evento();
  }

  return true;
}

function verificarFimDoDia() {
  if (turno >= 2) {
    avancarDia();
  }
}

function avancarDia() {
  dia++;
  turno = 0;

  log("🌙 Um novo dia começou.");
  atualizarUI();
}

/* ===== AÇÕES ===== */
function trabalhar() {
  if (!usarTurno()) return;

  dinheiro += getSalario();
  eficiencia += 5;
  progressoCargo += 10;

  log("🔧 Você trabalhou.");
  atualizarUI();

  verificarFimDoDia();
}

function descansar() {
  if (!usarTurno()) return;

  saude += 10;
  satisfacao += 5;
  dinheiro -= 3;

  log("😴 Você descansou.");
  atualizarUI();

  verificarFimDoDia();
}

function arriscar() {
  if (!usarTurno()) return;

  if (Math.random() > 0.5) {
    eficiencia += 10;
    log("🎲 Você teve sorte!");
  } else {
    eficiencia -= 10;
    log("💥 Deu ruim!");
  }

  atualizarUI();
  verificarFimDoDia();
}

/* ===== BOTÃO + ===== */
function passarDia() {
  if (turno === 1) {
    log("⚠️ Não pode pular no meio do dia!");
    return;
  }

  turno = 2;
  avancarDia();
}

/* ===== EVENTO ===== */
function evento() {
  mostrarPopup(
    "⚠️ Evento!",
    "Um problema ocorreu na fábrica!",
    {
      texto: "Resolver (-10 +Eficiência)",
      acao: () => {
        dinheiro -= 10;
        eficiencia += 10;
        log("Você resolveu o problema.");
        atualizarUI();
      }
    },
    {
      texto: "Ignorar (-Eficiência)",
      acao: () => {
        eficiencia -= 10;
        log("Você ignorou o problema.");
        atualizarUI();
      }
    }
  );
}

/* ===== PROMOÇÃO ===== */
function promover() {
  if (progressoCargo < 100) return;

  progressoCargo = 0;

  if (cargo === "Operário") cargo = "Supervisor";
  else if (cargo === "Supervisor") cargo = "Gerente";

  log("🎉 Promoção para " + cargo + "!");
}

/* ===== SALÁRIO ===== */
function getSalario() {
  if (cargo === "Operário") return 3;
  if (cargo === "Supervisor") return 6;
  if (cargo === "Gerente") return 18;
  return 0;
}

/* ===== BARRAS ===== */
function setBar(id, valor) {
  valor = Math.max(0, Math.min(100, valor));
  document.getElementById(id).style.width = valor + "%";
}

/* ===== LOG ===== */
function log(texto) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML =
    `📅 Dia ${dia} (${nomeTurno()}): ${texto}<br>` + logDiv.innerHTML;
}

/* ===== POPUP ===== */
function mostrarPopup(titulo, texto, op1, op2) {
  document.getElementById("popupOverlay").style.display = "flex";

  document.getElementById("popupTitle").innerText = titulo;
  document.getElementById("popupText").innerText = texto;

  const b1 = document.getElementById("btn1");
  const b2 = document.getElementById("btn2");

  b1.innerText = op1.texto;
  b2.innerText = op2.texto;

  b1.onclick = () => {
    op1.acao();
    fecharPopup();
  };

  b2.onclick = () => {
    op2.acao();
    fecharPopup();
  };
}

function fecharPopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

/* ===== FÁBRICA ===== */
function abrirFabrica() {
  mostrarPopup(
    "🏭 Fábrica",
    "Deseja investir?",
    {
      texto: "Investir (-20)",
      acao: () => {
        dinheiro -= 20;
        fabrica += 20;
        log("Você investiu na fábrica.");
        atualizarUI();
      }
    },
    {
      texto: "Cancelar",
      acao: () => {}
    }
  );
}

/* START */
atualizarUI();
