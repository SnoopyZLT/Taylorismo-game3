// =====================
// ELEMENTOS HTML
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
// DADOS DO JOGADOR
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
  erros: 0,
  progressoPromo: 0
};

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

function mostrarPopup(titulo, texto, opcoesLista) {
  popup.classList.remove("hidden");

  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;

  popupOpcoes.innerHTML = "";

  opcoesLista.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto + " (" + op.efeito + ")";

    btn.onclick = () => {
      op.acao();
      popup.classList.add("hidden");
      atualizarStatus();
    };

    popupOpcoes.appendChild(btn);
  });
}

// =====================
// EVENTOS
// =====================

function eventoRandom() {

  let eventos = [

    () => mostrarPopup("✊ Greve Geral", "Funcionários pararam tudo!", [
      {
        texto: "Negociar",
        efeito: "+Satisfação -Dinheiro",
        acao: () => {
          jogador.satisfacao += 15;
          jogador.dinheiro -= 20;
          addHistoria("Você negociou com trabalhadores.");
          proximoDia();
        }
      },
      {
        texto: "Reprimir",
        efeito: "+Reputação -Satisfação",
        acao: () => {
          jogador.reputacao += 10;
          jogador.satisfacao -= 15;
          addHistoria("Você reprimiu a greve.");
          proximoDia();
        }
      }
    ]),

    () => mostrarPopup("💸 Falência", "A fábrica está em risco!", [
      {
        texto: "Investir",
        efeito: "-Dinheiro +Fábrica",
        acao: () => {
          jogador.dinheiro -= 50;
          jogador.sucessoFabrica += 15;
          addHistoria("Você investiu na fábrica.");
          proximoDia();
        }
      },
      {
        texto: "Cortar custos",
        efeito: "+Dinheiro -Satisfação",
        acao: () => {
          jogador.dinheiro += 20;
          jogador.satisfacao -= 10;
          addHistoria("Você cortou custos.");
          proximoDia();
        }
      }
    ])

  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];
  evento();
}

// =====================
// PROMOÇÃO
// =====================

function progresso() {
  jogador.progressoPromo += Math.floor(jogador.eficiencia / 20);

  if (jogador.progressoPromo >= 100) {

    if (jogador.cargo === "Operário") {
      jogador.cargo = "Supervisor";
      addHistoria("🎉 Promoção: Supervisor");
    } 
    else if (jogador.cargo === "Supervisor") {
      jogador.cargo = "Gerente";
      addHistoria("🚀 Promoção: Gerente");
    }

    jogador.progressoPromo = 0;
  }

  if (jogador.cargo === "Gerente" && !jogador.empresa) {
    jogador.empresa = true;
    addHistoria("🏢 Você recebeu uma fábrica!");
  }
}

// =====================
// FÁBRICA
// =====================

function melhoriasFabrica() {
  if (!jogador.empresa) return;

  mostrarOpcoes([
    {
      texto: "Investir (50)",
      acao: () => {
        if (jogador.dinheiro >= 50) {
          jogador.dinheiro -= 50;
          jogador.sucessoFabrica += 10;
        }
        proximoDia();
      }
    },
    {
      texto: "Automatizar (100)",
      acao: () => {
        if (jogador.dinheiro >= 100) {
          jogador.dinheiro -= 100;
          jogador.sucessoFabrica += 20;
          jogador.satisfacao -= 5;
        }
        proximoDia();
      }
    },
    {
      texto: "Treinar equipe",
      acao: () => {
        jogador.sucessoFabrica += 8;
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

  if (jogador.erros >= 5 || jogador.reputacao <= 0) {
    alert("💀 Você foi demitido!");
    location.reload();
  }

  if (jogador.empresa && jogador.sucessoFabrica >= 100) {
    alert("🏆 Sua fábrica virou um sucesso!");
    location.reload();
  }
}

// =====================
// TURNO
// =====================

function turno() {
  atualizarStatus();
  addHistoria("📅 Dia " + jogador.dia);

  mostrarOpcoes([
    {
      texto: "Trabalhar",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.dinheiro += 20;
        eventoRandom();
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
