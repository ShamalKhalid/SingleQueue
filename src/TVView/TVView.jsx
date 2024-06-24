import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { collection, onSnapshot,getDocs } from "firebase/firestore"; // Import onSnapshot
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function UserForm() {
  const auth = getAuth();
  const [countersData, setCountersData] = useState([]);
  const [currentServingTokens, setCurrentServingTokens] = useState({});
  const [nextTokens, setNextTokens] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = () => {
      try {
        const counterNames = ["Counter 1", "Counter 2", "Counter 3", "Counter 4", "Counter 5"];
        const tempCountersData = []; // Temporary array to accumulate counters data
        const promises = counterNames.map(async (counterName) => {
          const counterRef = collection(db, counterName);
          const querySnapshot = await getDocs(counterRef);
          const counterTokens = querySnapshot.docs.map((doc) => doc.data().token);
          tempCountersData.push({ counterName, tokens: counterTokens });
        });
        Promise.all(promises).then(() => {
          setCountersData(tempCountersData); // Update state with accumulated counters data
        });
      } catch (error) {
        console.error("Error fetching counters: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const fetchCurrentServingTokens = () => {
      try {
        if (!user) {
          console.log("User not authenticated");
          return;
        }

        const email = user.email;
        const servingTokens = {};
        const nextTokens = {};

        const fetchTokens = async (counterData) => {
          const counterNumber = parseInt(counterData.counterName.split(" ")[1]); // Extract counter number from counter name
          const servingCollectionName = `CurrentlyServingCounter${counterNumber}`;
          const nextTokenCollectionName = `nextTokenCounter${counterNumber}`;

          const servingRef = collection(db, servingCollectionName);
          onSnapshot(servingRef, (querySnapshot) => {
            servingTokens[counterData.counterName] = !querySnapshot.empty
              ? querySnapshot.docs[0].data().token
              : null;
            setCurrentServingTokens({ ...servingTokens }); // Update currentServingTokens state with new data
          });

          const nextTokenRef = collection(db, nextTokenCollectionName);
          onSnapshot(nextTokenRef, (querySnapshot) => {
            nextTokens[counterData.counterName] = !querySnapshot.empty
              ? querySnapshot.docs[0].data().token
              : null;
            setNextTokens({ ...nextTokens }); // Update nextTokens state with new data
          });
        };

        countersData.forEach((counterData) => {
          fetchTokens(counterData);
        });
      } catch (error) {
        console.error("Error fetching tokens: ", error);
      }
    };

    fetchCurrentServingTokens();
  }, [user, countersData]);

  
  return (
    <div className="flex flex-col min-h-dvh">
      {/* <Navbar /> */}
      <div className="flex flex-1 justify-center flex-wrap lg:mx-10">
        {countersData.map((counter, index) => (
          
          <div key={index} className="px-5 flex flex-col items-center justify-center md:p-5 gap-4">
            <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-between">
            <h1 className="font-semibold md:text-4xl">{counter.counterName}</h1>
            </CardHeader>
            <CardBody className="overflow-visible justify-between py-2">
                <Card className=" w-[190px]   rounded-md">
                <Card shadow='none' className="w-full mb-5 rounded-none">
                  <CardBody className='text-center font-semibold text-xl bg-[#6236F5] text-white'>
                    Now Serving
                    </CardBody>
                  </Card>
                  <h3 className="text-center font-semibold text-6xl">{currentServingTokens[counter.counterName] || "-"}</h3>
                  <Card shadow='none' className="w-full mt-5 mb-5 rounded-none">
                  <CardBody className='text-center font-semibold text-xl bg-[#6236F5] text-white'>
                    Next Token
                    </CardBody>
                  </Card>
                  <h3 className="text-center font-semibold text-5xl mb-4">{nextTokens[counter.counterName] || "-"}</h3>
                </Card>
      </CardBody>
    </Card>
            
            
          </div>
        ))}
      </div>
    </div>
  );
}

