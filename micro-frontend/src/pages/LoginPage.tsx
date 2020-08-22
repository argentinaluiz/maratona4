// @flow
import * as React from "react";
// import * as yup from "../util/yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers";
import { Redirect, useLocation } from "react-router-dom";

import { useKeycloak } from "@react-keycloak/web";
// const validationSchema = yup.object().shape({
//   email: yup.string().label("E-mail").required(),
//   password: yup.string().label("Senha").required(),
// });

export const LoginPage: React.FC = () => {
  const { keycloak } = useKeycloak();
  const location = useLocation();

  //@ts-ignore
  const { from } = location.state || { from: { pathname: "/" } };
  if (keycloak!.authenticated) {
    return <Redirect to={from} />;
  } else {
    keycloak!.login();
    return <div className="login">Carregando...</div>;
  }
  //   const { register, handleSubmit, errors } = useForm({
  //     resolver: yupResolver(validationSchema),
  //   });
  //   return (
  //     <div className="login">
  //       <img src="./img/logo.png" className="logo" alt="Logo Code Slack" />

  //       <div className="container-login">
  //         <h2>Login</h2>
  //         <form className="form-login">
  //           <div className="form-group">
  //             <input
  //               className={"form-control" + (errors.email ? " is-invalid" : "")}
  //               type="email"
  //               name="email"
  //               placeholder="E-mail"
  //               ref={register}
  //             />
  //           </div>
  //           <div className="form-group">
  //             <input
  //               className={"form-control" + (errors.email ? " is-invalid" : "")}
  //               type="password"
  //               name="password"
  //               placeholder="Senha"
  //               ref={register}
  //             />
  //           </div>
  //           <small id="" className="form-text">
  //             <a href="forgot_password.html" title="Registre-se">
  //               Esqueceu senha?
  //             </a>
  //           </small>
  //           <button type="submit" className="btn-code-slack">
  //             Entrar
  //           </button>
  //           <small id="" className="form-text">
  //             Ainda não tem conta?
  //             <a href="register.html" title="Registre-se">
  //               Registre-se
  //             </a>
  //           </small>
  //         </form>
  //       </div>
  //     </div>
  //   );
};
