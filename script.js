let jogador = {
  eficiencia: 50,
  saude: 50,
  satisfacao: 50
};

function atualizarStatus() {
  document.getElementById("status").innerHTML =
    `Eficiência: ${jogador.eficiencia} | Saúde: ${jogador.saude} | Satisfação: ${jogador.satisfacao}`;
}

function mostrarCena(texto, opcoes) {
  document.getElementById("texto").innerText = texto;

  let div = document.getElementById("opcoes");
  div.innerHTML = "";

  opcoes.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto;
    btn.onclick = op.acao;
    div.appendChild(btn);
  });
}

function verificarFim() {
  if (jogador.saude <= 0) {
    alert("Você colapsou de tanto trabalhar 😵");
    location.reload();
  }
  if (jogador.satisfacao <= 0) {
    alert("Você foi demitido 😐");
    location.reload();
  }
  if (jogador.eficiencia >= 100) {
    alert("Você virou supervisor! 🏆");
    location.reload();
  }
}

function inicio() {
  atualizarStatus();

  mostrarCena("Você começa como operário em uma fábrica taylorista.", [
    {
      texto: "Trabalhar mais rápido",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.saude -= 5;
        atualizarStatus();
        verificarFim();
        inicio();
      }
    },
    {
      texto: "Reclamar das condições",
      acao: () => {
        jogador.satisfacao += 5;
        jogador.eficiencia -= 5;
        atualizarStatus();
        verificarFim();
        inicio();
      }
    },
    {
      texto: "Seguir exatamente as regras",
      acao: () => {
        jogador.eficiencia += 5;
        atualizarStatus();
        verificarFim();
        inicio();
      }
    }
  ]);
}

inicio();
