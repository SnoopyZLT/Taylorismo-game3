let dinheiro = 0;
let dia = 1;

let eficiencia = 10;
let saude = 80;
let satisfacao = 10;
let fabrica = 0;
let progressoCargo = 0;

let cargo = "Operário";

/* ATUALIZA UI */
function atualizarUI() {
  document.getElementById("money").innerText = "💰 " + dinheiro;
  document.getElementById("cargo").innerText = cargo;

  setBar("eficiencia", eficiencia);
  setBar("saude", saude);
  setBar("satisfacao", satisfacao);
  setBar("fabricaBar", fabrica);
  setBar("barraCargo", progressoCargo);

  if (cargo === "Gerente") {
    document.getElementById("btnFabrica").disabled = false;
  }
}

/* BARRAS */
function setBar(id, valor) {
  valor = Math.max(0, Math.min(100, valor));
  document.getElementById(id).style.width = valor + "%";
}

/* LOG */
function log(texto) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML = "📅 Dia " + dia + ": " + texto + "<br>" + logDiv.innerHTML;
}

/* SISTEMA DE TURNO */
function avancarTurno() {
  dia++;

  if (dia % 3 === 0) {
    evento();
  }

  if (progressoCargo >= 100) {
    promover();
  }

  atualizarUI();
}

/* AÇÕES (AGORA FUNCIONAM NA HORA) */

function trabalhar() {
  dinheiro += getSalario();
  eficiencia += 5;
  progressoCargo += 10;

  log("Você trabalhou.");
  atualizarUI();
}

function descansar() {
  saude += 10;
  satisfacao += 5;
  dinheiro -= 3;

  log("Você descansou.");
  atualizarUI();
}

function arriscar() {
  if (Math.random() > 0.5) {
    eficiencia += 10;
    log("Você arriscou e ganhou produtividade.");
  } else {
    eficiencia -= 10;
    log("Você arriscou e perdeu eficiência.");
  }

  atualizarUI();
}

/* BOTÃO + (AGORA FUNCIONA CERTO) */
function passarDia() {
  avancarTurno();
}

/* EVENTO */
function evento() {
  mostrarPopup(
    "⚠️ Problema na fábrica!",
    "Uma situação inesperada ocorreu.",
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

/* PROMOÇÃO */
function promover() {
  progressoCargo = 0;

  if (cargo === "Operário") cargo = "Supervisor";
  else if (cargo === "Supervisor") cargo = "Gerente";

  log("🎉 Promoção para " + cargo + "!");
}

/* SALÁRIO */
function getSalario() {
  if (cargo === "Operário") return 3;
  if (cargo === "Supervisor") return 6;
  if (cargo === "Gerente") return 18;
  return 0;
}

/* POPUP */
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

/* FÁBRICA */
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

/* INICIO */
atualizarUI();
