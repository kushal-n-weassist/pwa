import React from "react";
import { Button, Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { useSelector } from "react-redux";
import VerticalSummary from "./VerticalSummary";

export default function SubmitRequestPage({ onEdit }) {
  const allData = useSelector((state) => state.details);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 border-b-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-[20px] font-extrabold text-gray-900 leading-tight">
            Submit your request
          </h2>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
            Please review all the details before submitting all the application.
            <span className="font-bold text-gray-800 ml-1">
              The Hospital will be notified to fill the medical info for you to move forward.
            </span>
          </p>

          <div className="flex gap-4 pt-2">
            <Button
              onPress={onOpen}
              variant="bordered"
              className="flex-1 border-[#1DA1FA] text-[#1DA1FA] rounded-full font-bold h-11 text-[14px]"
            >
              Preview
            </Button>
            <Button
              onPress={onEdit}
              variant="bordered"
              className="flex-1 border-gray-400 text-gray-700 rounded-full font-bold h-11 text-[14px]"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="full"
        portalContainer={typeof window !== "undefined" ? document.body : null}
        classNames={{
          base: "m-0 sm:m-4 rounded-t-[32px] sm:rounded-[32px] bg-[#F8FAFC]",
          wrapper: "z-[9999]", // High z-index to beat the footer
          backdrop: "bg-black/50 backdrop-blur-sm z-[9998]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-6 pt-12">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                  <VerticalSummary formData={allData} />
                </div>

                <Button
                  onPress={onClose}
                  className="w-full mt-6 bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-[16px]"
                >
                  Back to Submit
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="fixed bottom-8 left-0 right-0 px-6">
        <Button
          className="w-full bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-[16px] shadow-lg shadow-blue-200"
          onPress={() => console.log("Final Data Submitted:", allData)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}