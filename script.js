let cartelas = [];
let numerosSorteados = [];

// Converter CSV para array de objetos
function parseCSV(csv) {
  const lines = csv.trim().split("\n");

  return lines.slice(1).map(line => {
    const cols = line.split(/[,;]/);

    const numeros = [];
    for (let i = 1; i < cols.length; i++) { 
      if (cols[i] && cols[i].trim() !== "") numeros.push(cols[i].padStart(2,'0'));
    }

    return {
      ID: cols[0],
      Qtd: numeros.length,
      Números: numeros.join(",") 
    };
  });
}

// Carregar CSV externo
async function carregarCartelasCSV() {
  try {
    const res = await fetch("cartelas.csv");
    const csvText = await res.text();
    cartelas = parseCSV(csvText);
    atualizarTabela();
  } catch (e) {
    console.error("Erro ao carregar CSV:", e);
  }
}

// Atualizar tabela de cartelas
function atualizarTabela() {
  const tbody = document.getElementById("tabela-cartelas");
  tbody.innerHTML = "";

  let quadra = 0, quina = 0, mega = 0;
  let acertos1 = 0, acertos2 = 0, acertos3 = 0;

  cartelas.forEach(cartela => {
    const numeros = cartela.Números.split(",").map(n => n.trim().padStart(2,'0')).filter(n => n);
    const acertos = numeros.filter(n => numerosSorteados.includes(n)).length;

    if(acertos === 4) quadra++;
    else if(acertos === 5) quina++;
    else if(acertos === 6) mega++;
    else if(acertos === 1) acertos1++;
    else if(acertos === 2) acertos2++;
    else if(acertos === 3) acertos3++;

    const tr = document.createElement("tr");

    if(acertos === 4) tr.className = "quadra";
    if(acertos === 5) tr.className = "quina";
    if(acertos === 6) tr.className = "mega";

    const numerosHTML = numeros.map(n => numerosSorteados.includes(n) 
      ? `<span class="acerto">${n}</span>` 
      : n
    ).join(" ");

    tr.innerHTML = `
      <td>${cartela.ID}</td>
      <td>${cartela.Qtd}</td>
      <td>${numerosHTML}</td>
      <td>${acertos}</td>
    `;

    tbody.appendChild(tr);
  });

  // Contador de prêmios com acertos menores abaixo
  const contadorDiv = document.getElementById("contador-premios");
  contadorDiv.innerHTML = `
    <div class="prêmios-principais">
      <div class="prêmio-box prêmio-quadra">Quadras: ${quadra}</div>
      <div class="prêmio-box prêmio-quina">Quinas: ${quina}</div>
      <div class="prêmio-box prêmio-mega">Megas: ${mega}</div>
    </div>
    <div class="acertos-menores">
      <div>1 acerto: ${acertos1}</div>
      <div>2 acertos: ${acertos2}</div>
      <div>3 acertos: ${acertos3}</div>
    </div>
  `;

  document.getElementById("contador").textContent = `Total de cartelas: ${cartelas.length}`;
}

// Função chamada ao digitar os números sorteados
function liberarSorteio() {
  const input = document.getElementById("input-sorteio").value;
  if(!input) return alert("Digite os números sorteados!");

  numerosSorteados = input.split(/[\s,;]+/).map(n => n.padStart(2,'0'));
  atualizarTabela();
}

// Inicialização
carregarCartelasCSV();
