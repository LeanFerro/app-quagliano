const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const mailerRoutes = require("./routes/mailer");
const userRoutes = require("./routes/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world :)!!");
});

// RUTAS
app.post("/", authRoutes);
app.get("/", authRoutes);
app.use("/", authRoutes);

// MAILER
app.post("/password-recovery", mailerRoutes);
app.post("/reset-password", mailerRoutes);

//USER
app.get("/marcas", userRoutes);

//DATABASE
app.listen(8080, () => {
  console.log("server listening on port 8080");
});
