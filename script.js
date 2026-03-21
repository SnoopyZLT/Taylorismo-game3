// ===== ELEMENTOS =====
const historia = document.getElementById("historia");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const empresaBar = document.getElementById("empresaBar");
const cargoBar = document.getElementById("cargoBar");

const moneyTxt = document.getElementById("money");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");
const popupOpcoes = document.getElementById("popupOpcoes");

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

  temFabrica: false,
  jogoAcabou: false
};

// ===== HISTÓRIA (IA) =====
function narrativaIA() {
  if (jogador.eficiencia > 80) {
    return "🔥 Você está se destacando na produção.";
  }
  if (jogador.satisfacao < 30) {
    return "😡 O clima está tenso entre os trabalhadores.";
  }
  if (jogador.saude < 30) {
    return "💀 Você está exausto fisicamente.";
  }
  if (jogador.temFabrica) {
    return "🏭 Sua fábrica está sob sua responsabilidade.";
  }

  const neutro = [
    "O trabalho segue normalmente.",
    "A rotina da fábrica continua.",
    "O dia foi produtivo.",
    "Nada fora do comum aconteceu."
  ];

  return neutro[Math.floor(Math.random() * neutro.length)];
}

function addHistoria(txt) {
  historia.innerHTML =
    `📅 Dia ${jogador.dia} (${jogador.turno})<br>${txt}<br>${narrativaIA()}<br><br>` +
    historia.innerHTML;

  historia.scrollTop = 0;
}

// ===== BARRAS =====
function atualizarBarras() {
  setBar(eficienciaBar, jogador.eficiencia, "⚙ Eficiência");
  setBar(saudeBar, jogador.saude, "❤️ Saúde");
  setBar(satisfacaoBar, jogador.satisfacao, "🙂 Satisfação");

  if (jogador.temFabrica) {
    setBar(empresaBar, jogador.empresa, "🏭 Fábrica");
    empresaBar.style.background = "#4169E1";
  } else {
    empresaBar.style.width = "100%";
    empresaBar.innerText = "Fábrica BLOQUEADA";
    empresaBar.style.background = "black";
  }

  cargoBar.style.width = jogador.progressoCargo + "%";
  cargoBar.innerText = `Cargo: ${jogador.cargo} (${jogador.progressoCargo}%)`;

  moneyTxt.innerText = "💰 " + jogador.dinheiro;
}

function setBar(el, valor, nome) {
  valor = Math.max(0, Math.min(100, valor));
  el.style.width = valor + "%";
  el.innerText = `${nome} (${valor}%)`;
}

// ===== POPUP REAL =====
function mostrarPopup(titulo, texto, opcoes) {
  popup.classList.remove("hidden");

  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;
  popupOpcoes.innerHTML = "";

  opcoes.forEach(op => {
    const btn = document.createElement("button");
    btn.innerText = op.texto + (op.efeito ? ` (${op.efeito})` : "");

    btn.onclick = () => {
      popup.classList.add("hidden");
      op.acao();
    };

    popupOpcoes.appendChild(btn);
  });
}

// ===== EVENTOS =====
function gerarEvento() {
  if (jogador.dia % 3 !== 0 || jogador.turno !== "Manhã") return;

  mostrarPopup("⚠ Evento", "Algo aconteceu na fábrica!", [
    {
      texto: "Resolver",
      efeito: "+Eficiência -Saúde",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.saude -= 5;
        avancarTurno("Você resolveu o problema.");
      }
    },
    {
      texto: "Ignorar",
      efeito: "-Satisfação",
      acao: () => {
        jogador.satisfacao -= 10;
        avancarTurno("Você ignorou o problema.");
      }
    }
  ]);
}

// ===== BOTÕES =====
function atualizarBotoes() {
  const esq = document.getElementById("opcoes-esquerda");
  const dir = document.getElementById("opcoes-direita");

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

function criarBotao(container, txt, acao) {
  const b = document.createElement("button");
  b.innerText = txt;
  b.onclick = acao;
  container.appendChild(b);
}

// ===== BOTÃO + =====
document.querySelector(".botao-centro").onclick = () => {
  avancarTurno("⏩ Tempo avançou.");
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
    avancarTurno("🔥 Deu certo!");
  } else {
    jogador.dinheiro -= 50;
    jogador.saude -= 5;
    avancarTurno("💥 Deu ruim!");
  }
}

// ===== FÁBRICA =====
function abrirFabrica() {
  if (!jogador.temFabrica) return;

  mostrarPopup("🏭 Fábrica", "Escolha uma melhoria:", [
    {
      texto: "Investir",
      efeito: "+10 fábrica (-50💰)",
      acao: () => {
        if (jogador.dinheiro < 50) return;
        jogador.dinheiro -= 50;
        jogador.empresa += 10;
        avancarTurno("Você investiu na fábrica.");
      }
    },
    {
      texto: "Treinar equipe",
      efeito: "+10 eficiência (-40💰)",
      acao: () => {
        if (jogador.dinheiro < 40) return;
        jogador.dinheiro -= 40;
        jogador.eficiencia += 10;
        avancarTurno("Equipe treinada.");
      }
    }
  ]);
}

// ===== SALÁRIO =====
function salario() {
  if (jogador.cargo === "Operário") return 20;
  if (jogador.cargo === "Supervisor") return 50;
  if (jogador.cargo === "Gerente") return 100;
}

// ===== PROMOÇÃO =====
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

// ===== TURNOS =====
function avancarTurno(msg) {
  if (jogador.jogoAcabou) return;

  if (msg) addHistoria(msg);

  if (jogador.turno === "Manhã") {
    jogador.turno = "Tarde";
  } else {
    jogador.turno = "Manhã";
    jogador.dia++;
  }

  gerarEvento();

  checarFinais();

  atualizarBarras();
  atualizarBotoes();
}

// ===== FINAIS =====
function checarFinais() {
  if (jogador.empresa >= 100 && !jogador.jogoAcabou) {
    jogador.jogoAcabou = true;

    mostrarPopup("🏆 Vitória", "Você construiu uma fábrica de sucesso!", []);
  }

  if (jogador.satisfacao <= 0 && !jogador.jogoAcabou) {
    jogador.jogoAcabou = true;

    mostrarPopup("💀 Derrota", "Você foi demitido.", []);
  }
}

// ===== START =====
addHistoria("Você começou como operário.");
atualizarBarras();
atualizarBotoes();
