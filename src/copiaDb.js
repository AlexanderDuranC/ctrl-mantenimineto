const mysqldump = require("mysqldump");
const { database } = require("./keys");

// Función para crear una copia de la base de datos
async function copia() {
  await mysqldump({
    connection: database,
    dumpToFile: "./scripts/CopiaDb.sql",
  });
}

module.exports = copia;
