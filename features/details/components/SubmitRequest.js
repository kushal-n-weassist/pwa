"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, CardBody } from "@heroui/react";
import VerticalSummary from "./VerticalSummary";
import { submitSSR, updateSSR } from "../store/detailsSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BouncingDots from "@/components/BouncingDots";
import { uploadSSRDocs } from "@/features/upload/store/uploadSlice";


export default function SubmitRequest({ onEdit }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isSubmitting, docStatus, lastCreatedSsr, ...allData } = useSelector((state) => state.details);
  const { isUploading } = useSelector((state) => state.upload);
  const isLoading = isSubmitting || isUploading; 
  const [showPreview, setShowPreview] = useState(false);

  const isReadOnly = docStatus === 1;

  const handleEdit = () => {
    if (onEdit) onEdit(1);
  };
const handleFinalSubmit = async () => {
  const ssrId = lastCreatedSsr || allData.name;
  const action = ssrId ? updateSSR(ssrId) : submitSSR();
  const isNewSSR = !ssrId; 


  const resultAction = await dispatch(action);


  if (submitSSR.rejected.match(resultAction) || updateSSR.rejected.match(resultAction)) {
    toast.error(`Operation Failed: ${resultAction.payload}`, {
      duration: 5000,
      style: { borderRadius: '20px', background: '#fff', color: '#333', fontSize: '14px', fontWeight: 'bold' },
    });
  } else {
    const createdSSRName = resultAction.payload?.ssr || ssrId;
    console.log("3. createdSSRName:", createdSSRName);

    const successMsg = isNewSSR ? `SSR ${createdSSRName} Created!` : "Request Updated Successfully!";
    toast.success(successMsg, {
      duration: 3000,
      style: { borderRadius: '20px' },
    });

    if (createdSSRName && isNewSSR) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.loading(`Uploading documents for ${createdSSRName}...`, {
        id: "upload-toast",
        style: { borderRadius: '20px' },
      });

      console.log("4. dispatching uploadSSRDocs");
      const uploadResult = await dispatch(uploadSSRDocs(createdSSRName));
      console.log("5. uploadResult:", uploadResult);

      if (uploadSSRDocs.rejected.match(uploadResult)) {
        toast.error("Document upload failed. Re-upload from Edit.", {
          id: "upload-toast",
          duration: 6000,
          style: { borderRadius: '20px' },
        });
      } else {
        toast.success(`Documents uploaded for ${createdSSRName}!`, {
          id: "upload-toast",
          duration: 3000,
          style: { borderRadius: '20px' },
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    router.push("/ssr-success");
  }
};

  if (showPreview) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        <Card className="shadow-none border border-gray-100 rounded-[24px] bg-white">
          <CardBody className="p-6">
            <VerticalSummary data={allData} />
          </CardBody>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md z-50 flex justify-center">
          <Button
            onPress={() => setShowPreview(false)}
            className="w-full max-w-md bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-none rounded-[24px] bg-white border border-gray-50">
        <CardBody className="p-8 text-center flex flex-col gap-4">
          <h2 className="text-[20px] font-extrabold text-gray-900">
            {isReadOnly ? "Request Details" : "Submit your request"}
          </h2>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
            {isReadOnly
              ? "This request has already been submitted. You can preview the details below."
              : "Please review all the details before submitting the application."
            }
            {!isReadOnly && (
              <span className="font-bold text-gray-800 ml-1">
                The Hospital will be notified to fill the medical info for you to move forward.
              </span>
            )}
          </p>

          <div className="flex justify-center gap-4 mt-2">
            <Button
              onPress={() => setShowPreview(true)}
              variant="bordered"
              className="border-[#1DA1FA] text-[#1DA1FA] rounded-full px-8 font-bold h-10"
              isDisabled={isSubmitting}
            >
              Preview
            </Button>

            {!isReadOnly && (
              <Button
                onPress={handleEdit}
                variant="bordered"
                className="border-gray-900 text-gray-900 rounded-full px-8 font-bold h-10"
                isDisabled={isSubmitting}
              >
                Edit
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {!isReadOnly && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md z-50 flex justify-center">
          <Button
            className="w-full max-w-md flex bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-lg shadow-lg"
            onPress={handleFinalSubmit}
            isDisabled={isLoading} 
          >
            {isLoading ? <BouncingDots /> : "Submit"}  
          </Button>
        </div>
      )}

      {isReadOnly && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md z-50 flex justify-center">
          <Button
            onPress={() => router.push("/dashboard")}
            className="w-full max-w-md flex bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-lg shadow-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}