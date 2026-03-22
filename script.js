// ===== ESTADO =====
let dia = 1;

let dinheiro = 0;
let cargo = "Operário";
let progresso = 0;

let eficiencia = 50;
let saude = 80;
let satisfacao = 60;
let fabrica = 0;

let temFabrica = false;

// ===== ELEMENTOS =====
const log = document.getElementById("log");
const dinheiroEl = document.getElementById("dinheiro");
const cargoEl = document.getElementById("cargo");

// popup
const popup = document.getElementById("popup");
const texto = document.getElementById("popup-texto");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

// ===== UI =====
function atualizar() {

    dinheiroEl.innerText = "💰 " + dinheiro;
    cargoEl.innerText = `Cargo: ${cargo}`;

    // barras
    setBar("eficiencia-bar", eficiencia);
    setBar("saude-bar", saude);
    setBar("satisfacao-bar", satisfacao);
    setBar("fabrica-bar", fabrica);
    setBar("barraCargo", progresso);

    document.getElementById("txtCargo").innerText = progresso + "%";

    // desbloquear fábrica
    if (cargo === "Gerente" && !temFabrica) {
        temFabrica = true;
        document.getElementById("btn-fabrica").style.background = "#2563eb";
        addLog("🏭 Você desbloqueou sua fábrica!");
    }
}

// ===== BARRAS =====
function setBar(id, valor) {
    valor = Math.max(0, Math.min(100, valor));
    const el = document.getElementById(id);
    if (!el) return;

    el.style.width = valor + "%";
    el.innerText = valor + "%";
}

// ===== LOG =====
function addLog(msg) {
    const div = document.createElement("div");
    div.innerText = `📅 Dia ${dia}: ${msg}`;
    log.prepend(div);
}

// ===== SALÁRIO =====
function salario() {
    if (cargo === "Operário") return 20;
    if (cargo === "Supervisor") return 50;
    if (cargo === "Gerente") return 100;
}

// ===== AÇÕES =====
function trabalhar() {
    dinheiro += salario();
    eficiencia += 5;
    satisfacao -= 5;
    progresso += 10;

    addLog("Você trabalhou.");
    avancar();
}

function descansar() {
    saude += 10;
    satisfacao += 5;
    eficiencia -= 5;

    addLog("Você descansou.");
    avancar();
}

function arriscar() {
    if (Math.random() > 0.5) {
        dinheiro += 100;
        addLog("🎲 Você ganhou dinheiro!");
    } else {
        saude -= 10;
        addLog("💥 Deu ruim!");
    }

    avancar();
}

// ===== PROMOÇÃO =====
function promover() {
    if (progresso >= 100) {
        progresso = 0;

        if (cargo === "Operário") {
            cargo = "Supervisor";
            addLog("📈 Promoção para Supervisor!");
        } else if (cargo === "Supervisor") {
            cargo = "Gerente";
            addLog("🏆 Promoção para Gerente!");
        }
    }
}

// ===== EVENTOS =====
function evento() {

    if (dia % 3 !== 0) return;

    popup.style.display = "block";
    texto.innerText = "⚠️ Problema na fábrica!";

    btn1.innerText = "Resolver (-$50 +Eficiência)";
    btn2.innerText = "Ignorar (-Eficiência)";

    btn1.onclick = () => {
        dinheiro -= 50;
        eficiencia += 10;
        addLog("Você resolveu o problema.");
        fechar();
    };

    btn2.onclick = () => {
        eficiencia -= 10;
        addLog("Você ignorou o problema.");
        fechar();
    };
}

// ===== FÁBRICA =====
function abrirFabrica() {

    if (!temFabrica) return;

    popup.style.display = "block";
    texto.innerText = "🏭 Investir na fábrica?";

    btn1.innerText = "Máquinas ($100 +20%)";
    btn2.innerText = "Cancelar";

    btn1.onclick = () => {
        if (dinheiro >= 100) {
            dinheiro -= 100;
            fabrica += 20;
            addLog("Você melhorou a fábrica!");
        }
        fechar();
    };

    btn2.onclick = fechar;
}

// ===== FECHAR POPUP =====
function fechar() {
    popup.style.display = "none";
    atualizar();
}

// ===== FINAIS =====
function fim() {

    if (fabrica >= 100) {
        alert("🏆 FINAL BOM: Fábrica de sucesso!");
        location.reload();
    }

    if (satisfacao <= 0 || eficiencia <= 0) {
        alert("💀 FINAL RUIM: Você foi demitido!");
        location.reload();
    }
}

// ===== AVANÇAR =====
function avancar() {
    dia++;

    promover();
    evento();
    fim();
    atualizar();
}

// ===== BOTÃO + =====
function passarDia() {
    addLog("Você deixou o tempo passar.");
    avancar();
}

// ===== START =====
atualizar();
