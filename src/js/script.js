"use strict";
const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");
const monthFilter = document.querySelector("#month");
const btnLogout = document.querySelector("#btnLogout");
const btnDownloadTxt = document.querySelector("#btnDownloadTxt");
const btnClearAll = document.querySelector("#btnClearAll");
const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");
let items = [];
// Obter usuário logado
const loggedUser = sessionStorage.getItem("loggedUser");
if (!loggedUser) {
    window.location.href = "login.html";
}
// Função para carregar dados do localStorage do usuário logado
const loadUserTransactions = () => {
    const userTransactions = localStorage.getItem(`transactions_${loggedUser}`);
    return userTransactions ? JSON.parse(userTransactions) : [];
};
// Função para salvar dados no localStorage
const saveUserTransactions = () => {
    localStorage.setItem(`transactions_${loggedUser}`, JSON.stringify(items));
};
// Inicializar lista de transações ao carregar o sistema
items = loadUserTransactions();
// Adicionar nova transação
btnNew.onclick = () => {
    if (!descItem || !amount || !type)
        return;
    if (descItem.value === "" || amount.value === "") {
        alert("Preencha todos os campos!");
        return;
    }
    const currentMonth = parseInt(monthFilter.value);
    const newAmount = parseFloat(amount.value);
    const newType = type.value;
    const now = new Date();
    const formattedTimestamp = now.toLocaleString();
    const newTransaction = {
        desc: descItem.value.trim(),
        amount: newAmount,
        type: newType,
        month: currentMonth,
        timestamp: formattedTimestamp,
    };
    items.push(newTransaction);
    saveUserTransactions();
    loadItens();
    descItem.value = "";
    amount.value = "";
};
// Função para carregar transações
function loadItens() {
    if (!tbody)
        return;
    const selectedMonth = parseInt(monthFilter.value);
    const filteredItems = items.filter((item) => item.month === selectedMonth);
    tbody.innerHTML = "";
    filteredItems.forEach((item, index) => {
        insertItem(item, index);
    });
    updateTotals(filteredItems);
}
// Função para inserir transações na tabela
function insertItem(item, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount.toFixed(2)}</td>
    <td>${item.timestamp}</td>
    <td class="columnType">${item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
    tbody.appendChild(tr);
}
// Função para excluir transação
function deleteItem(index) {
    items.splice(index, 1);
    saveUserTransactions();
    loadItens();
}
// Atualizar totais
function updateTotals(filteredItems) {
    const totalIncomes = filteredItems
        .filter((item) => item.type === "Entrada")
        .reduce((acc, item) => acc + item.amount, 0);
    const totalExpenses = filteredItems
        .filter((item) => item.type === "Saída")
        .reduce((acc, item) => acc + item.amount, 0);
    const totalBalance = totalIncomes - totalExpenses;
    incomes.textContent = totalIncomes.toFixed(2);
    expenses.textContent = totalExpenses.toFixed(2);
    total.textContent = totalBalance.toFixed(2);
}
// Logout
btnLogout.onclick = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
};
if (btnClearAll) {
    btnClearAll.onclick = () => {
        if (confirm("Tem certeza de que deseja limpar todos os registros?")) {
            items = []; // Limpar a lista de transações
            saveUserTransactions(); // Atualizar o localStorage
            loadItens(); // Recarregar a interface
        }
    };
}
if (btnDownloadTxt) {
    btnDownloadTxt.onclick = () => {
        const summary = items
            .map((item) => `${item.type} - ${item.desc}: R$ ${item.amount.toFixed(2)} (Mês: ${item.month + 1}, Registrado em: ${item.timestamp})`)
            .join("\n");
        const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "resumo_transacoes.txt";
        link.click();
    };
}
// Inicializar o sistema
loadItens();
