import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
  } from "@nextui-org/react";
  
  export default function App() {
    return (
      <Navbar position="sticky">
        <NavbarContent>
        <NavbarBrand>
            <p className="font-bold text-inherit sm:hidden">QMS</p>
            <p className="font-bold text-inherit hidden sm:block">
              Queue Management System
            </p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
          </NavbarItem>
          <NavbarItem>
          <Button
            as={Link}
            className="bg-[#6236F5] text-white"
            href="/"
            variant="flat">
              Home
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  }
  