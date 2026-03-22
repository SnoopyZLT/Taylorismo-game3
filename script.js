// ===== ESTADO DO JOGO =====
let dia = 1;
let dinheiro = 0;
let cargo = "Operário";
let progressoCargo = 0;

let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let temFabrica = false;

// ===== ELEMENTOS =====
const log = document.getElementById("log");
const dinheiroEl = document.getElementById("dinheiro");
const cargoEl = document.getElementById("cargo");
const diaEl = document.getElementById("dia");

const popup = document.getElementById("popup");
const popupTexto = document.getElementById("popup-texto");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

// ===== ATUALIZAR UI =====
function atualizarUI() {
    dinheiroEl.innerText = dinheiro;
    cargoEl.innerText = `Cargo: ${cargo} (${progressoCargo}%)`;
    diaEl.innerText = `Dia ${dia}`;

    atualizarBarra("eficiencia-bar", eficiencia);
    atualizarBarra("saude-bar", saude);
    atualizarBarra("satisfacao-bar", satisfacao);
    atualizarBarra("fabrica-bar", fabrica);

    // desbloquear fábrica
    if (cargo === "Gerente" && !temFabrica) {
        temFabrica = true;
        adicionarLog("🏭 Você ganhou sua própria fábrica!");
        document.getElementById("btn-fabrica").style.background = "#ff6600";
    }
}

// ===== BARRAS =====
function atualizarBarra(id, valor) {
    const el = document.getElementById(id);
    if (!el) return;
    valor = Math.max(0, Math.min(100, valor));
    el.style.width = valor + "%";
    el.innerText = valor + "%";
}

// ===== LOG =====
function adicionarLog(texto) {
    const item = document.createElement("div");
    item.innerText = `📅 Dia ${dia} - ${texto}`;
    log.prepend(item);
}

// ===== AÇÕES =====
function trabalhar() {
    dinheiro += getSalario();
    eficiencia += 5;
    satisfacao -= 5;
    progressoCargo += 10;

    adicionarLog("Você trabalhou duro.");
    avancarDia();
}

function descansar() {
    saude += 10;
    satisfacao += 5;
    eficiencia -= 5;

    adicionarLog("Você descansou.");
    avancarDia();
}

function arriscar() {
    let sorte = Math.random();

    if (sorte > 0.5) {
        dinheiro += 100;
        adicionarLog("🎲 Você ganhou dinheiro!");
    } else {
        saude -= 10;
        adicionarLog("💥 Algo deu errado!");
    }

    avancarDia();
}

// ===== SALÁRIO =====
function getSalario() {
    if (cargo === "Operário") return 20;
    if (cargo === "Supervisor") return 50;
    if (cargo === "Gerente") return 100;
    return 10;
}

// ===== PROMOÇÃO =====
function verificarPromocao() {
    if (progressoCargo >= 100) {
        progressoCargo = 0;

        if (cargo === "Operário") {
            cargo = "Supervisor";
            adicionarLog("📈 Promoção para Supervisor!");
        } else if (cargo === "Supervisor") {
            cargo = "Gerente";
            adicionarLog("📈 Promoção para Gerente!");
        }
    }
}

// ===== EVENTOS =====
function gerarEvento() {
    if (dia % 3 !== 0) return;

    const eventos = [
        {
            texto: "⚠️ Máquina quebrou!",
            op1: { txt: "Consertar (-$50, +eficiência)", efeito: () => { dinheiro -= 50; eficiencia += 10; }},
            op2: { txt: "Ignorar (-eficiência)", efeito: () => { eficiencia -= 10; }}
        },
        {
            texto: "🚩 Greve dos trabalhadores!",
            op1: { txt: "Aumentar salários (-$100, +satisfação)", efeito: () => { dinheiro -= 100; satisfacao += 15; }},
            op2: { txt: "Ignorar (-satisfação)", efeito: () => { satisfacao -= 15; }}
        }
    ];

    let e = eventos[Math.floor(Math.random() * eventos.length)];

    popup.style.display = "block";
    popupTexto.innerText = e.texto;

    btn1.innerText = e.op1.txt;
    btn2.innerText = e.op2.txt;

    btn1.onclick = () => {
        e.op1.efeito();
        fecharPopup();
    };

    btn2.onclick = () => {
        e.op2.efeito();
        fecharPopup();
    };
}

// ===== FECHAR POPUP =====
function fecharPopup() {
    popup.style.display = "none";
    atualizarUI();
}

// ===== FÁBRICA =====
function abrirFabrica() {
    if (!temFabrica) return;

    popup.style.display = "block";
    popupTexto.innerText = "🏭 Investir na fábrica?";

    btn1.innerText = "Investir $100 (+20%)";
    btn2.innerText = "Cancelar";

    btn1.onclick = () => {
        if (dinheiro >= 100) {
            dinheiro -= 100;
            fabrica += 20;
            adicionarLog("🏭 Você investiu na fábrica!");
        }
        fecharPopup();
    };

    btn2.onclick = fecharPopup;
}

// ===== FINAIS =====
function verificarFim() {
    if (fabrica >= 100) {
        alert("🏆 FINAL BOM: Sua fábrica virou um sucesso!");
        location.reload();
    }

    if (satisfacao <= 0 || eficiencia <= 0) {
        alert("💀 FINAL RUIM: Você foi demitido!");
        location.reload();
    }
}

// ===== AVANÇAR DIA =====
function avancarDia() {
    dia++;

    verificarPromocao();
    gerarEvento();
    verificarFim();
    atualizarUI();
}

// ===== BOTÃO + =====
function passarDia() {
    adicionarLog("Você apenas deixou o tempo passar.");
    avancarDia();
}

// ===== INIT =====
atualizarUI();
