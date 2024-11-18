// Tipos para transações e elementos HTML
type Transaction = {
  desc: string;
  amount: string; // Valor formatado como string com duas casas decimais
  type: "Entrada" | "Saída";
};

type HTMLInputElementOrNull = HTMLInputElement | null;
type HTMLTableElementOrNull = HTMLTableElement | null;
type HTMLElementOrNull = HTMLElement | null;

// Seleção de elementos com checagem de tipos
const tbody: HTMLTableSectionElement | null = document.querySelector("tbody");
const descItem: HTMLInputElementOrNull = document.querySelector("#desc");
const amount: HTMLInputElementOrNull = document.querySelector("#amount");
const type: HTMLInputElementOrNull = document.querySelector("#type");
const btnNew: HTMLElementOrNull = document.querySelector("#btnNew");

const incomes: HTMLElementOrNull = document.querySelector(".incomes");
const expenses: HTMLElementOrNull = document.querySelector(".expenses");
const total: HTMLElementOrNull = document.querySelector(".total");

// Lista de transações
let items: Transaction[] = [];

// Adicionar nova transação
if (btnNew) {
  btnNew.onclick = () => {
    if (!descItem || !amount || !type) return; // Verifica se os elementos existem
    if (descItem.value === "" || amount.value === "" || type.value === "") {
      return alert("Preencha todos os campos!");
    }

    const newTransaction: Transaction = {
      desc: descItem.value.trim(),
      amount: Math.abs(parseFloat(amount.value)).toFixed(2), // Formata para 2 casas decimais
      type: type.value as "Entrada" | "Saída", // Garante que o valor seja um dos tipos esperados
    };

    items.push(newTransaction);
    setItensBD();
    loadItens();

    // Limpar campos
    descItem.value = "";
    amount.value = "";
  };
}

// Função para deletar transação
function deleteItem(index: number): void {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

// Inserir transação na tabela
function insertItem(item: Transaction, index: number): void {
  if (!tbody) return;

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Carregar transações na interface
function loadItens(): void {
  items = getItensBD();
  if (!tbody) return;

  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

// Calcular totais
function getTotals(): void {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => parseFloat(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => parseFloat(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (
    parseFloat(totalIncomes) - parseFloat(totalExpenses)
  ).toFixed(2);

  if (incomes) incomes.innerHTML = totalIncomes;
  if (expenses) expenses.innerHTML = totalExpenses;
  if (total) total.innerHTML = totalItems;
}

// Funções para manipulação do localStorage
const getItensBD = (): Transaction[] =>
  JSON.parse(localStorage.getItem("db_items") || "[]");

const setItensBD = (): void => {
  localStorage.setItem("db_items", JSON.stringify(items));
};

// Inicializar carregamento
loadItens();