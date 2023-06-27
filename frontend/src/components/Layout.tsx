import { MdOutlineLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export default function Layout({ children }: HeaderProps) {
  const auth = useAuth();

  function logout() {
    auth.logout();
  }

  return (
    <div>
      <div className="bg-[#254A75] h-[5rem] text-white flex items-center px-4 justify-between w-full">
        <span className="text-lg">FullStack Afiliados</span>
        <button onClick={logout} title="Sair">
          <MdOutlineLogout size={25} />
        </button>
      </div>
      {children}
    </div>
  );
}
