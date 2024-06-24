import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { signOutUser } from "../firebase";
import { useNavigate } from "react-router-dom";
export default function App() {
  const navigate = useNavigate(); 
  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };
  return (
    <div className="flex flex-grow h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6236F5] flex flex-col">
        <div className="flex items-center justify-center h-16">
          <p className="font-bold text-white hidden sm:block">
            Queue Management System
          </p>
          <p className="font-bold text-white sm:hidden">QMS</p>
        </div>
        <div className="flex flex-col items-center justify-between flex-grow p-4">
          {/* <p className="text-white">Counter Dashboard</p> */}
          <div className="mt-20 w-64">
          <Button
            as={Link}
            href="#"
            variant="flat"
            onClick={()=>navigate("/adminDash")}
            className={`w-full text-white rounded-none py-2 ${
              location.pathname === '/adminDash' ? 'bg-gray-900' : ''
            }`}
            
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            href="#"
            variant="flat"
            onClick={()=>navigate("/counter")}
            className={`w-full text-white rounded-none py-2 ${
              location.pathname === '/counter' ? 'bg-gray-900' : ''
            }`}
            
          >
            Counter
          </Button>
          <Button
            as={Link}
            href=""
            variant="flat"
            onClick={()=>navigate("/staff")}
            className={`w-full text-white rounded-none py-2 ${
              location.pathname === '/staff' ? 'bg-gray-900' : ''
            }`}
          >
            Staff
          </Button>
          <Button
            as={Link}
            className="w-full text-white rounded-none"
            href="#"
            variant="flat"
            onClick={handleLogout}
          >
            Services
          </Button>
          <Button
            as={Link}
            href=""
            variant="flat"
            onClick={()=>navigate("/ads")}
            className={`w-full text-white rounded-none py-2 ${
              location.pathname === '/ads' ? 'bg-gray-900' : ''
            }`}
          >
            Advertisement
          </Button>
          </div>
          <Button
            as={Link}
            className="w-full mt-4 bg-gray-900 text-white"
            href="#"
            variant="flat"
            onClick={handleLogout}
          >
            Logout
          </Button>
          
        </div>
      </aside>
    </div>
  );
}