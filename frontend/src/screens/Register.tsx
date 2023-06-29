import { useState } from "react";
import UserForm from "../components/UserForm";
import { axiosInstance } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [registrationCredentials, setRegistrationCredentials] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit() {
    try {
      await axiosInstance.post("register", {
        ...registrationCredentials,
      });

      alert("Usuário criado com sucesso");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      // errors were shown using builtin alert
      alert(error.response?.data.detail);
    }
  }

  return (
    <div className="flex w-full h-[100vh] justify-center items-center bg-[#f1f1f1]">
      <div className="w-fit h-[20rem] shadow-lg rounded-lg flex justify-center items-center bg-white">
        <div>
          <UserForm
            title="Registro"
            credentials={registrationCredentials}
            setCredentials={setRegistrationCredentials}
          />
          <footer className="px-8 w-full flex flex-col items-center justify-center gap-4">
            <button
              data-testid="register-button"
              onClick={handleSubmit}
              className="h-[40px] w-[250px] bg-blue-600 hover:bg-blue-500 active:bg-blue-800 rounded-lg text-white font-bold"
            >
              Registrar
            </button>
            <Link to="/login">
              <span className="italic">Fazer Login</span>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
