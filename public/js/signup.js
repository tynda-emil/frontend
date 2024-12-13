document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector(
      'input[placeholder="username"]',
    ).value;
    const email = document.querySelector('input[placeholder="email"]').value;
    const password = document.querySelector(
      'input[placeholder="password"]',
    ).value;

    try {
      const baseURL = `http://${window.config.logRegServiceIp}:${window.config.logRegServicePort}`;
      const response = await fetch(`${baseURL}/auth/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        //alert("Registration successful! You can now log in.");
        window.location.href = "login.html"; // Переход на страницу логина после успешного логина
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
