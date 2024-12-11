const frontendIp = "192.168.1.201"; // IP-адрес фронтенда
const frontendPort = 5500; // Порт фронтенда

const logRegServiceIp = "localhost"; // IP-адрес сервиса логина и регистрации
const logRegServicePort = 8080; // Порт сервиса логина и регистрации

const mainServiceIp = "localhost"; // IP-адрес Main Service
const mainServicePort = 8082; // Порт Main Service

const albumServiceIp = "localhost"; //IP-адрес Album Service
const albumServicePort = 8083; //Порт Album Service

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
    albumServiceIp,
    albumServicePort,
  };
}
