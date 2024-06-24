import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokenNumber } = location.state; // Retrieve tokenNumber from location state

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 472]);
      const { width, height } = page.getSize();
      const fontSize = 19.2;
      const textHeight = fontSize + 10;

      page.drawText("Queue Management System by Tecnavis", {
        x: width / 2 - 200,
        y: height - 100,
        size: 24,
        color: rgb(0, 0, 0),
      });

      page.drawText(tokenNumber, {
        x: width / 2 - 40,
        y: height / 2,
        size: 35,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(pdfBlob);
      a.download = 'token.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh justify-center items-center">
      <Card className="py-8 px-6 w-full max-w-lg mx-auto">
        <CardHeader className="pb-0 pt-4 px-6 flex-col items-center">
          <h1 className="font-semibold text-2xl mb-8">Request Submitted Successfully</h1>
        </CardHeader>
        <CardBody className="overflow-visible py-4 px-6">
          <div className="flex flex-col justify-center items-center">
          <p className="mb-8 text-lg font-semibold">Your token number is: {tokenNumber}</p>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Button className="bg-[#6236F5] text-white w-64 py-3 text-lg" onClick={handleDownloadPDF}>
              Download Token
            </Button>
            <Button className="bg-[#6236F5] text-white w-64 py-3 text-lg" onClick={() => navigate("/userForm")}>
              Go Back Home
            </Button>
          </div>
        </CardBody>
      </Card>  
    </div>
  );
}
