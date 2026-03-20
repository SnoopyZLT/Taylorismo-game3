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
  erros: 0
};

function atualizarStatus() {
  money.innerText = jogador.dinheiro;
  cargo.innerText = jogador.cargo;

  eficienciaBar.style.width = jogador.eficiencia + "%";
  eficienciaBar.innerText = jogador.eficiencia + "%";

  saudeBar.style.width = jogador.saude + "%";
  saudeBar.innerText = jogador.saude + "%";

  satisfacaoBar.style.width = jogador.satisfacao + "%";
  satisfacaoBar.innerText = jogador.satisfacao + "%";

  if (jogador.empresa) {
    barraEmpresa.style.display = "block";
    empresaBar.style.width = jogador.sucessoFabrica + "%";
    empresaBar.innerText = jogador.sucessoFabrica + "%";
  }
}

function addHistoria(txt) {
  historia.innerHTML = `<div>${txt}</div>` + historia.innerHTML;
}

function mostrarOpcoes(lista) {
  opcoes.innerHTML = "";
  lista.forEach(op => {
    let b = document.createElement("button");
    b.innerText = op.texto;
    b.onclick = op.acao;
    opcoes.appendChild(b);
  });
}

function verificarFim() {
  if (jogador.dia > 200) {
    alert("⌛ Tempo acabou! Você falhou.");
    location.reload();
  }

  if (jogador.erros >= 5 || jogador.reputacao <= 0) {
    alert("💀 Você foi demitido.");
    location.reload();
  }

  if (jogador.empresa && jogador.sucessoFabrica >= 100) {
    alert("🏆 Sua fábrica virou sucesso!");
    location.reload();
  }
}

function progresso() {
  if (jogador.eficiencia > 80 && jogador.cargo === "Operário") {
    jogador.cargo = "Supervisor";
    addHistoria("Promoção: Supervisor");
  }

  if (jogador.eficiencia > 110 && jogador.cargo === "Supervisor") {
    jogador.cargo = "Gerente";
    addHistoria("Promoção: Gerente");
  }

  if (jogador.cargo === "Gerente" && !jogador.empresa) {
    jogador.empresa = true;
    addHistoria("Você recebeu uma fábrica!");
  }
}

function melhoriasFabrica() {
  if (!jogador.empresa) return;

  mostrarOpcoes([
    {
      texto: "Investir (50)",
      acao: () => {
        if (jogador.dinheiro >= 50) {
          jogador.dinheiro -= 50;
          jogador.sucessoFabrica += 10;
          addHistoria("Você investiu na fábrica.");
        }
        proximoDia();
      }
    },
    {
      texto: "Treinar funcionários",
      acao: () => {
        jogador.sucessoFabrica += 5;
        addHistoria("Treinamento realizado.");
        proximoDia();
      }
    }
  ]);
}

function turno() {
  atualizarStatus();
  addHistoria("Dia " + jogador.dia);

  mostrarOpcoes([
    {
      texto: "Trabalhar",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.dinheiro += 20;
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
        proximoDia();
      }
    },
    {
      texto: "Fábrica",
      acao: melhoriasFabrica
    }
  ]);
}

function proximoDia() {
  verificarFim();
  jogador.dia++;
  progresso();
  turno();
}

turno();
