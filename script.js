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
// EVENTOS AVANÇADOS
// =====================

function eventoRandom() {

  let eventos = [

    // GREVE
    () => mostrarPopup(
      "✊ Greve Geral",
      "Funcionários pararam tudo!",
      [
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
      ]
    ),

    // FALÊNCIA
    () => mostrarPopup(
      "💸 Risco de falência",
      "A fábrica está perdendo dinheiro.",
      [
        {
          texto: "Investir pesado",
          efeito: "+Fábrica -Dinheiro",
          acao: () => {
            jogador.dinheiro -= 50;
            jogador.sucessoFabrica += 15;
            addHistoria("Você investiu na recuperação.");
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
      ]
    )

  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];
  evento();
}

// =====================
// POPUP
// =====================

function mostrarPopup(titulo, texto, opcoes) {
  popup.classList.remove("hidden");
  popupTitulo.innerText = titulo;
  popupTexto.innerText = texto;

  popupOpcoes.innerHTML = "";

  opcoes.forEach(op => {
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
// PROMOÇÃO (DIFÍCIL)
// =====================

function progresso() {

  jogador.progressoPromo += Math.floor(jogador.eficiencia / 20);

  if (jogador.progressoPromo >= 100) {

    if (jogador.cargo === "Operário") {
      jogador.cargo = "Supervisor";
      addHistoria("Promoção: Supervisor");
    }

    else if (jogador.cargo === "Supervisor") {
      jogador.cargo = "Gerente";
      addHistoria("Promoção: Gerente");
    }

    jogador.progressoPromo = 0;
  }

  // receber fábrica
  if (jogador.cargo === "Gerente" && !jogador.empresa) {
    jogador.empresa = true;
    addHistoria("Você recebeu uma fábrica!");
  }
}

// =====================
// FÁBRICA (NOVAS OPÇÕES)
// =====================

function melhoriasFabrica() {
  if (!jogador.empresa) return;

  mostrarOpcoes([
    {
      texto: "Investir 50",
      acao: () => {
        if (jogador.dinheiro >= 50) {
          jogador.dinheiro -= 50;
          jogador.sucessoFabrica += 10;
        }
        proximoDia();
      }
    },
    {
      texto: "Automatizar 100",
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
// FIM
// =====================

function verificarFim() {

  if (jogador.dia > 200) {
    alert("⌛ Tempo acabou!");
    location.reload();
  }

  if (jogador.erros >= 5) {
    alert("💀 Demitido!");
    location.reload();
  }

  if (jogador.sucessoFabrica >= 100) {
    alert("🏆 Fábrica de sucesso!");
    location.reload();
  }
}

// =====================
// TURNO
// =====================

function turno() {
  atualizarStatus();
  addHistoria("Dia " + jogador.dia);

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

turno();
