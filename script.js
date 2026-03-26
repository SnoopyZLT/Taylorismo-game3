let dinheiro = 0;
let dia = 1;

let turno = 0;
let turnosTotais = 0;

let eficiencia = 20;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;
let progressoCargo = 0;

let cargo = "Operário";
let virouDono = false;
let fabricaDesbloqueada = false;
let jogoAtivo = true;

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
  if (!virouDono) {
    setBar("barraCargo", progressoCargo);
  } else {
    let barra = document.getElementById("barraCargo");
    barra.style.width = "100%";
    barra.style.background = "gold";
    barra.innerText = "Dono 👑";
  }
}

/* ===== TURNOS ===== */
function nomeTurno() {
  return turno === 0 ? "Manhã" : "Tarde";
}

function usarTurno() {
  if (!jogoAtivo) return false;

  if (turno >= 2) {
    log("⚠️ Turnos esgotados!");
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
  checarFim();
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

  checarFim();
  atualizarUI();
  verificarFimDoDia();
}

function arriscar() {
  if (!usarTurno()) return;

  if (Math.random() > 0.5) {
    eficiencia += 10;
    log("🎲 Sorte!");
  } else {
    eficiencia -= 10;
    log("💥 Azar!");
  }

  checarFim();
  atualizarUI();
  verificarFimDoDia();
}

/* ===== BOTÃO + ===== */
function passarDia() {
  if (!jogoAtivo) return;

  if (turno === 1) {
    log("⚠️ Não pode pular agora!");
    return;
  }

  turno = 2;
  avancarDia();
}

/* ===== PROMOÇÃO ===== */
function promover() {
  if (virouDono) return;

  if (progressoCargo >= 100) {
    progressoCargo = 0;

    if (cargo === "Operário") {
      cargo = "Supervisor";
      log("📈 Promoção!");
    } else if (cargo === "Supervisor") {
      cargo = "Gerente";
      log("🏆 Virou gerente!");
    } else if (cargo === "Gerente") {
      cargo = "Dono";
      virouDono = true;
      log("👑 Você virou Dono!");
    }
  }
}

/* ===== SALÁRIO ===== */
function getSalario() {
  if (cargo === "Operário") return 3;
  if (cargo === "Supervisor") return 6;
  if (cargo === "Gerente") return 18;
  if (cargo === "Dono") return 50;
  return 0;
}

/* ===== FINAIS ===== */
function checarFim() {

  // FINAL RUIM
  if (eficiencia <= 0 || saude <= 0 || satisfacao <= 0) {
    jogoAtivo = false;

    mostrarPopup(
      "💀 Demitido!",
      "Você foi demitido!!",
      {
        texto: "Reiniciar",
        acao: () => location.reload()
      },
      {
        texto: "",
        acao: () => {}
      }
    );
  }

  // FINAL BOM
  if (fabrica >= 100) {
    jogoAtivo = false;

    mostrarPopup(
      "🏆 Vitória!",
      "Você criou uma fábrica de sucesso!!",
      {
        texto: "Reiniciar",
        acao: () => location.reload()
      },
      {
        texto: "",
        acao: () => {}
      }
    );
  }
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
        log("Resolvido.");
        atualizarUI();
      }
    },
    {
      texto: "Ignorar (-Eficiência)",
      acao: () => {
        eficiencia -= 10;
        log("Ignorado.");
        atualizarUI();
      }
    }
  );
}

/* ===== FÁBRICA ===== */
function abrirFabrica() {
  if (!fabricaDesbloqueada) {
    log("🔒 Fábrica bloqueada.");
    return;
  }

  mostrarPopup(
    "🏭 Fábrica",
    "Melhorar fábrica?",
    {
      texto: "Upgrade (-20 +10%)",
      acao: () => {
        if (dinheiro >= 20) {
          dinheiro -= 20;
          fabrica += 10;
          log("📈 Fábrica melhorou!");
          checarFim();
        } else {
          log("❌ Sem dinheiro!");
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
