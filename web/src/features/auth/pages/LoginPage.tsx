import axios from "axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: any) => {
    e.preventDefault();


    let loginData = {
      email,
      pass,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/login`,
        loginData
      );

      await localStorage.setItem("token", response.data.token);
      await navigate("/dashboard");
    } catch (error) {}
  };

  return (
    <main className="w-full h-screen bg-custom-dark font-display flex items-center justify-center">
      <form className="text-text-dark w-max flex flex-col gap-11">
        <div className="flex flex-col ">
          <span className="text-custom-gray">Mente de Anne Matos</span>
          <h1 className="text-4xl font-extrabold">Acesse sua conta, Anne</h1>
        </div>
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="flex flex-col">
            <span className="text-custom-gray">E-mail</span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-[300px] rounded-[5px] border-[0.1px] border-zinc-400 bg-zinc-100 outline-none focus:border-purple-500"
              type="text"
              required
            />
          </div>

          <div className="flex flex-col ">
            <span className="text-zinc-500">Senha</span>
            <input
              onChange={(e) => setPass(e.target.value)}
              className="p-3 w-[300px] rounded-[5px] border-[0.1px] border-zinc-400 bg-zinc-100 outline-none focus:border-purple-500"
              type="text"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            className="p-3 w-[300px] rounded-[5px] h-[50px] bg-purple-500 text-white text-center font-bold "
          >
            Entrar
          </button>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
