const dbconnection = require("../database/database");

function getClientes(req, res) {
  dbconnection.query("SELECT * FROM CLIENTES", (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
}
function getMarcas(req, res) {
  const nombreCliente = req.query.nombreCliente;
  const sqlQuery = `
      SELECT marcas.* 
      FROM marcas 
      INNER JOIN marcas_clientes ON marcas.id_marca = marcas_clientes.id_marca 
      INNER JOIN clientes ON marcas_clientes.id_cliente = clientes.id_cliente 
      WHERE clientes.cliente = ?
    `;
  dbconnection.query(sqlQuery, [nombreCliente], (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
}

module.exports = {
  getClientes,
  getMarcas,
};
