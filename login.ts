// Simulação de usuários cadastrados
type User = {
    username: string;
    password: string;
  };
  
  const users: User[] = [
    { username: "rotapiripiri", password: "770077" },
    { username: "Carlos", password: "770077" },
  ];
  
  // Seleção de elementos HTML
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const errorMessage = document.getElementById("error") as HTMLElement;
  
  // Evento de envio do formulário
  loginForm.onsubmit = (event: Event): void => {
    event.preventDefault();
  
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
  
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
  
    if (user) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("loggedUser", username);
  
      // Inicializar dados de transações no localStorage se ainda não existir
      if (!localStorage.getItem(`transactions_${username}`)) {
        localStorage.setItem(`transactions_${username}`, JSON.stringify([]));
      }
  
      window.location.href = "index.html";
    } else {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Usuário ou senha inválidos!";
    }
  };  