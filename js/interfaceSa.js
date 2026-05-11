const mainContent = document.getElementById("mainContent");
const subHeaderText = document.getElementById("subHeaderText");

const navVersoes = document.getElementById("nav-versoes");
const navCliente = document.getElementById("nav-cliente");

let pecas = [];
let pecaSelecionada = null;

/* ===============================
   CARREGAR PEÇAS
================================ */
async function carregarPecas() {
  try {
    mainContent.innerHTML = `
      <div class="state-loading">
        <div class="spinner"></div>
        <span>Carregando projetos...</span>
      </div>
    `;

    const response = await fetch("http://localhost:8080/peca");

    if (!response.ok) {
      throw new Error("Erro ao buscar peças");
    }

    pecas = await response.json();

    renderizarProjetos();

  } catch (error) {
    console.error(error);

    mainContent.innerHTML = `
      <div class="state-error">
        <span>Erro ao carregar projetos.</span>
      </div>
    `;
  }
}

/* ===============================
   LISTA DE PROJETOS
================================ */
function renderizarProjetos() {

  subHeaderText.textContent = "Selecione um projeto";

  mainContent.innerHTML = "";

  pecas.forEach((peca) => {

    const card = document.createElement("div");
    card.className = "version-card";

    card.innerHTML = `
      <div>
        <div class="version-label">
          ${peca.nomePeca}
        </div>

        <div style="margin-top:8px; color:#444; font-size:0.9rem;">
          ID: ${peca.idPeca}
        </div>
      </div>

      <span class="badge">PROJETO</span>
    `;

    /* CLICK NO PROJETO */
    card.addEventListener("click", () => {
      pecaSelecionada = peca;

      renderizarVersoes(peca);
    });

    mainContent.appendChild(card);
  });
}

/* ===============================
   MOSTRAR VERSÕES
================================ */
function renderizarVersoes(peca) {

  subHeaderText.textContent = `Projeto: ${peca.nomePeca}`;

  mainContent.innerHTML = `
    <div class="panel-heading">
      Escolha uma versão
    </div>
  `;

  const versaoCard = document.createElement("div");
  versaoCard.className = "version-card";

  versaoCard.innerHTML = `
    <div>
      <div class="version-label">
        Versão ${peca.versao}
      </div>

      <div style="margin-top:8px; color:#444; font-size:0.9rem;">
        Criado em: ${formatarData(peca.dataCriacao)}
      </div>
    </div>

    <span class="badge">VERSÃO</span>
  `;

  /* CLICK NA VERSÃO */
  versaoCard.addEventListener("click", () => {
    mostrarImagemPeca(peca);
  });

  mainContent.appendChild(versaoCard);
}

/* ===============================
   MOSTRAR FOTO DA PEÇA
================================ */
function mostrarImagemPeca(peca) {

  subHeaderText.textContent = `Visualizando ${peca.nomePeca}`;

  mainContent.innerHTML = `
    <div class="panel-heading">
      ${peca.nomePeca}
    </div>

    <div style="display:flex; justify-content:center;">
      <img
        src="${peca.urlDoc}" 
        alt="${peca.nomePeca}"
        id="imgURLDoc"
        style="
          width:100%;
          max-width:700px;
          border-radius:10px;
          border:3px solid #999;
          object-fit:cover;
        "
      >
    </div>

    <div style="margin-top:20px;">
      <div class="info-grid">
      <a href="${peca.urlDoc}"
        <div class="info-field">
          <div class="info-value">CLIQUE AQUI PARA DAR ZOOM</div>
        </div>
        </a>


      </div>
    </div>
  `;
}

/* ===============================
   INFO CLIENTE
================================ */
function carregarInfoCliente() {

  if (!pecaSelecionada) {

    mainContent.innerHTML = `
      <div class="state-empty">
        <span>Selecione um projeto primeiro.</span>
      </div>
    `;

    return;
  }

  const cliente = pecaSelecionada.cliente;

  if (!cliente) {

    mainContent.innerHTML = `
      <div class="state-empty">
        <span>Cliente não encontrado.</span>
      </div>
    `;

    return;
  }

  subHeaderText.textContent = "Informações do Cliente";

  mainContent.innerHTML = `
    <div class="panel-heading">
      Dados do Cliente
    </div>

    <div class="info-grid">

      <div class="info-field">
        <label>Nome</label>
        <div class="info-value">
          ${cliente.nomeCliente || "-"}
        </div>
      </div>

      <div class="info-field">
        <label>CNPJ</label>
        <div class="info-value">
          ${cliente.cnpjCliente || "-"}
        </div>
      </div>

      <div class="info-field">
        <label>Email</label>
        <div class="info-value">
          ${cliente.emailCliente || "-"}
        </div>
      </div>

      <div class="info-field">
        <label>Telefone</label>
        <div class="info-value">
          ${cliente.telefoneCliente || "-"}
        </div>
      </div>

      <div class="info-field" style="grid-column:1/-1;">
        <label>Observações</label>
        <div class="info-value">
          ${cliente.observacaoCliente || "-"}
        </div>
      </div>

    </div>
  `;
}

/* ===============================
   FORMATA DATA
================================ */
function formatarData(data) {

  return new Date(data).toLocaleDateString("pt-BR");
}

/* ===============================
   MENU LATERAL
================================ */
navVersoes.addEventListener("click", () => {

  navVersoes.classList.add("active");
  navCliente.classList.remove("active");

  carregarPecas();
});

navCliente.addEventListener("click", () => {

  navCliente.classList.add("active");
  navVersoes.classList.remove("active");

  carregarInfoCliente();
});

/* ===============================
   INICIAR
================================ */
carregarPecas();