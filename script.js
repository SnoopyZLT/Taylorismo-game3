// ELEMENTOS
const historia = document.getElementById("historia");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const empresaBar = document.getElementById("empresaBar");

const moneyTxt = document.getElementById("money");
const cargoTxt = document.getElementById("cargo");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");
const popupOpcoes = document.getElementById("popupOpcoes");

// ESTADO
let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 0,
  dia: 1,
  empresa: false,
  sucessoFabrica: 0,
  cargo: "Operário",
  progressoPromo: 0,
  jogoAcabou: false
};

// HISTÓRIA
function addHistoria(txt) {
  let div = document.createElement("div");
  div.innerText = txt;
  historia.prepend(div);
  historia.scrollTo({ top: 0, behavior: "smooth" });
}

// BOTÕES
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
  eficienciaBar.innerText = "Eficiência " + jogador.eficiencia + "%";

  saudeBar.style.width = jogador.saude + "%";
  saudeBar.innerText = "Saúde " + jogador.saude + "%";

  satisfacaoBar.style.width = jogador.satisfacao + "%";
  satisfacaoBar.innerText = "Satisfação " + jogador.satisfacao + "%";

  if (jogador.empresa) {
    empresaBar.style.width = jogador.sucessoFabrica + "%";
    empresaBar.innerText = "Fábrica " + jogador.sucessoFabrica + "%";
    empresaBar.style.background = "#4169E1";
  } else {
    empresaBar.style.width = "100%";
    empresaBar.innerText = "Fábrica BLOQUEADA";
    empresaBar.style.background = "black";
  }

  moneyTxt.innerText = "💰 " + jogador.dinheiro;
  cargoTxt.innerText = "Cargo: " + jogador.cargo;
}

// POPUP
function mostrarPopup(titulo, texto, lista) {
  popup.classList.remove("hidden");
  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;
  popupOpcoes.innerHTML = "";

  lista.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto + (op.efeito ? " (" + op.efeito + ")" : "");
    btn.onclick = () => {
      popup.classList.add("hidden");
      op.acao();
    };
    popupOpcoes.appendChild(btn);
  });
}

// EVENTOS
function eventoRandom() {
  if (jogador.dia % 3 !== 0 || jogador.jogoAcabou) return;

  mostrarPopup("⚠ Evento", "Algo aconteceu na fábrica!", [
    {
      texto: "Resolver",
      efeito: "+Eficiência / -Saúde",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.saude -= 5;
        addHistoria("Você resolveu o problema.");
        proximoDia();
      }
    },
    {
      texto: "Ignorar",
      efeito: "-Satisfação",
      acao: () => {
        jogador.satisfacao -= 10;
        addHistoria("Você ignorou o problema.");
        proximoDia();
      }
    }
  ]);
}

// FÁBRICA MENU
function abrirFabrica() {
  if (!jogador.empresa) {
    addHistoria("Fábrica ainda bloqueada.");
    return;
  }

  mostrarPopup("🏢 Fábrica", "Escolha um investimento:", [
    {
      texto: "Melhorar máquinas",
      efeito: "+15% fábrica (-100$)",
      acao: () => {
        if (jogador.dinheiro < 100) return addHistoria("Dinheiro insuficiente.");
        jogador.dinheiro -= 100;
        jogador.sucessoFabrica += 15;
        proximoDia();
      }
    },
    {
      texto: "Treinar funcionários",
      efeito: "+10% eficiência (-80$)",
      acao: () => {
        if (jogador.dinheiro < 80) return addHistoria("Dinheiro insuficiente.");
        jogador.dinheiro -= 80;
        jogador.eficiencia += 10;
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

// TURNO
function turno() {
  if (jogador.jogoAcabou) return;

  atualizarStatus();

  addHistoria("📅 Dia " + jogador.dia);

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
      acao: abrirFabrica
    }
  ]);
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
      addHistoria("🏢 Agora você tem uma fábrica!");
    }
  }

  // FINAL BOM
  if (jogador.sucessoFabrica >= 100 && !jogador.jogoAcabou) {
    jogador.jogoAcabou = true;
    mostrarPopup("🏆 Vitória", "Você construiu uma fábrica de sucesso!", []);
    return;
  }

  // FINAL RUIM
  if (jogador.satisfacao <= 0 && !jogador.jogoAcabou) {
    jogador.jogoAcabou = true;
    mostrarPopup("💀 Derrota", "Você foi demitido.", []);
    return;
  }

  turno();
}

// START
turno();
