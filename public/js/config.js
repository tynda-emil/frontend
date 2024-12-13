const frontendIp = "localhost"; // IP-адрес фронтенда
const frontendPort = 5500; // Порт фронтенда

const logRegServiceIp = "localhost"; // IP-адрес сервиса логина и регистрации
const logRegServicePort = 8080; // Порт сервиса логина и регистрации

const mainServiceIp = "localhost"; // IP-адрес Main Service
const mainServicePort = 8082; // Порт Main Service

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    frontendIp,
    frontendPort,
    logRegServiceIp,
    logRegServicePort,
    mainServiceIp,
    mainServicePort,
  };
} else {
  window.config = {
    frontendIp,
    frontendPort,
    logRegServiceIp,
    logRegServicePort,
    mainServiceIp,
    mainServicePort,
  };
}
