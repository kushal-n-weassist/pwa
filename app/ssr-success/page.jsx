"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { resetSuccessState } from "@/features/details/store/detailsSlice";
import { Button, Card, CardBody } from "@heroui/react";
import { ChevronLeft } from "lucide-react";

export default function SuccessPage() {
  const { submissionSuccess, lastCreatedSsr } = useSelector((state) => state.details || {});
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("mode") === "update";
  const dispatch = useDispatch();

  useEffect(() => {
    if (!submissionSuccess) {
      // router.replace("/dashboard");
      // return;
    }

    return () => {
      dispatch(resetSuccessState());
    };
  }, [submissionSuccess, router, dispatch]);

  // if (!submissionSuccess) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.push("/dashboard")}
          className="min-w-0 w-10 h-10 -ml-2"
          aria-label="Back to Dashboard"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </Button>
      </div>

      {/* Centered Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-6">

          {/* Success Row */}
          <div className="flex gap-4 items-start relative">
            {/* Dashed vertical line */}
            <div className="absolute left-[10px] top-[22px] h-[calc(100%+24px)] w-[2px] border-l-2 border-dashed border-gray-300 z-0" />

            {/* Blue dot */}
            <div className="z-10 flex-shrink-0 mt-0.5">
              <div className="w-[22px] h-[22px] rounded-full bg-[#1DA1FA] border-[4px] border-blue-100" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1 z-10">
              <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
                {isUpdate ? "Request Updated Successfully" : "Self Service Created Successfully"}
              </h2>
              <p className="text-[13px] text-gray-500 font-medium">
                Application Number — {lastCreatedSsr || "N/A"}
              </p>
            </div>
          </div>

          {/* Info Card */}
          <Card className="shadow-md border-none rounded-2xl overflow-hidden ml-0">
            <CardBody className="p-4 flex flex-row gap-4 items-center">
              <div className="w-[22px] h-[22px] rounded-full bg-[#1DA1FA] border-[4px] border-blue-100 flex-shrink-0" />
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                Request For Medical / Hospitalisation Details from Staff / Representive
              </p>
            </CardBody>
          </Card>

        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-12">
        <Button
          onPress={() => router.push("/dashboard")}
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-[16px] shadow-lg active:scale-95 transition-transform"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}