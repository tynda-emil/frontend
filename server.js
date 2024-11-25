const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});
const localIp = "192.168.1.201"; //здесь должен быть ip адрес компьютера на котором запускается сервер с фронтом
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://${localIp}:${PORT}`);
});
