let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 0,
  dia: 1,
  estilo: "neutro" // IA: trabalhador, rebelde, neutro
};

//////////////////////
// HUD COM BARRAS
//////////////////////

function barra(valor) {
  return `
    <div class="barra">
      <div class="progresso" style="width:${valor}%"></div>
    </div>
  `;
}

function atualizarStatus() {
  document.getElementById("status").innerHTML = `
  <b>📅 Dia ${jogador.dia}</b><br><br>

  ⚙️ Eficiência ${barra(jogador.eficiencia)}
  ❤️ Saúde ${barra(jogador.saude)}
  😐 Satisfação ${barra(jogador.satisfacao)}
  💰 Dinheiro: ${jogador.dinheiro}<br>
  🧠 Estilo: ${jogador.estilo}
  `;
}

//////////////////////
// CENAS
//////////////////////

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

//////////////////////
// IA (MUDA HISTÓRIA)
//////////////////////

function atualizarEstilo(acao) {
  if (acao === "trabalhar") jogador.estilo = "trabalhador";
  if (acao === "rebelde") jogador.estilo = "rebelde";
}

function eventoIA() {
  if (jogador.estilo === "trabalhador") {
    jogador.eficiencia += 5;
    return "📈 Seu esforço está sendo reconhecido pelo sistema.";
  }

  if (jogador.estilo === "rebelde") {
    jogador.satisfacao += 5;
    jogador.eficiencia -= 5;
    return "✊ Você começa a influenciar outros trabalhadores.";
  }

  return "😐 Mais um dia comum na fábrica.";
}

//////////////////////
// EVENTOS ALEATÓRIOS
//////////////////////

function eventoAleatorio() {
  let eventos = [
    () => {
      jogador.saude -= 10;
      return "😷 Você ficou doente.";
    },
    () => {
      jogador.dinheiro += 20;
      return "💰 Bônus inesperado!";
    },
    () => {
      jogador.satisfacao -= 10;
      return "😡 O chefe brigou com você.";
    }
  ];

  return eventos[Math.floor(Math.random() * eventos.length)]();
}

//////////////////////
// FINAIS
//////////////////////

function verificarFim() {
  if (jogador.saude <= 0) return final("💀 Você colapsou.");
  if (jogador.satisfacao <= 0) return final("😐 Você foi demitido.");

  if (jogador.estilo === "trabalhador" && jogador.eficiencia >= 120) {
    return final("🏆 Você virou supervisor!");
  }

  if (jogador.estilo === "rebelde" && jogador.satisfacao >= 100) {
    return final("✊ Você liderou uma revolução!");
  }

  if (jogador.dinheiro >= 200) {
    return final("💰 Você ficou rico!");
  }

  return false;
}

function final(msg) {
  mostrarCena(msg, [
    { texto: "🔄 Jogar novamente", acao: () => location.reload() }
  ]);
}

//////////////////////
// LOOP
//////////////////////

function proximoDia() {
  jogador.dia++;

  let evento = eventoAleatorio();
  let eventoIAmsg = eventoIA();

  atualizarStatus();

  mostrarCena(
    `Dia ${jogador.dia}\n\n${evento}\n${eventoIAmsg}`,
    [
      {
        texto: "⚙️ Trabalhar duro",
        acao: () => {
          atualizarEstilo("trabalhar");
          jogador.eficiencia += 10;
          jogador.saude -= 5;
          jogador.dinheiro += 10;
          atualizarStatus();
          if (!verificarFim()) proximoDia();
        }
      },
      {
        texto: "😐 Fazer o mínimo",
        acao: () => {
          jogador.satisfacao += 5;
          jogador.eficiencia -= 5;
          atualizarStatus();
          if (!verificarFim()) proximoDia();
        }
      },
      {
        texto: "✊ Questionar o sistema",
        acao: () => {
          atualizarEstilo("rebelde");
          jogador.satisfacao += 10;
          jogador.eficiencia -= 10;
          atualizarStatus();
          if (!verificarFim()) proximoDia();
        }
      }
    ]
  );
}

//////////////////////
// INÍCIO
//////////////////////

function inicio() {
  atualizarStatus();

  mostrarCena("🏭 Você entrou na fábrica.", [
    {
      texto: "⚙️ Seguir regras",
      acao: () => {
        atualizarEstilo("trabalhar");
        jogador.eficiencia += 5;
        atualizarStatus();
        proximoDia();
      }
    },
    {
      texto: "✊ Questionar",
      acao: () => {
        atualizarEstilo("rebelde");
        jogador.satisfacao += 5;
        atualizarStatus();
        proximoDia();
      }
    }
  ]);
}

inicio();
