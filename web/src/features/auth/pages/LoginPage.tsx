import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Coruja from "../../../assets/coruja.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    let loginData = { email, pass };

    try {
      const response = await axios.post(`${apiUrl}/login`, loginData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#E8EBF0] relative overflow-hidden">
      {/* Fundo decorativo suave */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10">
        <img src={Coruja} alt="Coruja pedagoga" className="w-[600px]" />
      </div>

      {/* Cartão de Login */}
      <form
        onSubmit={handleLogin}
        className="relative bg-white rounded-2xl shadow-lg p-10 flex flex-col gap-8 w-[380px] z-10 border border-[#E0E3EB]"
      >
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <img src={Coruja} alt="Coruja" className="w-[130px] mb-2" />
          <h1 className="text-2xl font-bold text-blue">
            Bem-vindo de volta!
          </h1>
          <span className="text-[#6B7280] text-sm">
            Acesse sua conta de aprendizado 🦉
          </span>
        </div>

        {/* Campos de entrada */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-[#6B7280]">E-mail</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-3 rounded-lg border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-blue"
              // type="email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#6B7280]">Senha</label>
            <input
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              className="p-3 rounded-lg border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-blue"
              type="password"
              required
            />
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="p-3 rounded-lg bg-blue text-white font-semibold hover:bg-[#3C5C8A] transition-all shadow-md"
        >
          Entrar
        </button>

        {/* Rodapé do formulário */}
        <div className="text-center text-sm text-gray-500">
          Esqueceu a senha?{" "}
          <a href="#" className="text-blue hover:underline">
            Recuperar
          </a>
        </div>
      </form>

      {/* Coruja decorativa lateral */}
      <img
        src={Coruja}
        alt="Coruja pedagoga"
        className="absolute bottom-0 left-0 w-[300px] opacity-70 animate-bounce-slow"
      />
    </main>
  );
}

export default LoginPage;
