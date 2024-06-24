import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import Navbar from "./Navbar";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import ModalCounter from "./ModalCounter";
import EditToken from "./EditToken";
import ManageCounterModal from "./ManageCounterModal"; // Import the ManageCounterModal component
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import React from "react";
const Staff = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  if (user === undefined) {
    navigate("/login");
  } else {
    const email = user?.email ?? undefined
    if (email !== "admin@tecnavis.com") {
      navigate("/login");
    }
  }
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null); // State to manage selected counter data

  

  const isValidUserData = (user) => {
    return (
      user.name &&
      user.date &&
      user.phone &&
      user.service &&
      user.counter &&
      user.token
    );
  };

  const handleAddCounter = () => {
    setShowModal(true);
  };

  const handleManageCounter = (counter) => {
    setSelectedCounter(counter);
  };

  const handleCloseModal = () => {
    setSelectedCounter(null);
  };

  return (
    <div className=" flex min-h-screen">
      <div className="fixed h-full">
        <Navbar />
      </div>
      <div className="flex flex-col flex-1 ml-64">
      <div className="flex justify-end mt-4 mr-[100px]">
        <div className="w-[300px]">
      <Input
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <FaSearch />
        }
      />
      </div>
    </div>
    <div className="lg:mx-24 flex justify-start flex-wrap gap-1">
      <div className="flex items-center justify-start gap-1 w-full py-6">
          <div className="flex flex-col items-center gap-1">
            <ModalCounter />
          </div>
          <div className="w-[340px] h-[240px] px-8 rounded-2xl flex justify-center items-center bg-[#9075e9] ml-[150px]">
            <div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-4 mb-4 mt-4">
                <Input type="text" label="Employee Name" className="w-[150px] h-[30px]"/>
                <Input type="email" label="Email" className="w-[150px] h-[30px]"/>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-4 mb-4">
                <Input type="text" label="Set User Id" className="w-[150px] h-[30px]"/>
                <Input type="text" label="Select Service" className="w-[150px] h-[30px]"/>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-10 pb-4">
            {/* <div className=" md:w-1/2"> */}
                <Input type="password" label="Set Password" className="w-[150px] h-[30px]"/>
                <Button className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3 h-[30px]">
                Save
            </Button>
             {/* </div> */}
            <div >
                
            
            </div> 
            </div>
            </div>

        </div>
        </div>
        <div className="flex flex-col justify-center py-5 gap-4 w-full">
          <div className="flex justify-between items-center w-full">
          <div className="font-semibold md:text-xl">
          <h2 >Active Counters</h2>
          </div>
          <div className="justify-end">
          <Button color="primary" className="w-[120px] bg-[#6236F5]" onClick={handleCloseModal}>
              Filter
            </Button>
          </div>
          </div>
          {userData.length === 0 ? (
            <p>No valid data available</p>
          ) : (
            <Table aria-label="Example static collection table" removeWrapper>
              <TableHeader>
                <TableColumn>Sl. no.</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Phone</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Reason for Visit</TableColumn>
                <TableColumn className="w-1/6">Counter</TableColumn>
              </TableHeader>
              <TableBody>
                {userData.map((user, index) => (
                  <TableRow>
                    <TableCell children={undefined}></TableCell>
                    <TableCell children={undefined}></TableCell>
                    <TableCell children={undefined}></TableCell>
                    <TableCell children={undefined}></TableCell>
                    <TableCell children={undefined}></TableCell>
                    <TableCell children={undefined}></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {/* {selectedCounter && (
        <ManageCounterModal
          isOpen={true} // Always open when a counter is selected
          onClose={handleCloseModal}
          counterData={selectedCounter}
        />
      )} */}
    </div>
    </div>
  );
};

export default Staff;


