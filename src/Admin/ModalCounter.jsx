//modalCounter

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
  } from "@nextui-org/react";
  import { useState } from "react";
  import { v4 as uuidv4 } from "uuid";
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "../firebase";
  import { hash } from "bcryptjs";
  
  export default function App() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const services = [
      "Personal Service (Income, Community, Nativity, etc)",
      "Home related Service",
      "Land Related Service",
      "Education Related Service",
      "Other Services",
    ];
  
    const [counterName, setCounterName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [service, setService] = useState("");
  
    const handleSubmit = async () => {
      try {
        // Generate a unique ID for the entry
        const id = uuidv4();
  
        // Hash the password
        const hashedPassword = await hash(password, 10);
        console.log(id, counterName, email, hashedPassword, service);
        // Add the data to the 'counter' collection in Firestore
        await addDoc(collection(db, "counter"), {
          id,
          counterName,
          email,
          password: hashedPassword,
          service,
        });
  
        // Clear form fields after submission
        setCounterName("");
        setEmail("");
        setPassword("");
        setService("");
  
        // Close the modal
        onClose();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    };
  
    const handleServiceChange = (event) => {
      setService(event.target.value);
    };
  
    return (
      <>
        <Button onPress={onOpen} className="bg-[#6236F5] text-white">
          + Add Counter
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} className="bg-[#F8F8F9] font-[Outfit]">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Add Counter</ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Counter Name"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                variant="bordered"
              />
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
              />
              <Select
                label="Select your Reason to be here"
                onChange={handleServiceChange}
                required
                variant="bordered"
              >
                {services.map((item) => (
                  <SelectItem className="font-[Outfit]" value={item} key={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose} className="w-full">
                Close
              </Button>
              <Button color="primary" onPress={handleSubmit} className="w-full">
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  