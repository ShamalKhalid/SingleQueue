import { Button, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import landingComp from '../assets/landingComp.png'  

const LandingContent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex lg:mx-24 mx-10">
      <div className="md:w-[50%] flex flex-col justify-center">
        <h3 className="text-5xl">Manage Your</h3>
        <h1 className="text-6xl font-bold">Queues Perfectly</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
          dolores?
        </p>
        <div className="flex gap-10">
        <Button
          className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3"
          onClick={() => navigate("/userForm")}
        >
          Book your slot
        </Button>
        <Button
          className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3"
          onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <img src={landingComp} className="absolute lg:top-16 top-48" alt="" />
      </div>
    </div>
  );
};

export default LandingContent;
