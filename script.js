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
  reputacao: 50,
  empresa: false,
  cargo: "Operário",
  sucessoFabrica: 0,
  historico: [],
  erros: 0,
  recebeuFabrica: false
};

// =====================
// HUD
// =====================

function atualizarStatus() {
  document.getElementById("money").innerText = jogador.dinheiro;
  document.getElementById("cargo").innerText = jogador.cargo;

  document.getElementById("eficienciaBar").style.width = jogador.eficiencia + "%";
  document.getElementById("saudeBar").style.width = jogador.saude + "%";
  document.getElementById("satisfacaoBar").style.width = jogador.satisfacao + "%";

  // MOSTRAR %
  document.getElementById("eficienciaBar").innerText = jogador.eficiencia + "%";
  document.getElementById("saudeBar").innerText = jogador.saude + "%";
  document.getElementById("satisfacaoBar").innerText = jogador.satisfacao + "%";

  // BARRA DA EMPRESA
  if (jogador.empresa) {
    document.getElementById("barraEmpresa").style.display = "block";
    document.getElementById("empresaBar").style.width = jogador.sucessoFabrica + "%";
    document.getElementById("empresaBar").innerText = jogador.sucessoFabrica + "%";
  }
}

// =====================
// HISTÓRIA
// =====================

function addHistoria(txt) {
  jogador.historico.unshift(txt);

  document.getElementById("historia").innerHTML =
    jogador.historico.slice(0, 30)
      .map(t => `<div class="logItem">${t}</div>`)
      .join("");
}

// =====================
// POPUP
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
// EVENTOS
// =====================

function eventoRandom() {

  let eventos = [

    // Máquina
    () => mostrarPopup("⚙️ Máquina quebrou", "Uma máquina parou.",
      [
        {
          texto: "Consertar",
          efeito: "+Eficiência +Fábrica",
          acao: () => {
            jogador.eficiencia += 10;
            if (jogador.empresa) jogador.sucessoFabrica += 5;
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
    () => mostrarPopup("✊ Revolta", "Funcionários revoltados.",
      [
        {
          texto: "Apoiar",
          efeito: "+Satisfação",
          acao: () => {
            jogador.satisfacao += 10;
            if (jogador.empresa) jogador.sucessoFabrica += 3;
            addHistoria("Você apoiou a revolta.");
            proximoDia();
          }
        },
        {
          texto: "Reprimir",
          efeito: "+Reputação",
          acao: () => {
            jogador.reputacao += 10;
            addHistoria("Você reprimiu a revolta.");
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

  if (jogador.eficiencia > 80 && jogador.cargo === "Operário") {
    jogador.cargo = "Supervisor";
    addHistoria("🎉 Virou Supervisor!");
  }

  if (jogador.eficiencia > 110 && jogador.cargo === "Supervisor") {
    jogador.cargo = "Gerente";
    addHistoria("🚀 Virou Gerente!");
  }

  // EVENTO DE RECEBER FÁBRICA
  if (jogador.cargo === "Gerente" && !jogador.recebeuFabrica) {
    jogador.recebeuFabrica = true;

    mostrarPopup(
      "🏢 Nova oportunidade",
      "Você recebeu uma fábrica para gerenciar!",
      [
        {
          texto: "Aceitar",
          efeito: "Começar empresa",
          acao: () => {
            jogador.empresa = true;
            addHistoria("Você agora controla uma fábrica!");
            proximoDia();
          }
        }
      ]
    );
  }
}

// =====================
// FINAIS
// =====================

function verificarFim() {

  // TEMPO ESGOTADO
  if (jogador.dia > 365) {
    mostrarCena("⌛ Tempo acabou! Você falhou.", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  // DERROTA
  if (jogador.reputacao <= 0 || jogador.erros >= 5) {
    mostrarCena("💀 Você foi demitido.", [
      { texto: "Recomeçar", acao: () => location.reload() }
    ]);
    return true;
  }

  // VITÓRIA
  if (jogador.empresa && jogador.sucessoFabrica >= 100) {
    mostrarCena("🏆 Sua fábrica virou um sucesso!", [
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
    { texto: "Trabalhar", acao: () => { jogador.eficiencia+=10; turnoTarde(); }},
    { texto: "Estudar", acao: () => { jogador.eficiencia+=5; turnoTarde(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=5; turnoTarde(); }},
    { texto: "Reclamar", acao: () => { jogador.satisfacao+=10; turnoTarde(); }}
  ]);
}

function turnoTarde() {
  atualizarStatus();
  addHistoria(`🌇 Dia ${jogador.dia} - Tarde`);

  mostrarOpcoes([
    { texto: "Produzir", acao: () => { jogador.dinheiro+=20; eventoRandom(); }},
    { texto: "Descansar", acao: () => { jogador.saude+=10; eventoRandom(); }},
    { texto: "Arriscar", acao: () => { jogador.reputacao+=5; eventoRandom(); }},
    { texto: "Ignorar", acao: () => { jogador.erros++; eventoRandom(); }}
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
// UI
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

function mostrarCena(texto, opcoes) {
  document.getElementById("historia").innerHTML = `<div class="logItem">${texto}</div>`;

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
  addHistoria("🏭 Você começou sua jornada.");
  turnoManha();
}

inicio();
