// ===== ESTADO =====
let dinheiro = 0;
let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let empresa = 0;

let cargo = "Operário";
let progressoCargo = 0;

let dia = 1;
let turno = "Manhã";

let temFabrica = false;

// ===== ELEMENTOS =====
const historia = document.getElementById("historia");

// ===== HISTÓRIA =====
function addHistoria(txt) {
  historia.innerHTML = "📅 Dia " + dia + " (" + turno + ")<br>" + txt + "<br><br>" + historia.innerHTML;
  historia.scrollTop = 0;
}

// ===== BARRAS =====
function atualizarBarras() {
  setBar("eficienciaBar", eficiencia, "⚙️ Eficiência");
  setBar("saudeBar", saude, "❤️ Saúde");
  setBar("satisfacaoBar", satisfacao, "🙂 Satisfação");
  setBar("empresaBar", empresa, "🏭 Fábrica");

  atualizarCargo();
}

function setBar(id, valor, nome) {
  valor = Math.max(0, Math.min(100, valor));
  const bar = document.getElementById(id);

  bar.style.width = valor + "%";
  bar.innerText = `${nome} (${valor}%)`;
}

// ===== BARRA DE CARGO =====
function atualizarCargo() {
  const bar = document.getElementById("cargoBar");

  bar.style.width = progressoCargo + "%";
  bar.innerText = `Cargo: ${cargo} (${progressoCargo}%)`;
}

// ===== PROMOÇÃO =====
function ganharProgressoCargo(v) {
  progressoCargo += v;

  if (progressoCargo >= 100) {
    progressoCargo = 0;

    if (cargo === "Operário") {
      cargo = "Supervisor";
      addHistoria("🎉 Promoção: Supervisor!");
    } 
    else if (cargo === "Supervisor") {
      cargo = "Gerente";
      addHistoria("🎉 Promoção: Gerente!");

      // LIBERA FÁBRICA
      temFabrica = true;
      addHistoria("🏭 Você recebeu uma fábrica!");
    }
  }

  atualizarCargo();
}

// ===== AÇÕES =====
function trabalhar() {
  if (cargo === "Operário") dinheiro += 20;
  if (cargo === "Supervisor") dinheiro += 50;
  if (cargo === "Gerente") dinheiro += 100;

  eficiencia += 5;
  saude -= 3;

  ganharProgressoCargo(10);

  avancarTurno("Você trabalhou.");
}

function descansar() {
  saude += 10;
  satisfacao += 5;

  avancarTurno("Você descansou.");
}

function arriscar() {
  if (Math.random() > 0.5) {
    dinheiro += 100;
    eficiencia += 5;
    addHistoria("🔥 Você arriscou e ganhou!");
  } else {
    dinheiro -= 50;
    saude -= 5;
    addHistoria("💥 Você falhou no risco.");
  }

  avancarTurno("");
}

function fabrica() {
  if (!temFabrica) return;

  abrirPopup("🏭 Fábrica", "Escolha uma melhoria:", [
    {
      txt: "Investir (R$100)",
      efeito: () => {
        if (dinheiro >= 100) {
          dinheiro -= 100;
          empresa += 10;
          addHistoria("🏭 Você investiu na fábrica.");
        }
      }
    },
    {
      txt: "Treinar funcionários (R$80)",
      efeito: () => {
        if (dinheiro >= 80) {
          dinheiro -= 80;
          eficiencia += 10;
          empresa += 5;
          addHistoria("👷 Funcionários treinados.");
        }
      }
    }
  ]);
}

// ===== TURNOS =====
function avancarTurno(msg) {
  if (msg) addHistoria(msg);

  if (turno === "Manhã") turno = "Tarde";
  else {
    turno = "Manhã";
    dia++;
  }

  if (dia % 3 === 0 && turno === "Manhã") gerarEvento();

  atualizarBarras();
  atualizarBotoes();
}

