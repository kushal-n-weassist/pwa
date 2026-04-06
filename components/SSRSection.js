"use client";

import ssr from "@/public/ssr.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { fetchSingleSSR } from "@/features/details/store/detailsSlice";
import { useDispatch } from "react-redux";
import { setAllDetails } from "@/features/details/store/detailsSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setSelectedSSR } from "@/features/dashboard/store/dashboardSlice";
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from "@heroui/react";
import { LayoutGrid, ClipboardEdit } from "lucide-react";
import { useState } from "react";


export default function SSRSection() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tempSelectedSSR, setTempSelectedSSR] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { ssrList, loading } = useSelector((state) => state.dashboard);
  const state = useSelector((state) => state);
  console.log("the state ", state)

  if (loading)
    return <p className="text-center text-gray-400 mt-6">Loading SSR...</p>;

  const handleItemClick = async (ssrName) => {
    setTempSelectedSSR(ssrName);
    onOpen();
    // const result = await dispatch(fetchSingleSSR(ssrName));
    // if (fetchSingleSSR.fulfilled.match(result)) {
    //   dispatch(setAllDetails(result.payload));
    //   dispatch(setSelectedSSR(ssrName)); // 
    //   // router.push("/details");
    // } else {
    //   toast.error("Could not load request details");
    // }
  };

  const handleAction = async (action) => {
    if (!tempSelectedSSR) return;

    const result = await dispatch(fetchSingleSSR(tempSelectedSSR));

    if (fetchSingleSSR.fulfilled.match(result)) {
      dispatch(setAllDetails(result.payload));
      dispatch(setSelectedSSR(tempSelectedSSR));

      if (action === "stages") {
        router.push("/stages");
      } else {
        router.push("/details");
      }
    } else {
      toast.error("Could not load request details");
    }
  };


  const latestSSRs = [...ssrList]
    .sort((a, b) => new Date(b.creation) - new Date(a.creation))
    .slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-3">
        <h2 className="text-lg font-bold text-gray-800">SSR</h2>
        <Link href='/services'><span className="text-sm text-gray-400">See all</span></Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {latestSSRs.map((item) => (
          <div key={item.name} className="flex flex-col items-center gap-2" onClick={() => handleItemClick(item.name)}>
            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center p-1 justify-center border-6 border-gray-100">
              <Image src={ssr} alt="ssr" width={100} height={100} />
            </div>

            <p className="text-[9px] text-gray-500 font-bold text-center">
              {item.patient_first_name}
              <br />
              {item.city_name}
            </p>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        backdrop="blur"
        className="m-0 rounded-t-[32px] bg-white"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-8 flex flex-col gap-4">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />

              <h2 className="text-xl font-bold text-gray-900 text-center">
                Select Action
              </h2>

              <p className="text-sm text-gray-500 text-center mb-4">
                Choose what you want to do with SSR:
                <span className="font-bold text-[#1DA1FA]"> {tempSelectedSSR}</span>
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onPress={() => handleAction("stages")}
                  className="h-24 flex flex-col gap-2 bg-blue-50 text-[#1DA1FA] font-bold rounded-2xl border-2 border-blue-100"
                >
                  <LayoutGrid size={24} />
                  Stages
                </Button>

                <Button
                  onPress={() => handleAction("update")}
                  className="h-24 flex flex-col gap-2 bg-gray-50 text-gray-700 font-bold rounded-2xl border-2 border-gray-100"
                >
                  <ClipboardEdit size={24} />
                  Update
                </Button>
              </div>

              <Button
                variant="light"
                onPress={onClose}
                className="mt-2 text-gray-400 font-medium"
              >
                Cancel
              </Button>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}