import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import { MdDelete } from 'react-icons/md';
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
            setCounters(prevCounters => prevCounters.filter(item => item.id !== counterId));
        } catch (error) {
            console.error("Error deleting counter: ", error);
        }
    };

    return (
        <>
            <Button onPress={handleOpenModal} >
                    <MdDelete size={15} />
            </Button>
            <Modal isOpen={isOpen} onClose={handleCloseModal} className="font-[Outfit] bg-[#F8F8F9]">
                <ModalContent>
                    <ModalHeader>Reset tokens</ModalHeader>
                    <ModalBody>
                        <Table aria-label="Example static collection table" removeWrapper>
                            <TableHeader>
                                <TableColumn>Sl.no</TableColumn>
                                <TableColumn>Collection ID</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {counters
                                    .filter((counter) => counter.id.startsWith("Counter"))
                                    .map((counter, index) => (
                                        <TableRow key={counter.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{counter.id}</TableCell>
                                            <TableCell>
                                                <Button className="bg-red-500 ml-4" onClick={() => handleDeleteCounter(counter.id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
