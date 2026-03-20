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
  historico: []
};

//////////////////////
// HUD
//////////////////////

function barra(v) {
  return `<div class="barra"><div class="progresso" style="width:${v}%"></div></div>`;
}

function atualizarStatus() {
  document.getElementById("money").innerText = jogador.dinheiro;

  document.getElementById("status").innerHTML = `
    📅 Dia ${jogador.dia} (${jogador.turno})
    ⚙️ ${barra(jogador.eficiencia)}
    ❤️ ${barra(jogador.saude)}
    😐 ${barra(jogador.satisfacao)}
  `;
}

//////////////////////
// HISTÓRIA
//////////////////////

function addHistoria(txt) {
  jogador.historico.unshift(txt);
  document.getElementById("historia").innerHTML =
    jogador.historico.slice(0, 20).map(t => `<div class="logItem">${t}</div>`).join("");
}

//////////////////////
// POPUP
//////////////////////

function mostrarPopup(titulo, texto, opcoes) {
  document.getElementById("popup").classList.remove("hidden");

  document.getElementById("popupTitulo").innerText = titulo;
  document.getElementById("popupTexto").innerText = texto;

  let div = document.getElementById("popupOpcoes");
  div.innerHTML = "";

  opcoes.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto + " (" + op.efeito + ")";
    btn.onclick = () => {
      op.acao();
      document.getElementById("popup").classList.add("hidden");
      atualizarStatus();
    };
    div.appendChild(btn);
  });
}

//////////////////////
// SISTEMAS
//////////////////////

function promocao() {
  if (jogador.eficiencia > 80 && jogador.cargo === "Operário") {
    jogador.cargo = "Supervisor";
    addHistoria("🎉 Promovido a Supervisor!");
  }

  if (jogador.eficiencia > 110 && jogador.cargo === "Supervisor") {
    jogador.cargo = "Gerente";
    addHistoria("🚀 Agora você é Gerente!");
  }
}

function empresa() {
  if (jogador.dinheiro >= 300 && !jogador.empresa) {
    jogador.empresa = true;
    jogador.cargo = "Empresário";
    addHistoria("🏢 Você abriu sua empresa!");
  }
}

//////////////////////
// TURNOS
//////////////////////

function turnoManha() {
  atualizarStatus();
  addHistoria(`🌅 Dia ${jogador.dia} - Manhã`);

  mostrarCena("O dia começou na fábrica.", [
    { texto: "Trabalhar duro", acao: () => { jogador.eficiencia+=10; jogador.saude-=5; jogador.dinheiro+=10; proximoTurno(); }},
    { texto: "Estudar", acao: () => { jogador.eficiencia+=5; proximoTurno(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=5; proximoTurno(); }},
    { texto: "Reclamar", acao: () => { jogador.satisfacao+=10; proximoTurno(); }}
  ]);
}

function turnoTarde() {
  atualizarStatus();
  addHistoria(`🌇 Dia ${jogador.dia} - Tarde`);

  mostrarCena("Turno da tarde.", [
    { texto: "Impressionar chefe", acao: () => { jogador.eficiencia+=10; jogador.reputacao+=5; eventoRandom(); }},
    { texto: "Hora extra", acao: () => { jogador.dinheiro+=20; jogador.saude-=5; eventoRandom(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=10; eventoRandom(); }},
    { texto: "Revolta", acao: () => { jogador.satisfacao+=10; eventoRandom(); }}
  ]);
}

//////////////////////
// EVENTO POPUP
//////////////////////

function eventoRandom() {
  mostrarPopup(
    "⚠️ Evento",
    "Algo inesperado aconteceu!",
    [
      {
        texto: "Resolver",
        efeito: "+Eficiência",
        acao: () => {
          jogador.eficiencia += 5;
          addHistoria("Você resolveu um problema.");
          proximoDia();
        }
      },
      {
        texto: "Ignorar",
        efeito: "-Reputação",
        acao: () => {
          jogador.reputacao -= 5;
          addHistoria("Você ignorou o problema.");
          proximoDia();
        }
      }
    ]
  );
}

//////////////////////
// FLUXO
//////////////////////

function proximoTurno() {
  jogador.turno = "tarde";
  promocao();
  empresa();
  turnoTarde();
}

function proximoDia() {
  jogador.dia++;
  jogador.turno = "manha";
  promocao();
  empresa();
  turnoManha();
}

//////////////////////
// UI
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
// INÍCIO
//////////////////////

function inicio() {
  atualizarStatus();
  addHistoria("🏭 Você começou sua jornada.");
  mostrarCena("Começar?", [
    { texto: "Iniciar", acao: turnoManha }
  ]);
}

inicio();
