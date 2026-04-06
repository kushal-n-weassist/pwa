"use client";
import React, { useState } from "react";
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { Search, ChevronLeft, LayoutGrid, ClipboardEdit } from "lucide-react";
import ServiceTile from "@/features/services/components/ServiceTile";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchSingleSSR, setAllDetails } from "@/features/details/store/detailsSlice";
import { setSelectedSSR } from "@/features/dashboard/store/dashboardSlice";
import toast from "react-hot-toast";

export default function ServicesPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const { ssrList, loading } = useSelector((state) => state.dashboard);
    
    // State to track which SSR is currently clicked
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [tempSelectedSSR, setTempSelectedSSR] = useState(null);

    const handleBack = () => router.back();

    const filteredList = ssrList.filter(
        (item) =>
            item.patient_first_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.hospital_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.city_name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Step 1: When user clicks a tile, store the name and open the selection modal
    const handleTileClick = (ssrName) => {
        setTempSelectedSSR(ssrName);
        onOpen();
    };

    // Step 2: When user picks an action, fetch data and navigate
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

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex items-center relative">
                <button className="absolute left-6 p-1 -ml-1 text-gray-700" onClick={handleBack}>
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-[20px] font-extrabold text-gray-900 w-full text-center">Services</h1>
            </div>

            {/* Search */}
            <div className="px-6 mb-6">
                <Input
                    classNames={{
                        inputWrapper: "h-12 bg-[#EBEBEB] rounded-[14px] px-5",
                    }}
                    startContent={<Search size={18} className="text-gray-400 mr-1" />}
                    placeholder="Search here"
                    value={searchValue}
                    onValueChange={setSearchValue}
                />
            </div>

            {/* Grid */}
            <div className="flex-1 px-6 pb-24 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    {filteredList.map((service) => (
                        <ServiceTile
                            key={service.name}
                            id={service.name}
                            name={service.patient_first_name}
                            onClick={() => handleTileClick(service.name)}
                        />
                    ))}
                </div>
            </div>

            {/* Selection Modal (Action Choice) */}
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
                            <h2 className="text-xl font-bold text-gray-900 text-center">Select Action</h2>
                            <p className="text-sm text-gray-500 text-center mb-4">Choose what you want to do with SSR: <span className="font-bold text-[#1DA1FA]">{tempSelectedSSR}</span></p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    onPress={() => handleAction('stages')}
                                    className="h-24 flex flex-col gap-2 bg-blue-50 text-[#1DA1FA] font-bold rounded-2xl border-2 border-blue-100"
                                >
                                    <LayoutGrid size={24} />
                                    Stages
                                </Button>
                                <Button 
                                    onPress={() => handleAction('update')}
                                    className="h-24 flex flex-col gap-2 bg-gray-50 text-gray-700 font-bold rounded-2xl border-2 border-gray-100"
                                >
                                    <ClipboardEdit size={24} />
                                    Update
                                </Button>
                            </div>
                            <Button variant="light" onPress={onClose} className="mt-2 text-gray-400 font-medium">Cancel</Button>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}