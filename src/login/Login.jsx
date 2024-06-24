import { useState } from "react";
import Navbar from "./Navbar";
import { signIn } from "../firebase";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loggedInAs, setLoggedInAs] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const role = await signIn(email, password);
      if (role === "admin") {
        setLoggedInAs("admin");
        navigate("/adminDash"); // Navigate after setting the state
      } else if (role === "counter") {
        setLoggedInAs("counter");
        navigate("/counterDash"); // Navigate after setting the state
      } else {
        setError("Unauthorized access");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh min-w-screen">
      <Navbar />
      <div className="md:mx-64 mx-2 md:py-10 py-5 flex flex-1 items-center justify-center">
        <Card className="p-2 md:p-5 md:min-w-96 min-w-[75vw]">
          <CardHeader className="justify-center">
            <h2 className="font-semibold">Please Login Here</h2>
          </CardHeader>
          <form action="post" onSubmit={handleLogin}>
            <CardBody className="gap-5">
              <Input
                type="email"
                label="Email"
                value={email}
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                required
                variant='bordered'
              />
              <Input
                type="password"
                label="Password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                variant='bordered'
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <Button className="bg-[#6236F5] text-white" type="submit">Submit</Button>
            </CardBody>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
