// ELEMENTOS
const historia = document.getElementById("historia");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const promoBar = document.getElementById("promoBar");
const empresaBar = document.getElementById("empresaBar");

const moneyTxt = document.getElementById("money");
const cargoTxt = document.getElementById("cargo");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");
const popupOpcoes = document.getElementById("popupOpcoes");

// ESTADO DO JOGO
let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 0,
  dia: 1,
  empresa: false,
  sucessoFabrica: 0,
  cargo: "Operário",
  progressoPromo: 0
};

// HISTÓRICO
function addHistoria(txt) {
  let div = document.createElement("div");
  div.innerText = txt;

  historia.prepend(div);

  historia.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// BOTÕES
function mostrarOpcoes(lista) {
  const esquerda = document.getElementById("opcoes-esquerda");
  const direita = document.getElementById("opcoes-direita");

  if (!esquerda || !direita) return;

  esquerda.innerHTML = "";
  direita.innerHTML = "";

  lista.forEach((op, i) => {
    let btn = document.createElement("button");
    btn.innerText = op.texto;
    btn.onclick = op.acao;

    if (i % 2 === 0) esquerda.appendChild(btn);
    else direita.appendChild(btn);
  });
}

// HUD
function atualizarStatus() {
  eficienciaBar.style.width = jogador.eficiencia + "%";
  eficienciaBar.innerText = jogador.eficiencia + "%";

  saudeBar.style.width = jogador.saude + "%";
  saudeBar.innerText = jogador.saude + "%";

  satisfacaoBar.style.width = jogador.satisfacao + "%";
  satisfacaoBar.innerText = jogador.satisfacao + "%";

  promoBar.style.width = jogador.progressoPromo + "%";
  promoBar.innerText = jogador.progressoPromo + "%";

  if (jogador.empresa) {
    empresaBar.style.width = jogador.sucessoFabrica + "%";
    empresaBar.innerText = jogador.sucessoFabrica + "%";
  }

  moneyTxt.innerText = "💰 " + jogador.dinheiro;
  cargoTxt.innerText = "Cargo: " + jogador.cargo;
}

// IA narrativa
function narrativaIA() {
  let frases = [
    "O trabalho foi intenso.",
    "A produção seguiu normalmente.",
    "A pressão aumentou.",
    "Seu desempenho foi observado.",
    "Os supervisores analisaram seu ritmo.",
    "A fábrica exigiu mais produtividade."
  ];

  addHistoria(frases[Math.floor(Math.random() * frases.length)]);
}

// EVENTOS
function eventoRandom() {
  if (jogador.dia % 3 !== 0) return;

  mostrarPopup("⚠ Evento", "Algo aconteceu na fábrica!", [
    {
      texto: "Resolver",
      acao: () => {
        jogador.eficiencia += 10;
        addHistoria("Você resolveu o problema.");
        proximoDia();
      }
    },
    {
      texto: "Ignorar",
      acao: () => {
        jogador.satisfacao -= 10;
        addHistoria("Você ignorou o problema.");
        proximoDia();
      }
    }
  ]);
}

// POPUP
function mostrarPopup(titulo, texto, lista) {
  popup.classList.remove("hidden");
  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;
  popupOpcoes.innerHTML = "";

  lista.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto;
    btn.onclick = () => {
      popup.classList.add("hidden");
      op.acao();
    };
    popupOpcoes.appendChild(btn);
  });
}

// TURNO
function turno() {
  atualizarStatus();

  addHistoria("📅 Dia " + jogador.dia);
  narrativaIA();

  mostrarOpcoes([
    {
      texto: "Trabalhar",
      acao: () => {
        jogador.eficiencia += 5;
        jogador.dinheiro += salario();
        jogador.progressoPromo += 10;
        eventoRandom();
        proximoDia();
      }
    },
    {
      texto: "Descansar",
      acao: () => {
        jogador.saude += 10;
        proximoDia();
      }
    },
    {
      texto: "Arriscar",
      acao: () => {
        jogador.satisfacao -= 5;
        jogador.eficiencia += 5;
        eventoRandom();
        proximoDia();
      }
    },
    {
      texto: "Fábrica",
      acao: () => {
        if (!jogador.empresa) {
          addHistoria("Você ainda não possui uma fábrica.");
          return;
        }

        if (jogador.dinheiro >= 50) {
          jogador.dinheiro -= 50;
          jogador.sucessoFabrica += 10;
          addHistoria("Você investiu na fábrica.");
        } else {
          addHistoria("Dinheiro insuficiente.");
        }

        proximoDia();
      }
    }
  ]);
}

// SALÁRIO
function salario() {
  if (jogador.cargo === "Operário") return 20;
  if (jogador.cargo === "Supervisor") return 50;
  if (jogador.cargo === "Gerente") return 100;
}

// LOOP
function proximoDia() {
  jogador.dia++;

  // PROMOÇÃO
  if (jogador.progressoPromo >= 100) {
    jogador.progressoPromo = 0;

    if (jogador.cargo === "Operário") {
      jogador.cargo = "Supervisor";
      addHistoria("📈 Promoção: Supervisor!");
    } else if (jogador.cargo === "Supervisor") {
      jogador.cargo = "Gerente";
      jogador.empresa = true;
      addHistoria("🏢 Você virou gerente e ganhou uma fábrica!");
    }
  }

  // FINAL BOM
  if (jogador.sucessoFabrica >= 100) {
    addHistoria("🏆 Você construiu uma fábrica de sucesso! FINAL BOM!");
    return;
  }

  // FINAL RUIM
  if (jogador.satisfacao <= 0) {
    addHistoria("💀 Você foi demitido. FINAL RUIM!");
    return;
  }

  turno();
}

// START
turno();
