// Tipos para transações e elementos HTML
type Transaction = {
  desc: string;
  amount: number; // Valor armazenado como número
  type: "Entrada" | "Saída";
  month: number; // Representa o mês (0 = Janeiro, 11 = Dezembro)
  timestamp: string; // Data e hora do registro
};

// Seleção de elementos HTML
const tbody: HTMLTableSectionElement | null = document.querySelector("tbody");
const descItem: HTMLInputElement | null = document.querySelector("#desc");
const amount: HTMLInputElement | null = document.querySelector("#amount");
const type: HTMLSelectElement | null = document.querySelector("#type");
const btnNew: HTMLElement | null = document.querySelector("#btnNew");
const monthFilter: HTMLSelectElement | null = document.querySelector("#month");

const btnDownloadTxt = document.querySelector("#btnDownloadTxt") as HTMLButtonElement;
const btnClearAll = document.querySelector("#btnClearAll") as HTMLButtonElement;

const incomes: HTMLElement | null = document.querySelector(".incomes");
const expenses: HTMLElement | null = document.querySelector(".expenses");
const total: HTMLElement | null = document.querySelector(".total");

// Lista de transações
let items: Transaction[] = [];

// Adicionar nova transação
if (btnNew) {
  btnNew.onclick = () => {
    if (!descItem || !amount || !type) return; // Verifica se os elementos existem
    if (descItem.value === "" || amount.value === "" || type.value === "") {
      return alert("Preencha todos os campos!");
    }

    const currentMonth = parseInt(monthFilter!.value); // Mês selecionado no filtro
    const newAmount = parseFloat(amount.value);
    const newType = type.value as "Entrada" | "Saída";

    // Verificar saldo atual
    const currentItems = items.filter((item) => item.month === currentMonth);
    const totalIncomes = currentItems
      .filter((item) => item.type === "Entrada")
      .reduce((acc, item) => acc + item.amount, 0);
    const totalExpenses = currentItems
      .filter((item) => item.type === "Saída")
      .reduce((acc, item) => acc + item.amount, 0);
    const totalBalance = totalIncomes - totalExpenses;

    if (newType === "Saída" && newAmount > totalBalance) {
      return alert("O valor de saída não pode ser maior que o saldo disponível!");
    }

    // Capturar a data e hora atuais
    const now = new Date();
    const formattedTimestamp = now.toLocaleString(); // Formato padrão: dd/mm/yyyy, hh:mm:ss

    const newTransaction: Transaction = {
      desc: descItem.value.trim(),
      amount: newAmount, // Valor como número
      type: newType,
      month: currentMonth,
      timestamp: formattedTimestamp, // Registrar data e hora
    };

    items.push(newTransaction);
    setItensBD();
    loadItens();

    // Limpar campos
    descItem.value = "";
    amount.value = "";
  };
}

if (btnClearAll) {
  btnClearAll.onclick = () => {
    if (confirm("Tem certeza de que deseja limpar todos os registros?")) {
      items = []; // Limpar a lista de transações
      setItensBD(); // Atualizar o localStorage
      loadItens(); // Recarregar a interface
    }
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
    <td>R$ ${item.amount.toFixed(2)}</td>
    <td>${item.timestamp}</td>
    <td class="columnType">${item.type === "Entrada"
      ? '<i class="bx bxs-chevron-up-circle"></i>'
      : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Carregar transações com base no mês selecionado
function loadItens(): void {
  items = getItensBD();
  if (!tbody || !monthFilter) return;

  const selectedMonth = parseInt(monthFilter.value);
  const filteredItems = items.filter((item) => item.month === selectedMonth);

  tbody.innerHTML = "";
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals(filteredItems);
}

// Atualizar totais com base nas transações filtradas
function getTotals(filteredItems: Transaction[]): void {
  const totalIncomes = filteredItems
    .filter((item) => item.type === "Entrada")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpenses = filteredItems
    .filter((item) => item.type === "Saída")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalBalance = totalIncomes - totalExpenses;

  if (incomes) incomes.textContent = totalIncomes.toFixed(2);
  if (expenses) expenses.textContent = totalExpenses.toFixed(2);
  if (total) total.textContent = totalBalance.toFixed(2);
}

// Funções para manipulação do localStorage
const getItensBD = (): Transaction[] =>
  JSON.parse(localStorage.getItem("db_items") || "[]");

const setItensBD = (): void => {
  localStorage.setItem("db_items", JSON.stringify(items));
};

// Atualizar a interface ao mudar o mês
monthFilter!.onchange = () => loadItens();

if (btnDownloadTxt) {
  btnDownloadTxt.onclick = () => {
    const summary = items
      .map(
        (item) =>
          `${item.type} - ${item.desc}: R$ ${item.amount.toFixed(2)} (Mês: ${item.month + 1
          }, Registrado em: ${item.timestamp})`
      )
      .join("\n");

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resumo_transacoes.txt";
    link.click();
  };
}

// Inicializar carregamento
loadItens();