let dinheiro = 0;
let dia = 1;

let turno = 0;
let turnosTotais = 0;

let eficiencia = 10;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;
let progressoCargo = 0;

let cargo = "Operário";
let virouCEO = false;
let fabricaDesbloqueada = false;

/* ===== UI ===== */
function atualizarUI() {
  document.getElementById("money").innerText = "💰 " + dinheiro;
  document.getElementById("cargo").innerText =
    `${cargo} | ${nomeTurno()}`;

  setBar("eficiencia", eficiencia);
  setBar("saude", saude);
  setBar("satisfacao", satisfacao);
  setBar("fabricaBar", fabrica);

  // liberar fábrica
  if (cargo === "Gerente" && !fabricaDesbloqueada) {
    fabricaDesbloqueada = true;
    document.getElementById("btnFabrica").disabled = false;
    log("🏭 Você desbloqueou sua fábrica!");
  }

  // barra de cargo
  if (!virouCEO) {
    setBar("barraCargo", progressoCargo);
  } else {
    let barra = document.getElementById("barraCargo");
    barra.style.width = "100%";
    barra.style.background = "gold";
    barra.innerText = "CEO 👑";
  }
}

/* ===== TURNOS ===== */
function nomeTurno() {
  return turno === 0 ? "Manhã" : "Tarde";
}

function usarTurno() {
  if (turno >= 2) {
    log("⚠️ Você já usou todos os turnos!");
    return false;
  }

  turno++;
  turnosTotais++;

  if (turnosTotais % 4 === 0 || Math.random() < 0.2) {
    evento();
  }

  return true;
}

function verificarFimDoDia() {
  if (turno >= 2) avancarDia();
}

function avancarDia() {
  dia++;
  turno = 0;

  log("🌙 Novo dia começou.");
  atualizarUI();
}

/* ===== AÇÕES ===== */
function trabalhar() {
  if (!usarTurno()) return;

  dinheiro += getSalario();

  eficiencia += 10;
  saude -= 10;
  satisfacao -= 10;

  progressoCargo += 20;

  log("🔧 Você trabalhou.");

  promover();
  atualizarUI();
  verificarFimDoDia();
}

function descansar() {
  if (!usarTurno()) return;

  eficiencia -= 10;
  saude += 10;
  satisfacao += 10;

  dinheiro -= 5;

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

/* ===== PROMOÇÃO ===== */
function promover() {
  if (virouCEO) return;

  if (progressoCargo >= 100) {
    progressoCargo = 0;

    if (cargo === "Operário") {
      cargo = "Supervisor";
      log("📈 Promoção para Supervisor!");
    } else if (cargo === "Supervisor") {
      cargo = "Gerente";
      log("🏆 Promoção para Gerente!");
    } else if (cargo === "Gerente") {
      cargo = "CEO";
      virouCEO = true;
      log("👑 Você virou CEO!");
    }
  }
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
  const el = document.getElementById(id);

  el.style.width = valor + "%";
  el.innerText = valor + "%";
}

/* ===== LOG ===== */
function log(texto) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML =
    `📅 Dia ${dia} (${nomeTurno()}): ${texto}<br>` + logDiv.innerHTML;
}

/* ===== EVENTO ===== */
function evento() {
  mostrarPopup(
    "⚠️ Evento!",
    "Problema na fábrica!",
    {
      texto: "Resolver (-10 +Eficiência)",
      acao: () => {
        dinheiro -= 10;
        eficiencia += 10;
        log("Você resolveu.");
        atualizarUI();
      }
    },
    {
      texto: "Ignorar (-Eficiência)",
      acao: () => {
        eficiencia -= 10;
        log("Você ignorou.");
        atualizarUI();
      }
    }
  );
}

/* ===== FÁBRICA ===== */
function abrirFabrica() {
  if (!fabricaDesbloqueada) {
    log("🔒 Fábrica ainda não desbloqueada.");
    return;
  }

  mostrarPopup(
    "🏭 Fábrica",
    "Melhorar a fábrica?",
    {
      texto: "Upgrade (-20 +10%)",
      acao: () => {
        if (dinheiro >= 20) {
          dinheiro -= 20;
          fabrica += 10;
          log("📈 Fábrica evoluiu!");
        } else {
          log("❌ Dinheiro insuficiente!");
        }
        atualizarUI();
      }
    },
    {
      texto: "Cancelar",
      acao: () => {}
    }
  );
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

/* START */
atualizarUI();
