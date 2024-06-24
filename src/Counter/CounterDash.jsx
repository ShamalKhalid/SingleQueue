import { useState, useEffect } from "react";
import {
  Checkbox,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import Navbar from "./Navbar";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  setDoc,
  limit,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

const CounterDash = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [userData, setUserData] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [nextTokenIndex, setNextTokenIndex] = useState(null); // Initialize to null
  const [isServiceStarted, setIsServiceStarted] = useState(false); // Initialize to false
  const [nowServingToken, setNowServingToken] = useState("");
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  const [singleCounterData, setSingleCounterData] = useState([]);
  const [lastTokenNumber, setLastTokenNumber] = useState(0);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const singleRequestsQuery = query(collection(db, "single requests"), orderBy("token", "asc"));
        const singleCounterQuery = query(collection(db, "single counter"), orderBy("token", "asc"));

        // Fetch both collections simultaneously
        const [singleRequestsSnapshot, singleCounterSnapshot] = await Promise.all([
          getDocs(singleRequestsQuery),
          getDocs(singleCounterQuery)
        ]);

        // Process single requests data
        const requestsData = singleRequestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSingleCounterData(requestsData);
        if (requestsData.length > 0) {
          setNowServingToken(requestsData[0].token);
        }

        // Process single counter data
        const counterData = singleCounterSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (counterData.length > 0) {
          const lastToken = Math.max(...counterData.map(d => d.token));
          setLastTokenNumber(lastToken);
        }

      } catch (error) {
        console.error("Error fetching initial data: ", error);
      }
    };

    fetchInitialData();
  }, [db]);
  


  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
  
      const email = user.email;
      const counterName = email.split("@")[0];
      const counterNumber = parseInt(counterName.replace("counter", ""));
  
      if (isNaN(counterNumber) || counterNumber < 1 || counterNumber > 5) {
        navigate("/login");
        return;
      }
  
      const fetchData = async () => {
        try {
          // Fetch data from 'single counter' collection
          const singleCounterSnapshot = await getDocs(collection(db, 'single requests'));
          const data = singleCounterSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserData(data.filter(isValidUserData)); // Filter out invalid data
  
          // Fetch total number of customers in "single counter" collection
          setTotalCustomerCount(singleCounterSnapshot.size);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
  
      fetchData();
  
      const unsubscribe = onSnapshot(
        collection(db, `Counter ${counterNumber}`),
        snapshot => {
          const updatedData = snapshot.docs.map(doc => doc.data());
          const orderedData = updatedData.sort((a, b) => b.date - a.date);
          const reversedData = orderedData.reverse();
          setUserData(reversedData.filter(isValidUserData)); // Filter out invalid data
        }
      );
  
  
      return () => unsubscribe(); // Unsubscribe when component unmounts
    };
  
    checkUser();
  }, [user]);
  useEffect(() => {
    fetchPendingCount();
  }, []); 


  const isValidUserData = (user) => {
    return (
      user.name &&
      user.phone &&
      user.date &&
      user.service &&
      user.token
    );
  };
  
  const fetchPendingCount = async () => {
    try {
      const pendingSnapshot = await getDocs(collection(db, "single pending"));
      setPendingCount(pendingSnapshot.size);
    } catch (error) {
      console.error("Error fetching pending count: ", error);
    }
  }; 
  

  const handlePendingButtonClick = async () => {
    try {
      // Fetch the first data's token number from the "single requests" collection
      const singleRequestsRef = collection(db, 'single requests');
      const querySnapshot = await getDocs(query(singleRequestsRef, orderBy("token", "asc"), limit(1)));
  
      console.log("Query Snapshot size:", querySnapshot.size); // Log the size of the query snapshot
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const token = doc.data().token;
  
        console.log("Document found with token:", token); // Log the token of the found document
  
        // Move the data to the "single pending" collection
        const singlePendingRef = collection(db, 'single pending');
        await addDoc(singlePendingRef, doc.data());
        await deleteDoc(doc.ref);
        console.log(`Data with token ${token} moved to 'single pending' and deleted from 'single requests'.`);
  
        // Fetch the count of documents in the "single pending" collection
        const pendingCounterSnapshot = await getDocs(singlePendingRef);
        const pendingCounter = pendingCounterSnapshot.size;
  
        // Fetch the next token data from the "single requests" collection
        const updatedDataSnapshot = await getDocs(query(singleRequestsRef, orderBy("token", "asc"), limit(1)));
        const nextTokenData = updatedDataSnapshot.docs[0]?.data() || {}; // Get the data of the next token or an empty object if undefined
        const nextToken = nextTokenData.token || ''; // Get the token from the data or set to empty string if undefined
  
        // Update the state variables after ensuring the deletion has been completed
        setNowServingToken(nextToken);
        setNextTokenIndex(nextTokenIndex + 1);
        setPendingCount(pendingCounter);
  
        console.log("Updated pending counter:", pendingCounter);
      } else {
        console.warn("No data found in 'single requests'.");
      }
    } catch (error) {
      console.error("Error handling pending button click: ", error);
    }
  };
  
  
  


  const handleRecallButtonClick = async () => {
    try {
      console.log('Starting recall process...');
      const pendingCollectionName = `single pending`;
  
      // Query the "single pending" collection, order by token number in ascending order, and limit to 1 document
      const querySnapshot = await getDocs(
        query(collection(db, pendingCollectionName), orderBy("token", "asc"), limit(1))
      );
      
      console.log("Query executed.");
  
      if (!querySnapshot.empty) {
        // Get the data of the first document
        const userData = querySnapshot.docs[0].data();
  
        // Convert the timestamp to a Date object
        userData.date = userData.date.toDate();
  
        // Insert the entire document data into the "single requests" collection
        await addDoc(collection(db, "single requests"), userData);
  
        // Delete the first document from the "single pending" collection
        await deleteDoc(querySnapshot.docs[0].ref);
  
        // Update pending count after recalling
        // await fetchPendingCount();
  
        // Update nowServingToken and singleCounterData
        const updatedSingleRequestsSnapshot = await getDocs(collection(db, "single requests"));
        const updatedSingleCounterData = updatedSingleRequestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Update state variables
        setNowServingToken(userData.token);
        setTotalCustomerCount(updatedSingleRequestsSnapshot.size+1);
        setPendingCount(prevCount => prevCount - 1);
        setSingleCounterData(updatedSingleCounterData);
        
  
        console.log("Token recalled successfully.");
      } else {
        console.warn("No pending records found to recall.");
      }
    } catch (error) {
      console.error("Error recalling token: ", error);
    }
  };
  

  const handleCallButtonClick = async () => {
    const email = user.email;
    const counterNumber = parseInt(
      email.split("@")[0].replace("counter", "")
    );
    try {
      // Check if there is a token currently being served
      if (nowServingToken && nowServingToken !== '-') {
        console.log(`Calling token ${nowServingToken}`);
        // Update the currently serving token in the database
        const tokenData = {
          token: nowServingToken
        };
        await updateCurrentlyServing(tokenData);
        const message = `${nowServingToken} PLEASE PROCEED TO COUNTER${counterNumber}`;
        console.log(tokenData)
        speak(message)
        const singleRequestsRef = collection(db, 'single requests');
        const querySnapshot = await getDocs(query(singleRequestsRef, where("token", "==", nowServingToken), limit(1)));

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          // Delete the document from the "single requests" collection
          await deleteDoc(doc.ref);
          console.log(`Data with token ${nowServingToken} deleted from 'single requests'.`);
        } else {
          console.warn(`No document found in 'single requests' with token ${nowServingToken}.`);
        }
        await storeNextTokenData(userData[nextTokenIndex]);
      } else {
        console.log("No more tokens in queue");
      }
    } catch (error) {
      console.error("Error calling token: ", error);
    }
  };

  const speak = (message) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }


  const updateCurrentlyServing = async (tokenData) => {
    try {
      const email = user.email;
      const counterNumber = parseInt(
        email.split("@")[0].replace("counter", "")
      );
      const servingCollectionName = `single CurrentlyServingCounter`;

      // Get the current serving document
      const querySnapshot = await getDocs(collection(db, servingCollectionName));
      if (!querySnapshot.empty) {
        // If document exists, update it
        const docId = querySnapshot.docs[0].id;
        await setDoc(doc(collection(db, servingCollectionName), docId), tokenData);
      } else {
        // If document doesn't exist, create a new one
        await setDoc(doc(collection(db, servingCollectionName)), tokenData);
      }
      console.log("Currently serving token updated successfully.");
    } catch (error) {
      console.error("Error updating currently serving token: ", error);
    }
  };
  
  const storeNextTokenData = async (tokenData) => {
    try {
      const nextTokenCollectionName = `single nextTokenCounter`;
  
      // Reference to the next token collection
      const nextTokenCollectionRef = collection(db, nextTokenCollectionName);
  
      if (tokenData === '-' || !tokenData) {
        // If the token data is '-' or undefined, delete the document from the collection
        const querySnapshot = await getDocs(nextTokenCollectionRef);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        // Otherwise, store the new token data in the database
        // Check if a document already exists in the collection
        const querySnapshot = await getDocs(nextTokenCollectionRef);
        if (!querySnapshot.empty) {
          // If a document exists, update it with the new token data
          const docId = querySnapshot.docs[0].id;
          await setDoc(doc(nextTokenCollectionRef, docId), { token: tokenData.token });
        } else {
          // If no document exists, create a new one with the token data
          await setDoc(doc(nextTokenCollectionRef), { token: tokenData.token });
        }
      }
  
      console.log("Next token data stored successfully.");
    } catch (error) {
      console.error("Error storing next token data: ", error);
    }
  };
  

  const handleSaveButtonClick = async () => {
  try {
    if (nowServingToken && nowServingToken !== '') {
      const singleRequestsRef = collection(db, 'single requests');
      
      // Find the document with the current token
      const querySnapshot = await getDocs(query(singleRequestsRef, where('token', '==', nowServingToken)));
      
      if (!querySnapshot.empty) {
        // Delete the current token document
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log(`Data with token ${nowServingToken} deleted from 'single requests'.`);
        });

        // Fetch the next token from "single requests" collection
        const nextTokenSnapshot = await getDocs(query(singleRequestsRef, orderBy("token", "asc"), limit(1)));
        const nextTokenData = nextTokenSnapshot.docs[0]?.data() || {};
        const nextToken = nextTokenData.token || '';

        // Update state using functional form of setState
        setSingleCounterData(prevData => prevData.filter(item => item.token !== nowServingToken));
        setNowServingToken(nextToken);
        setTotalCustomerCount(prevCount => prevCount - 1);
        setNextTokenIndex(prevIndex => prevIndex + 1);

        console.log("Next token is now serving:", nextToken);
      } else {
        console.warn(`No data found with token ${nowServingToken} in 'single requests'.`);
      }
    } else {
      console.log("No token currently being served.");
    }
  } catch (error) {
    console.error("Error handling completed: ", error);
  }
};

  
  

  const callSpecificToken = async (specialtoken) => {
    try {
      // Set the nowServingToken state to the provided token number
      setNowServingToken(specialtoken);
  
      
        const updatedDataSnapshot = await getDocs(collection(db, 'single requests'));
          const updatedData = updatedDataSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // setTotalCustomerCount((updatedDataSnapshot.size)+1)
          // Update the singleCounterData state with the updated data
          setSingleCounterData(updatedData);
        console.log(`Document with token ${specialtoken} served and deleted from 'single requests'.`);
      // }
    } catch (error) {
      console.log('Error in calling specific token:', error);
    }
  };
  

  const getCurrentDate = () => {
    const dateObj = new Date();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  };
  
  useEffect(() => {
    const startServiceAutomatically = async () => {
      setIsServiceStarted(true); // Start the service automatically
      try {
        // Fetch and sort the "single requests" collection by token number in ascending order
        const querySnapshot = await getDocs(
          query(collection(db, "single requests"), orderBy("token", "asc"))
        );
  
        // Extract the sorted user data
        const sortedUserData = querySnapshot.docs.map(doc => doc.data());
        if (sortedUserData.length > 0) {
          setUserData(sortedUserData);
          const nowServingToken = sortedUserData[0].token;
          console.log(`Now serving token is ${nowServingToken}`);
        } else {
          console.log("No tokens found in single requests collection.");
          return;
        }
  
        if (sortedUserData.length > nextTokenIndex || nextTokenIndex === null) {
          // Check if the previous token has been served
          if (nextTokenIndex === null || nextTokenIndex === 0 || sortedUserData[nextTokenIndex - 1].visited) {
            const newNextTokenIndex = nextTokenIndex === null ? 0 : nextTokenIndex;
            setNextTokenIndex(newNextTokenIndex + 1);
            console.log(`Next token is ${sortedUserData[newNextTokenIndex].token}`);
            
            // Update the currently serving token in the database
            const tokenData = {
              token: sortedUserData[newNextTokenIndex].token
            };
            await updateCurrentlyServing(tokenData);
            await storeNextTokenData(sortedUserData[newNextTokenIndex]);
          } else {
            console.log("Previous token has not been served yet.");
          }
        } else {
          console.log("No more tokens in queue");
        }
      } catch (error) {
        console.error("Error starting service automatically: ", error);
      }
    };
  
    startServiceAutomatically(); // Call the function to start the service automatically
  }, [userData, nextTokenIndex]);
  

  useEffect(() => {
    setCurrentDate(getCurrentDate());
  }, [user, completedCount]);
  
  

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 bottom-0">
        <Navbar />
      </div>
      <div className="flex-1 ml-60">
        <div className="flex flex-1 justify-center flex-wrap lg:mx-24">
        <div>
        <div className="mb-4 mt-4 mr-24">
            <h1>Date : {currentDate} </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 mt-6 mr-4">
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 className="font-bold text-large">Total Customer</h3>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
              <p className="text-6xl font-bold ml-12 mt-4">{lastTokenNumber}</p>
              </CardBody>
            </Card>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <h3 className="font-bold text-large">Remaining</h3>
               
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                  <p className="text-6xl font-bold ml-12 mt-4">{totalCustomerCount}</p>
              </CardBody>
            </Card>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 className="font-bold text-large ">Completed</h3>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
              <p className="text-6xl font-bold ml-12 mt-4">{lastTokenNumber-totalCustomerCount}</p>
              </CardBody>
            </Card>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 className="font-bold text-large">Pending</h3>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
              <p className="text-6xl font-bold ml-12 mt-4">{pendingCount}</p>
              </CardBody>
            </Card>
          </div>
          </div>
          <div className="grid grid-cols-1 mb-4 mt-16">
            <Card className="py-4 ml-4 w-[200px]">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <h3 className="font-bold text-large mb-21">Now Serving</h3>
                {isServiceStarted && nextTokenIndex > 0 && (
                  <p className="text-6xl font-bold  mt-4">{nowServingToken}</p>
                )}
              </CardHeader>
              {isServiceStarted && nextTokenIndex > 0 && (
                <CardBody className="overflow-visible py-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={handleSaveButtonClick}
                        className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3 w-32"
                      >
                        Completed
                      </Button>
                    </div>
                    <div className="flex justify-end mb-0">
                      <Button
                        onClick={handlePendingButtonClick}
                        className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3 w-32"
                      >
                        Pending
                      </Button>
                    </div>
                  </div>
                </CardBody>
              )}
            </Card>

          </div>
          <div className="mb-2 mt-12 ml-14">
            <div className="flex justify-end mb-2">
              <Button onClick={handleCallButtonClick} className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-32 mt-8">
                Call
              </Button>
            </div>
            <div className="flex justify-end mb-2">
              <Button onClick={handleRecallButtonClick} className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-32 mt-8">
                Recall
              </Button>
            </div>
            {/* <div className="flex justify-end mb-2">
              <Button onClick={handleResetButtonClick} className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-32 mt-8">
                Reset Token
              </Button>
            </div> */}
          </div>

          <div className="flex flex-col items-center justify-center p-10 py-5 gap-10 w-full">
            <Table aria-label="Example static collection table" removeWrapper>
              <TableHeader >
                <TableColumn>Sl. no.</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Reason for Visit</TableColumn>
                <TableColumn>Token No</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
              {singleCounterData.sort((a, b) => (a.token > b.token) ? 1 : -1).map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.date ? user.date.toDate().toLocaleString() : ""}</TableCell>
                  <TableCell>{user.service}</TableCell>
                  <TableCell>{user.token}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => callSpecificToken(user.token)}
                      className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3"
                    >
                      Call Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterDash;