//navbar login

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";

export default function App() {
  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand className="!justify-center">
          <p className="font-bold text-inherit">Queue Management System</p>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
}
