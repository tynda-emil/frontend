document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
      const baseURL = "http://192.168.1.201:8080"; //здесь нужно поменять IP адрес и порт на адрес на котором запущен микросервис логина и регистрации
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Status ok received from backend");
        const data = await response.json();
        console.log("Logged in successfully:", data);
        localStorage.setItem("token", data.token);
        window.location.href = "../pages/main.html";
      } else {
        alert("Login failed");
        console.log("Ne ok....");
      }
    } catch (error) {
      console.log("ОШИБКА!!!");
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