// ===== EVENTOS NORMAIS =====
function gerarEvento() {
  const eventos = [
    {
      titulo: "⚠️ Máquina quebrou",
      texto: "A máquina parou!",
      opcoes: [
        { txt: "Consertar (-20💰 +10 eficiência)", efeito: () => { dinheiro -= 20; eficiencia += 10; } },
        { txt: "Ignorar (-10 eficiência)", efeito: () => { eficiencia -= 10; } }
      ]
    },
    {
      titulo: "😡 Trabalhadores revoltados",
      texto: "Funcionários reclamaram!",
      opcoes: [
        { txt: "Aumentar salário (-30💰 +15 satisfação)", efeito: () => { dinheiro -= 30; satisfacao += 15; } },
        { txt: "Ignorar (-20 satisfação)", efeito: () => { satisfacao -= 20; } }
      ]
    }
  ];

  gerarEventoCargo();

  const e = eventos[Math.floor(Math.random() * eventos.length)];
  abrirPopup(e.titulo, e.texto, e.opcoes);
}

// ===== EVENTOS POR CARGO =====
function gerarEventoCargo() {
  let evento = null;

  if (cargo === "Operário") {
    evento = {
      titulo: "👷 Pressão no trabalho",
      texto: "Seu chefe aumentou a cobrança.",
      opcoes: [
        { txt: "Trabalhar mais (+10 eficiência -5 saúde)", efeito: () => { eficiencia += 10; saude -= 5; } },
        { txt: "Ignorar (-10 progresso)", efeito: () => { progressoCargo -= 10; } }
      ]
    };
  }

  if (cargo === "Supervisor") {
    evento = {
      titulo: "📊 Equipe desmotivada",
      texto: "Sua equipe caiu de rendimento.",
      opcoes: [
        { txt: "Motivar (+10 satisfação)", efeito: () => { satisfacao += 10; } },
        { txt: "Punir (+10 eficiência -10 satisfação)", efeito: () => { eficiencia += 10; satisfacao -= 10; } }
      ]
    };
  }

  if (cargo === "Gerente") {
    evento = {
      titulo: "💼 Crise na fábrica",
      texto: "A produção caiu.",
      opcoes: [
        { txt: "Investir (-50💰 +15 fábrica)", efeito: () => { dinheiro -= 50; empresa += 15; } },
        { txt: "Cortar custos (-10 satisfação +5 eficiência)", efeito: () => { satisfacao -= 10; eficiencia += 5; } }
      ]
    };
  }

  if (evento) abrirPopup(evento.titulo, evento.texto, evento.opcoes);
}

// ===== POPUP =====
function abrirPopup(titulo, texto, opcoes) {
  const popup = document.getElementById("popup");
  const tituloEl = document.getElementById("popupTitulo");
  const textoEl = document.getElementById("popupTexto");
  const opcoesEl = document.getElementById("popupOpcoes");

  tituloEl.innerText = titulo;
  textoEl.innerText = texto;
  opcoesEl.innerHTML = "";

  opcoes.forEach(op => {
    const btn = document.createElement("button");
    btn.innerText = op.txt;

    btn.onclick = () => {
      op.efeito();
      popup.classList.add("hidden");
      atualizarBarras();
    };

    opcoesEl.appendChild(btn);
  });

  popup.classList.remove("hidden");
}

// ===== BOTÕES =====
function atualizarBotoes() {
  const esq = document.getElementById("opcoes-esquerda");
  const dir = document.getElementById("opcoes-direita");

  esq.innerHTML = "";
  dir.innerHTML = "";

  addBtn(esq, "Trabalhar", trabalhar);
  addBtn(esq, "Arriscar", arriscar);

  addBtn(dir, "Descansar", descansar);

  const btnF = document.createElement("button");
  btnF.innerText = "Fábrica";
  btnF.disabled = !temFabrica;
  btnF.style.background = temFabrica ? "#5a7df0" : "black";

  btnF.onclick = fabrica;
  dir.appendChild(btnF);
}

function addBtn(container, txt, func) {
  const b = document.createElement("button");
  b.innerText = txt;
  b.onclick = func;
  container.appendChild(b);
}

// ===== INÍCIO =====
addHistoria("Você começou como operário.");
atualizarBarras();
atualizarBotoes();
