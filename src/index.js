require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
const handlebars = require("handlebars");

// Iniciaciones
const app = express();
require("./database");

// Configuración
handlebars.registerHelper("ifCond", function (valor) {
  return valor === "Si";
});
app.set("port", process.env.PORT || 7777);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "mantenimientoSecreto",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());

// Global variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.errors = req.flash("errors");
  next();
});

// Routes
app.use(require("./routes/"));
app.use("/equipos", require("./routes/equipos"));
app.use("/mantenimiento/equipos", require("./routes/mequipos"));
app.use("/mantenimiento/elementos", require("./routes/melementos"));

// Public
app.use(express.static(path.join(__dirname, "public")));

// Starting server
app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
