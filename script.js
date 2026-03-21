const historia = document.getElementById("historia");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const promoBar = document.getElementById("promoBar");
const empresaBar = document.getElementById("empresaBar");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");
const popupOpcoes = document.getElementById("popupOpcoes");

let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 50,
  dia: 1,
  empresa: false,
  sucessoFabrica: 0,
  cargo: "Operário",
  progressoPromo: 0
};

// HISTÓRIA COM SCROLL
function addHistoria(txt) {
  let div = document.createElement("div");
  div.innerText = txt;

  historia.prepend(div);

  historia.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// BOTÕES =+=
function mostrarOpcoes(lista) {
  const esquerda = document.getElementById("opcoes-esquerda");
  const direita = document.getElementById("opcoes-direita");

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
}

// IA
function narrativaIA() {
  let frases = [
    "O trabalho foi intenso.",
    "A produção continuou.",
    "A pressão aumentou.",
    "Seu desempenho foi observado."
  ];
  addHistoria(frases[Math.floor(Math.random() * frases.length)]);
}

// EVENTO
function eventoRandom() {
  if (jogador.dia % 3 !== 0) return;

  mostrarPopup("⚠ Evento", "Algo aconteceu na fábrica!", [
    {
      texto: "Resolver",
      efeito: "+Eficiência",
      acao: () => {
        jogador.eficiencia += 10;
        proximoDia();
      }
    },
    {
      texto: "Ignorar",
      efeito: "-Satisfação",
      acao: () => {
        jogador.satisfacao -= 10;
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
  narrativaIA();
  addHistoria("📅 Dia " + jogador.dia);

  mostrarOpcoes([
    {
      texto: "Trabalhar",
      acao: () => {
        jogador.eficiencia += 5;
        jogador.dinheiro += 20;
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
        eventoRandom();
        proximoDia();
      }
    },
    {
      texto: "Fábrica",
      acao: () => {
        if (!jogador.empresa) return;
        jogador.sucessoFabrica += 10;
        proximoDia();
      }
    }
  ]);
}

// LOOP
function proximoDia() {
  jogador.dia++;
  jogador.progressoPromo += 10;

  if (jogador.progressoPromo >= 100) {
    jogador.cargo = "Gerente";
    jogador.empresa = true;
    jogador.progressoPromo = 0;
    addHistoria("🏢 Você ganhou uma fábrica!");
  }

  turno();
}

// START
turno();
