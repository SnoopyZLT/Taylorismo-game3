let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 50,
  dia: 1,
  turno: "manha",
  reputacao: 50,
  empresa: false,
  historico: [],
  erros: 0
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
    📅 Dia ${jogador.dia} (${jogador.turno})<br>
    ⭐ Reputação: ${jogador.reputacao}
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
    jogador.historico.slice(0, 25).map(t => `<div class="logItem">${t}</div>`).join("");
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
    btn.innerText = `${op.texto} (${op.efeito})`;
    btn.onclick = () => {
      op.acao();
      document.getElementById("popup").classList.add("hidden");
      atualizarStatus();
    };
    div.appendChild(btn);
  });
}

//////////////////////
// EVENTOS AVANÇADOS
//////////////////////

function eventoRandom() {
  let eventos = [

    // Máquina quebrada
    () => mostrarPopup(
      "⚙️ Máquina quebrou",
      "Uma máquina parou de funcionar.",
      [
        {
          texto: "Consertar rápido",
          efeito: "+Eficiência -Saúde",
          acao: () => {
            jogador.eficiencia += 10;
            jogador.saude -= 5;
            addHistoria("Você consertou a máquina.");
            proximoDia();
          }
        },
        {
          texto: "Ignorar",
          efeito: "-Reputação",
          acao: () => {
            jogador.reputacao -= 10;
            jogador.erros++;
            addHistoria("Você ignorou o problema.");
            proximoDia();
          }
        }
      ]
    ),

    // Revolta
    () => mostrarPopup(
      "✊ Revolta de trabalhadores",
      "Os funcionários estão revoltados.",
      [
        {
          texto: "Apoiar",
          efeito: "+Satisfação -Reputação",
          acao: () => {
            jogador.satisfacao += 10;
            jogador.reputacao -= 5;
            addHistoria("Você apoiou a revolta.");
            proximoDia();
          }
        },
        {
          texto: "Reprimir",
          efeito: "+Reputação -Satisfação",
          acao: () => {
            jogador.reputacao += 10;
            jogador.satisfacao -= 10;
            addHistoria("Você reprimiu a revolta.");
            proximoDia();
          }
        }
      ]
    ),

    // Oportunidade
    () => mostrarPopup(
      "💼 Oportunidade",
      "Você pode crescer na empresa.",
      [
        {
          texto: "Aproveitar",
          efeito: "+Reputação",
          acao: () => {
            jogador.reputacao += 10;
            jogador.eficiencia += 5;
            addHistoria("Você aproveitou a oportunidade.");
            proximoDia();
          }
        },
        {
          texto: "Recusar",
          efeito: "Nada",
          acao: () => {
            addHistoria("Você ignorou a oportunidade.");
            proximoDia();
          }
        }
      ]
    )
  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];
  evento();
}

//////////////////////
// PROMOÇÃO + EMPRESA
//////////////////////

function progresso() {
  if (jogador.eficiencia > 80 && !jogador.empresa) {
    jogador.reputacao += 5;
  }

  if (jogador.dinheiro >= 300 && !jogador.empresa) {
    jogador.empresa = true;
    addHistoria("🏢 Você criou sua própria fábrica!");
  }
}

//////////////////////
// FINAIS
//////////////////////

function verificarFim() {

  // FINAL RUIM
  if (jogador.reputacao <= 0 || jogador.erros >= 5) {
    mostrarCena("💀 FINAL RUIM: Você foi demitido por incompetência.", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  // FINAL BOM
  if (jogador.empresa && jogador.dinheiro >= 500) {
    mostrarCena("🏆 FINAL BOM: Sua fábrica virou um sucesso!", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  return false;
}

//////////////////////
// TURNOS
//////////////////////

function turnoManha() {
  atualizarStatus();
  addHistoria(`🌅 Dia ${jogador.dia} - Manhã`);

  mostrarCena("O que fazer?", [
    { texto: "Trabalhar", acao: () => { jogador.eficiencia+=10; jogador.saude-=5; proximoTurno(); }},
    { texto: "Estudar", acao: () => { jogador.eficiencia+=5; proximoTurno(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=5; proximoTurno(); }},
    { texto: "Reclamar", acao: () => { jogador.satisfacao+=10; proximoTurno(); }}
  ]);
}

function turnoTarde() {
  atualizarStatus();
  addHistoria(`🌇 Dia ${jogador.dia} - Tarde`);

  mostrarCena("Turno da tarde", [
    { texto: "Trabalhar mais", acao: () => { jogador.dinheiro+=20; eventoRandom(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=10; eventoRandom(); }},
    { texto: "Arriscar decisão", acao: () => { jogador.reputacao+=5; eventoRandom(); }},
    { texto: "Ignorar tudo", acao: () => { jogador.erros++; eventoRandom(); }}
  ]);
}

//////////////////////
// FLUXO
//////////////////////

function proximoTurno() {
  jogador.turno = "tarde";
  progresso();
  turnoTarde();
}

function proximoDia() {
  if (verificarFim()) return;

  jogador.dia++;
  jogador.turno = "manha";
  progresso();
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
