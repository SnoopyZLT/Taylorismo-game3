// =====================
// DADOS DO JOGADOR
// =====================

let jogador = {
  eficiencia: 50,
  saude: 80,
  satisfacao: 60,
  dinheiro: 50,
  dia: 1,
  turno: "manha",
  reputacao: 50,
  empresa: false,
  cargo: "Operário",
  historico: [],
  erros: 0
};

// =====================
// HUD (LAYOUT NOVO)
// =====================

function atualizarStatus() {
  document.getElementById("money").innerText = jogador.dinheiro;
  document.getElementById("cargo").innerText = jogador.cargo;

  document.getElementById("eficienciaBar").style.width = jogador.eficiencia + "%";
  document.getElementById("saudeBar").style.width = jogador.saude + "%";
  document.getElementById("satisfacaoBar").style.width = jogador.satisfacao + "%";
}

// =====================
// HISTÓRIA (FEED)
// =====================

function addHistoria(txt) {
  jogador.historico.unshift(txt);

  document.getElementById("historia").innerHTML =
    jogador.historico
      .slice(0, 30)
      .map(t => `<div class="logItem">${t}</div>`)
      .join("");
}

// =====================
// POPUP (EVENTOS)
// =====================

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

// =====================
// EVENTOS VARIADOS
// =====================

function eventoRandom() {
  let eventos = [

    // Máquina
    () => mostrarPopup(
      "⚙️ Máquina quebrou",
      "Uma máquina parou de funcionar.",
      [
        {
          texto: "Consertar",
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
      "✊ Revolta",
      "Funcionários estão revoltados.",
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
      "Chance de crescer apareceu.",
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
          texto: "Ignorar",
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

// =====================
// PROGRESSO
// =====================

function progresso() {

  // Promoção simples
  if (jogador.eficiencia > 80 && jogador.cargo === "Operário") {
    jogador.cargo = "Supervisor";
    addHistoria("🎉 Você virou Supervisor!");
  }

  if (jogador.eficiencia > 110 && jogador.cargo === "Supervisor") {
    jogador.cargo = "Gerente";
    addHistoria("🚀 Você virou Gerente!");
  }

  // Criar empresa
  if (jogador.dinheiro >= 300 && !jogador.empresa) {
    jogador.empresa = true;
    jogador.cargo = "Empresário";
    addHistoria("🏢 Você criou sua própria fábrica!");
  }
}

// =====================
// FINAIS
// =====================

function verificarFim() {

  // DERROTA
  if (jogador.reputacao <= 0 || jogador.erros >= 5) {
    mostrarCena("💀 Você foi demitido. Final ruim.", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  // VITÓRIA
  if (jogador.empresa && jogador.dinheiro >= 500) {
    mostrarCena("🏆 Sua fábrica virou um sucesso! Final bom.", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  return false;
}

// =====================
// TURNOS
// =====================

function turnoManha() {
  atualizarStatus();
  addHistoria(`🌅 Dia ${jogador.dia} - Manhã`);

  mostrarOpcoes([
    { texto: "Trabalhar", acao: () => { jogador.eficiencia+=10; jogador.saude-=5; turnoTarde(); }},
    { texto: "Estudar", acao: () => { jogador.eficiencia+=5; turnoTarde(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=5; turnoTarde(); }},
    { texto: "Reclamar", acao: () => { jogador.satisfacao+=10; turnoTarde(); }}
  ]);
}

function turnoTarde() {
  atualizarStatus();
  addHistoria(`🌇 Dia ${jogador.dia} - Tarde`);

  mostrarOpcoes([
    { texto: "Trabalhar mais", acao: () => { jogador.dinheiro+=20; eventoRandom(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=10; eventoRandom(); }},
    { texto: "Arriscar", acao: () => { jogador.reputacao+=5; eventoRandom(); }},
    { texto: "Ignorar tudo", acao: () => { jogador.erros++; eventoRandom(); }}
  ]);
}

// =====================
// FLUXO
// =====================

function proximoDia() {
  if (verificarFim()) return;

  jogador.dia++;
  jogador.turno = "manha";
  progresso();
  turnoManha();
}

// =====================
// UI (BOTÕES)
// =====================

function mostrarOpcoes(opcoes) {
  let div = document.getElementById("opcoes");
  div.innerHTML = "";

  opcoes.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op.texto;
    btn.onclick = op.acao;
    div.appendChild(btn);
  });
}

// =====================
// INÍCIO
// =====================

function inicio() {
  atualizarStatus();
  addHistoria("🏭 Você começou sua vida na fábrica.");
  turnoManha();
}

inicio();
