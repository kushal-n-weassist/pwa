import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody } from "@heroui/react";
import VerticalSummary from "./VerticalSummary";

export default function SubmitRequest({ onEdit }) {
  const allData = useSelector((state) => state.details);
  const [showPreview, setShowPreview] = useState(false);

  const handleEdit = () => {
    if (onEdit) onEdit(1); 
  };

  if (showPreview) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        <Card className="shadow-none border border-gray-100 rounded-[24px] bg-white">
          <CardBody className="p-6">
            <VerticalSummary data={allData} />
          </CardBody>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md z-50">
          <Button 
            onPress={() => setShowPreview(false)}
            className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
          >
            Back to Submit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-none border border-gray-100 rounded-[24px] bg-white">
        <CardBody className="p-8 text-center flex flex-col gap-4">
          <h2 className="text-[20px] font-extrabold text-gray-900">
            Submit your request
          </h2>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
            Please review all the details before submitting all the application.
            <span className="font-bold text-gray-800 ml-1">
              The Hospital will be notified to fill the medical info for you to move forward.
            </span>
          </p>

          <div className="flex justify-center gap-4 mt-2">
            <Button 
              onPress={() => setShowPreview(true)}
              variant="bordered" 
              className="border-[#1DA1FA] text-[#1DA1FA] rounded-full px-8 font-bold h-10"
            >
              Preview
            </Button>
            <Button 
              onPress={handleEdit}
              variant="bordered" 
              className="border-gray-900 text-gray-900 rounded-full px-8 font-bold h-10"
            >
              Edit
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md z-50">
        <Button 
          className="w-full max-w-md mx-auto flex bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-lg shadow-lg"
          onPress={() => console.log("Final Submission:", allData)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}