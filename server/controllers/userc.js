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
      INNER JOIN clientes_marcas ON marcas.id_marca = clientes_marcas.id_marca 
      INNER JOIN clientes ON clientes_marcas.id_cliente = clientes.id_cliente 
      WHERE clientes.nombre = ?
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
