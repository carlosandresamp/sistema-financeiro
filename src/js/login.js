"use strict";
// Lista de usuários cadastrados
const users = [
    { username: "teste", password: "770077" },
    { username: "Carlos", password: "770077" },
];
// Seletores de elementos do DOM
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error");
// Função para autenticar usuário
const authenticateUser = (username, password) => users.some((user) => user.username === username && user.password === password);
// Função para inicializar dados de transações no localStorage
const initializeUserTransactions = (username) => {
    if (!localStorage.getItem(`transactions_${username}`)) {
        localStorage.setItem(`transactions_${username}`, JSON.stringify([]));
    }
};
// Exibir mensagem de erro
const displayError = (message) => {
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
};
// Evento de envio do formulário
loginForm.onsubmit = (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (authenticateUser(username, password)) {
        // Armazenar informações de login na sessão
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loggedUser", username);
        // Garantir que o usuário tenha um espaço inicial para transações
        initializeUserTransactions(username);
        // Redirecionar para a página principal
        window.location.href = "index.html";
    }
    else {
        displayError("Usuário ou senha inválidos!");
    }
};
