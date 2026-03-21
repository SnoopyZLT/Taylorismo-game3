// =====================
// ELEMENTOS
// =====================

const money = document.getElementById("money");
const cargo = document.getElementById("cargo");
const historia = document.getElementById("historia");
const opcoes = document.getElementById("opcoes");

const eficienciaBar = document.getElementById("eficienciaBar");
const saudeBar = document.getElementById("saudeBar");
const satisfacaoBar = document.getElementById("satisfacaoBar");
const promoBar = document.getElementById("promoBar");

const barraEmpresa = document.getElementById("barraEmpresa");
const empresaBar = document.getElementById("empresaBar");

// POPUP
const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTexto = document.getElementById("popupTexto");
const popupOpcoes = document.getElementById("popupOpcoes");

// =====================
// DADOS
// =====================

let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 50,
  dia: 1,
  reputacao: 50,
  empresa: false,
  sucessoFabrica: 0,
  cargo: "Operário",
  progressoPromo: 0
};

// =====================
// MOSTRAR OPÇÕES (CENTRALIZADO)
// =====================

function mostrarOpcoes(lista) {
  opcoes.innerHTML = "";

  lista.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto;

    btn.style.margin = "5px";
    btn.style.borderRadius = "15px";

    btn.onclick = () => op.acao();

    opcoes.appendChild(btn);
  });
}

// =====================
// IA DE HISTÓRIA
// =====================

function narrativaIA() {
  let frases = [
    "Você seguiu o ritmo da fábrica.",
    "O trabalho foi intenso.",
    "A pressão aumentou.",
    "Seu desempenho foi observado.",
    "A produção continuou sem parar."
  ];

  let frase = frases[Math.floor(Math.random() * frases.length)];
  addHistoria("🧠 " + frase);
}

// =====================
// HUD
// =====================

function atualizarStatus() {
  money.innerText = jogador.dinheiro;
  cargo.innerText = jogador.cargo;

  eficienciaBar.style.width = jogador.eficiencia + "%";
  eficienciaBar.innerText = jogador.eficiencia + "%";

  saudeBar.style.width = jogador.saude + "%";
  saudeBar.innerText = jogador.saude + "%";

  satisfacaoBar.style.width = jogador.satisfacao + "%";
  satisfacaoBar.innerText = jogador.satisfacao + "%";

  promoBar.style.width = jogador.progressoPromo + "%";
  promoBar.innerText = jogador.progressoPromo + "%";

  if (jogador.empresa) {
    barraEmpresa.style.display = "block";
    empresaBar.style.width = jogador.sucessoFabrica + "%";
    empresaBar.innerText = jogador.sucessoFabrica + "%";
  }
}

// =====================
// HISTÓRIA
// =====================

function addHistoria(txt) {
  historia.innerHTML = `<div>${txt}</div>` + historia.innerHTML;
}

// =====================
// POPUP
// =====================

function mostrarPopup(titulo, texto, lista) {
  popup.classList.remove("hidden");
  opcoes.innerHTML = "";

  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;

  popupOpcoes.innerHTML = "";

  lista.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto + " (" + op.efeito + ")";
    btn.style.borderRadius = "15px";
    btn.style.margin = "5px";

    btn.onclick = () => {
      op.acao();
      popup.classList.add("hidden");
    };

    popupOpcoes.appendChild(btn);
  });
}

// =====================
// EVENTOS (1 A CADA 3 DIAS)
// =====================

function eventoRandom() {

  if (jogador.dia % 3 !== 0) return;

  let eventos = [

    () => mostrarPopup("✊ Greve", "Funcionários revoltados!", [
      {
        texto: "Negociar",
        efeito: "+Satisfação",
        acao: () => {
          jogador.satisfacao += 10;
          jogador.dinheiro -= 30;
          proximoDia();
        }
      },
      {
        texto: "Ignorar",
        efeito: "-Satisfação",
        acao: () => {
          jogador.satisfacao -= 15;
          proximoDia();
        }
      }
    ]),

    () => mostrarPopup("⚠️ Máquina quebrada", "Produção caiu!", [
      {
        texto: "Consertar",
        efeito: "-Dinheiro +Eficiência",
        acao: () => {
          jogador.dinheiro -= 40;
          jogador.eficiencia += 10;
          proximoDia();
        }
      },
      {
        texto: "Ignorar",
        efeito: "-Eficiência",
        acao: () => {
          jogador.eficiencia -= 10;
          proximoDia();
        }
      }
    ])

  ];

  eventos[Math.floor(Math.random() * eventos.length)]();
}

// =====================
// SALÁRIO POR CARGO
// =====================

function salario() {
  if (jogador.cargo === "Operário") return 20;
  if (jogador.cargo === "Supervisor") return 50;
  if (jogador.cargo === "Gerente") return 100;
}

// =====================
// PROMOÇÃO (MAIS DIFÍCIL)
// =====================

function progresso() {
  jogador.progressoPromo += Math.floor(jogador.eficiencia / 30);

  if (jogador.progressoPromo >= 100) {

    if (jogador.cargo === "Operário") jogador.cargo = "Supervisor";
    else if (jogador.cargo === "Supervisor") jogador.cargo = "Gerente";

    addHistoria("🎉 Promoção: " + jogador.cargo);
    jogador.progressoPromo = 0;
  }

  if (jogador.cargo === "Gerente" && !jogador.empresa) {
    jogador.empresa = true;
    addHistoria("🏢 Você ganhou uma fábrica!");
  }
}

// =====================
// FÁBRICA (MAIS OPÇÕES)
// =====================

function melhoriasFabrica() {
  if (!jogador.empresa) return;

  mostrarOpcoes([
    {
      texto: "Investir 75",
      acao: () => {
        if (jogador.dinheiro >= 75) {
          jogador.dinheiro -= 75;
          jogador.sucessoFabrica += 15;
        }
        proximoDia();
      }
    },
    {
      texto: "Automatizar 150",
      acao: () => {
        if (jogador.dinheiro >= 150) {
          jogador.dinheiro -= 150;
          jogador.sucessoFabrica += 30;
          jogador.satisfacao -= 10;
        }
        proximoDia();
      }
    },
    {
      texto: "Marketing 100",
      acao: () => {
        jogador.dinheiro -= 100;
        jogador.sucessoFabrica += 20;
        proximoDia();
      }
    }
  ]);
}

// =====================
// FINAIS
// =====================

function verificarFim() {
  if (jogador.dia > 200) {
    alert("⌛ Tempo acabou!");
    location.reload();
  }

  if (jogador.empresa && jogador.sucessoFabrica >= 100) {
    alert("🏆 Você criou uma fábrica de sucesso!");
    location.reload();
  }
}

// =====================
// TURNO
// =====================

function turno() {
  atualizarStatus();
  narrativaIA();
  addHistoria("📅 Dia " + jogador.dia);

  mostrarOpcoes([
    {
      texto: "Trabalhar",
      acao: () => {
        jogador.eficiencia += 8;
        jogador.dinheiro += salario();
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
        jogador.reputacao += 5;
        eventoRandom();
        proximoDia();
      }
    },
    {
      texto: "Fábrica",
      acao: melhoriasFabrica
    }
  ]);
}

// =====================
// FLUXO
// =====================

function proximoDia() {
  verificarFim();
  jogador.dia++;
  progresso();
  turno();
}

// =====================
// INÍCIO
// =====================

turno();
