// =====================
// DADOS
// =====================

let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 50,
  dia: 1,
  turno: "manha",
  estilo: "neutro",
  cargo: "Operário",
  reputacao: 50,
  empresa: false,
  narrativaSeed: Math.floor(Math.random() * 1000),
  historico: []
};

//////////////////////
// HISTÓRIA (LOG)
//////////////////////

function adicionarHistoria(texto) {
  jogador.historico.unshift(texto);

  let html = jogador.historico
    .slice(0, 20)
    .map(e => `<div class="logItem">${e}</div>`)
    .join("");

  document.getElementById("historia").innerHTML = html;
}

//////////////////////
// HUD
//////////////////////

function barra(v) {
  return `<div class="barra"><div class="progresso" style="width:${v}%"></div></div>`;
}

function atualizarStatus() {
  document.getElementById("status").innerHTML = `
  <div class="card">
    📅 Dia ${jogador.dia} - ${jogador.turno.toUpperCase()}<br>
    🏢 ${jogador.cargo} ${jogador.empresa ? "(Dono)" : ""}<br>
    💰 ${jogador.dinheiro} | ⭐ ${jogador.reputacao}<br>
    🧠 ${jogador.estilo}
  </div>

  ⚙️ ${barra(jogador.eficiencia)}
  ❤️ ${barra(jogador.saude)}
  😐 ${barra(jogador.satisfacao)}
  `;
}

//////////////////////
// IA NARRATIVA
//////////////////////

function narrativa() {
  let seed = jogador.narrativaSeed + jogador.dia;

  let eventos = [
    "📊 Um inspetor está observando.",
    "⚠️ Produção em alta pressão.",
    "👥 Funcionários estão inquietos.",
    "💼 Chance de crescimento apareceu."
  ];

  return eventos[seed % eventos.length];
}

function registrar(acao) {
  if (acao === "trabalhar") jogador.estilo = "produtivo";
  if (acao === "rebelde") jogador.estilo = "rebelde";
}

//////////////////////
// PROMOÇÃO
//////////////////////

function promocao() {
  if (jogador.eficiencia > 80 && jogador.cargo === "Operário") {
    jogador.cargo = "Supervisor";
    adicionarHistoria("🎉 Promovido a Supervisor!");
  }

  if (jogador.eficiencia > 110 && jogador.cargo === "Supervisor") {
    jogador.cargo = "Gerente";
    adicionarHistoria("🚀 Agora você é Gerente!");
  }
}

//////////////////////
// EMPRESA
//////////////////////

function verificarEmpresa() {
  if (jogador.dinheiro >= 300 && !jogador.empresa) {
    jogador.empresa = true;
    jogador.cargo = "Empresário";
    adicionarHistoria("🏢 Você abriu sua própria empresa!");
  }
}

//////////////////////
// CENA
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
// TURNOS
//////////////////////

function turnoManha() {
  atualizarStatus();
  adicionarHistoria(`🌅 Dia ${jogador.dia} - Manhã`);

  mostrarCena(narrativa(), [
    {
      texto: "⚙️ Produzir muito",
      acao: () => {
        registrar("trabalhar");
        jogador.eficiencia += 10;
        jogador.saude -= 5;
        jogador.dinheiro += 15;
        adicionarHistoria("Você trabalhou intensamente.");
        proximoTurno();
      }
    },
    {
      texto: "📚 Estudar técnicas",
      acao: () => {
        jogador.eficiencia += 5;
        jogador.reputacao += 5;
        adicionarHistoria("Você estudou novas técnicas.");
        proximoTurno();
      }
    },
    {
      texto: "😐 Fazer o básico",
      acao: () => {
        jogador.satisfacao += 5;
        adicionarHistoria("Você fez apenas o necessário.");
        proximoTurno();
      }
    },
    {
      texto: "✊ Reclamar",
      acao: () => {
        registrar("rebelde");
        jogador.satisfacao += 10;
        jogador.reputacao -= 5;
        adicionarHistoria("Você reclamou do sistema.");
        proximoTurno();
      }
    },
    {
      texto: "💰 Fazer trabalho extra",
      acao: () => {
        jogador.dinheiro += 20;
        jogador.saude -= 5;
        adicionarHistoria("Você fez trabalho extra.");
        proximoTurno();
      }
    }
  ]);
}

function turnoTarde() {
  atualizarStatus();
  adicionarHistoria(`🌇 Dia ${jogador.dia} - Tarde`);

  let opcoes = [
    {
      texto: "💼 Impressionar chefe",
      acao: () => {
        jogador.eficiencia += 10;
        jogador.reputacao += 5;
        adicionarHistoria("Você impressionou o chefe.");
        proximoDia();
      }
    },
    {
      texto: "🧘 Descansar",
      acao: () => {
        jogador.saude += 10;
        adicionarHistoria("Você descansou.");
        proximoDia();
      }
    },
    {
      texto: "🔥 Incentivar revolta",
      acao: () => {
        registrar("rebelde");
        jogador.satisfacao += 10;
        adicionarHistoria("Você incentivou uma revolta.");
        proximoDia();
      }
    },
    {
      texto: "📈 Melhorar processo",
      acao: () => {
        jogador.eficiencia += 8;
        adicionarHistoria("Você melhorou o processo.");
        proximoDia();
      }
    }
  ];

  // SE FOR DONO DA EMPRESA
  if (jogador.empresa) {
    opcoes.push({
      texto: "🏢 Gerenciar funcionários",
      acao: () => {
        jogador.dinheiro += 30;
        jogador.satisfacao -= 5;
        adicionarHistoria("Você gerenciou seus funcionários.");
        proximoDia();
      }
    });
  }

  mostrarCena(narrativa(), opcoes);
}

//////////////////////
// FLUXO
//////////////////////

function proximoTurno() {
  jogador.turno = "tarde";
  promocao();
  verificarEmpresa();
  turnoTarde();
}

function proximoDia() {
  jogador.dia++;
  jogador.turno = "manha";
  promocao();
  verificarEmpresa();
  turnoManha();
}

//////////////////////
// INÍCIO
//////////////////////

function inicio() {
  atualizarStatus();
  adicionarHistoria("🏭 Você começou sua vida na fábrica.");

  mostrarCena("Começar jornada", [
    {
      texto: "Iniciar",
      acao: () => turnoManha()
    }
  ]);
}

inicio()
