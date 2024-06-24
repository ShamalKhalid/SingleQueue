import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const EditCounterModal = ({ isOpen, onClose, counter, setCounters }) => {
  const [editedCounterData, setEditedCounterData] = useState({ ...counter });

  const handleEditCounter = async () => {
    try {
      await updateDoc(collection(db, "counter"), counter.id, editedCounterData);
      setCounters((prevCounters) =>
        prevCounters.map((c) => (c.id === counter.id ? { ...c, ...editedCounterData } : c))
      );
      onClose();
    } catch (error) {
      console.error("Error editing counter: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCounterData({ ...editedCounterData, [name]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Counter</ModalHeader>
        <ModalBody>
          <Input type="text" label="Counter Name" name="counterName" value={editedCounterData.counterName} onChange={handleInputChange} />
          <Input type="email" label="Email" name="email" value={editedCounterData.email} onChange={handleInputChange} />
          <Input type="password" label="Password" name="password" value={editedCounterData.password} onChange={handleInputChange} />
          <Select label="Select your Reason to be here" name="service" value={editedCounterData.service} onChange={handleInputChange} required>
            <SelectItem className="font-[Outfit]" value="Personal Service (Income, Community, Nativity, etc)">Personal Service (Income, Community, Nativity, etc)</SelectItem>
            <SelectItem className="font-[Outfit]" value="Home related Service">Home related Service</SelectItem>
            <SelectItem className="font-[Outfit]" value="Land Related Service">Land Related Service</SelectItem>
            <SelectItem className="font-[Outfit]" value="Education Related Service">Education Related Service</SelectItem>
            <SelectItem className="font-[Outfit]" value="Other Services">Other Services</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleEditCounter}>Save Changes</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCounterModal;
