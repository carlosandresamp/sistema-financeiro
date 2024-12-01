"use strict";
// Seletores de elementos do DOM
const tbody = document.querySelector("tbody");
const descInput = document.querySelector("#desc");
const amountInput = document.querySelector("#amount");
const typeSelect = document.querySelector("#type");
const monthFilter = document.querySelector("#month");
const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");
// Botões
const btnNew = document.querySelector("#btnNew");
const btnLogout = document.querySelector("#btnLogout");
const btnClearAll = document.querySelector("#btnClearAll");
const btnDownloadTxt = document.querySelector("#btnDownloadTxt");
// Variáveis
let items = [];
const loggedUser = sessionStorage.getItem("loggedUser");
// Redireciona para login se não estiver autenticado
if (!loggedUser)
    window.location.href = "login.html";
// Função para carregar dados do localStorage
const loadTransactions = () => JSON.parse(localStorage.getItem(`transactions_${loggedUser}`) || "[]");
// Função para salvar dados no localStorage
const saveTransactions = () => localStorage.setItem(`transactions_${loggedUser}`, JSON.stringify(items));
// Função para atualizar totais (entradas, saídas e saldo)
const updateTotals = (transactions) => {
    const totals = transactions.reduce((acc, { amount, type }) => {
        acc[type === "Entrada" ? "incomes" : "expenses"] += amount;
        return acc;
    }, { incomes: 0, expenses: 0 });
    incomes.textContent = totals.incomes.toFixed(2);
    expenses.textContent = totals.expenses.toFixed(2);
    total.textContent = (totals.incomes - totals.expenses).toFixed(2);
};
// Função para inserir transação na tabela
const insertTransaction = (transaction, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${transaction.desc}</td>
    <td>R$ ${transaction.amount.toFixed(2)}</td>
    <td>${transaction.timestamp}</td>
    <td>${transaction.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'}</td>
    <td><button onclick="deleteTransaction(${index})"><i class="bx bx-trash"></i></button></td>
  `;
    tbody.appendChild(row);
};
// Função para carregar e exibir transações do mês selecionado
const loadTransactionsByMonth = () => {
    const selectedMonth = parseInt(monthFilter.value);
    const filteredItems = items.filter(({ month }) => month === selectedMonth);
    tbody.innerHTML = "";
    filteredItems.forEach(insertTransaction);
    updateTotals(filteredItems);
};
// Adicionar nova transação
btnNew.onclick = () => {
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    if (!desc || isNaN(amount))
        return alert("Preencha todos os campos!");
    const newTransaction = {
        desc,
        amount,
        type,
        month: parseInt(monthFilter.value),
        timestamp: new Date().toLocaleString(),
    };
    items.push(newTransaction);
    saveTransactions();
    loadTransactionsByMonth();
    descInput.value = "";
    amountInput.value = "";
};
// Excluir transação
window.deleteTransaction = (index) => {
    items.splice(index, 1);
    saveTransactions();
    loadTransactionsByMonth();
};
// Baixar resumo do mês selecionado
btnDownloadTxt.onclick = () => {
    const selectedMonth = parseInt(monthFilter.value);
    const filteredItems = items.filter(({ month }) => month === selectedMonth);
    if (filteredItems.length === 0)
        return alert("Nenhuma transação encontrada.");
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const content = `Resumo de ${monthNames[selectedMonth]}:\n` +
        filteredItems.map(({ desc, amount, type, timestamp }) => `${type} - ${desc}: R$ ${amount.toFixed(2)} (${timestamp})`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `resumo_${monthNames[selectedMonth]}.txt`;
    link.click();
};
// Limpar todos os registros
btnClearAll.onclick = () => {
    if (confirm("Realmente deseja apagar todas as transações?")) {
        items = [];
        saveTransactions();
        loadTransactionsByMonth();
    }
};
// Logout
btnLogout.onclick = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
};
// Evento para mudança de mês
monthFilter.onchange = loadTransactionsByMonth;
// Inicializar sistema
items = loadTransactions();
loadTransactionsByMonth();
