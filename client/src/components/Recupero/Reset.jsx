import { useState } from "react";
import React from "react";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  return (
    <div className="cont-search">
      <div className="container-form-forgot">
        <div className="form-information-forgot">
          <div className="form-information-childs">
            <h2>Reiniciar contraseña</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="email">
                <i className="bx bx-lock-alt"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingrese su nueva contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
              <label htmlFor="email">
                <i className="bx bx-lock-alt"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="confirmar contraseña"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  required
                />
              </label>
              <button type="submit" className="btn-forgot">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
