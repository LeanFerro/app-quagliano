import axios from "axios";

const URL = process.env.REACT_APP_API;

const getMarcas = async (nombreCliente) => {
  return await axios
    .get(`${URL}/marcas?nombreCliente=${nombreCliente}`)
    .then((res) => res.data);
};

const sendPasswordRecoveryRequest = async (email) => {
  return await axios
    .post(`${URL}/password-recovery`, { email })
    .then((res) => res.data);
};

const sendResetPassword = async (correo, token, newPassword) => {
  return await axios
    .post(`${URL}/reset-password`, { correo, token, newPassword })
    .then((res) => res.data);
};

const login = async (cuit, password) => {
  return axios.post(`${URL}/login`, { cuit, password }).then((res) => res.data);
};

const verificarCuit = async (cuit) => {
  return axios
    .get(`${URL}/verificar-cuit?cuit=${cuit}`)
    .then((res) => res.data);
};

const signup = async (idCliente, password, correo, cuit) => {
  return axios
    .post(`${URL}/signup`, { idCliente, password, correo, cuit })
    .then((res) => res.data);
};
export {
  getMarcas,
  sendPasswordRecoveryRequest,
  sendResetPassword,
  login,
  verificarCuit,
  signup,
};
