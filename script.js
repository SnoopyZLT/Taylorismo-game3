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
let descansoSeguido = 0;

// ===== ELEMENTOS =====
const log = document.getElementById("log");
const dinheiroEl = document.getElementById("dinheiro");
const cargoEl = document.getElementById("cargo");

// popup
const popup = document.getElementById("popup");
const texto = document.getElementById("popup-texto");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

// ===== CONFIG DINÂMICA =====
function salario() {
    if (cargo === "Operário") return 3;
    if (cargo === "Supervisor") return 6;
    if (cargo === "Gerente") return 18;
}

function custoEvento() {
    if (cargo === "Operário") return 10;
    if (cargo === "Supervisor") return 15;
    if (cargo === "Gerente") return 30;
}

// ===== UI =====
function atualizar() {

    dinheiroEl.innerText = "💰 " + dinheiro;
    cargoEl.innerText = `Cargo: ${cargo}`;

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

    // scroll automático
    log.scrollTop = 0;
}

// ===== BARRAS COM ANIMAÇÃO =====
function setBar(id, valor) {
    valor = Math.max(0, Math.min(100, valor));
    const el = document.getElementById(id);
    if (!el) return;

    el.style.transition = "width 0.4s ease";
    el.style.width = valor + "%";
    el.innerText = valor + "%";
}

// ===== LOG =====
function addLog(msg) {
    const div = document.createElement("div");
    div.innerText = `📅 Dia ${dia}: ${msg}`;
    log.prepend(div);
}

// ===== AÇÕES =====
function trabalhar() {
    descansoSeguido = 0;

    dinheiro += salario();
    eficiencia += 5;
    satisfacao -= 5;
    progresso += 10;

    addLog("Você trabalhou.");
    avancar();
}

function descansar() {
    descansoSeguido++;

    saude += 10;
    satisfacao += 5;
    eficiencia -= 5;

    if (descansoSeguido >= 3) {
        dinheiro -= 30;
        addLog("💸 Você descansou demais e perdeu dinheiro!");
        descansoSeguido = 0;
    }

    addLog("Você descansou.");
    avancar();
}

function arriscar() {
    descansoSeguido = 0;

    if (Math.random() > 0.5) {
        dinheiro += 20;
        addLog("🎲 Você ganhou dinheiro!");
    } else {
        saude -= 10;
        addLog("💥 Algo deu errado!");
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

    popup.style.display = "flex";

    let custo = custoEvento();

    texto.innerText = "⚠️ Problema na fábrica!";

    btn1.innerText = `Resolver (-R$${custo} +Eficiência)`;
    btn2.innerText = "Ignorar (-Eficiência)";

    btn1.onclick = () => {
        dinheiro -= custo;
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

    popup.style.display = "flex";
    texto.innerText = "🏭 Melhorar a fábrica?";

    btn1.innerText = "Máquinas (-R$50 +20%)";
    btn2.innerText = "Cancelar";

    btn1.onclick = () => {
        if (dinheiro >= 50) {
            dinheiro -= 50;
            fabrica += 20;
            addLog("Você investiu na fábrica!");
        } else {
            addLog("❌ Dinheiro insuficiente!");
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

    // vitória
    if (fabrica >= 100) {
        popup.style.display = "flex";
        texto.innerText = "🏆 Você construiu uma fábrica de sucesso!";
        btn1.innerText = "Reiniciar";
        btn2.style.display = "none";

        btn1.onclick = () => location.reload();
        return;
    }

    // falência
    if (dinheiro <= -50) {
        popup.style.display = "flex";
        texto.innerText = "💀 Você faliu e foi demitido!";
        btn1.innerText = "Reiniciar";
        btn2.style.display = "none";

        btn1.onclick = () => location.reload();
        return;
    }

    // derrota normal
    if (satisfacao <= 0 || eficiencia <= 0) {
        popup.style.display = "flex";
        texto.innerText = "💀 Você foi demitido!";
        btn1.innerText = "Reiniciar";
        btn2.style.display = "none";

        btn1.onclick = () => location.reload();
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
    addLog("⏩ O tempo passou.");
    avancar();
}

// ===== START =====
atualizar();
