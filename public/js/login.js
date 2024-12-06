document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
      const baseURL = `http://${window.config.logRegServiceIp}:${window.config.logRegServicePort}`;
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        //console.log("Status ok received from backend.");
        const data = await response.json();
        //console.log("Logged in successfully:", data);
        localStorage.setItem("token", data.token);
        window.location.href = "../pages/main.html";
      } else {
        alert("Wrong username or password.");
        console.log("Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
