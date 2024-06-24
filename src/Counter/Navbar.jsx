import React from "react";
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
    navigate("/")
  }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6236F5]">
        <div className="flex items-center justify-center h-16">
          <p className="font-bold text-white hidden sm:block">
            Queue Management System
          </p>
          <p className="font-bold text-white sm:hidden">QMS</p>
        </div>
        <div className="flex flex-col items-center justify-between flex-1 p-4">
          <p className="text-white">Counter Dashboard</p>
          <Button
            as={Link}
            className="w-full mt-4 bg-gray-900 text-white mt-[470px]"
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
