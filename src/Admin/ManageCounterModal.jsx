import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { MdEdit } from 'react-icons/md';


export default function ManageCounterModal({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "counter"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCounters(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const unsubscribe = onSnapshot(collection(db, "counter"), (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCounters(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDeleteCounter = async (counterId) => {
    try {
      console.log("CounterId:", counterId);

      // Construct a reference to the specific document using the counter's id
      const counterRef = doc(db, "counter", counterId);

      // Delete the document from the Firestore database
      await deleteDoc(counterRef);
      console.log("Counter deleted successfully from the database");

      // Update the UI by removing the deleted document from the counters array
      setCounters((prevCounters) => prevCounters.filter((item) => item.id !== counterId));
    } catch (error) {
      console.error("Error deleting counter: ", error);
    }
  };

  const handleEditCounter = (counterId) => {
    // Add your logic for editing counter here
    console.log("Editing counter with id:", counterId);
  };

  return (
    <>
      <Button onPress={handleOpenModal}  >
         <MdEdit size={15} />
      </Button>
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="bg-[#F8F8F9] font-[Outfit]">
        <ModalContent>
          <ModalHeader>Manage Counters</ModalHeader>
          <ModalBody>
            <Table aria-label="Example static collection table" removeWrapper>
              <TableHeader>
                <TableColumn>Sl.no</TableColumn>
                <TableColumn>Counter Name</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {counters.filter((counter) => counter.counterName).map((counter, index) => (
                  <TableRow key={counter.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{counter.counterName}</TableCell>
                    <TableCell>
                      <div className="flex gap-5">
                      <Button color="secondary" onClick={() => handleEditCounter(counter.id)}>Edit</Button>
                      <Button
                        color="danger"
                        onClick={() => handleDeleteCounter(counter.id)}
                      >
                        Delete
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" className="w-full" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
