"use client";
import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Search, ChevronLeft } from "lucide-react";
import ServiceTile from "@/features/services/components/ServiceTile";
import ssr from '@/public/ssr.png';

export default function ServicesPage() {
    const [searchValue, setSearchValue] = useState("");


    const servicesList = [
        { id: "SSR-10-24-00", name: "Karthik G" },
        { id: "SSR-10-24-01", name: "Karthik G" },
        { id: "SSR-10-24-02", name: "Karthik G" },
        { id: "SSR-10-24-03", name: "Karthik G" },
        { id: "SSR-10-24-04", name: "Karthik G" },
        { id: "SSR-10-24-05", name: "Karthik G" },
        { id: "SSR-10-24-06", name: "Karthik G" },
        { id: "SSR-10-24-07", name: "Karthik G" },
    ];

    const filteredList = servicesList.filter(
        (item) =>
            item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
            <div className="px-6 pt-8 pb-4 flex items-center relative">
                <button className="absolute left-6 p-1 -ml-1 text-gray-700">
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-[20px] font-extrabold text-gray-900 w-full text-center">
                    Services
                </h1>
            </div>

            <div className="px-6 mb-6 flex">
                <Input
                    classNames={{
                        base: "h-12",
                        mainWrapper: "h-full",
                        input: "text-[14px]",
                        inputWrapper:
                            "h-full font-normal text-gray-500 bg-[#EBEBEB] dark:bg-default-400/20 rounded-[14px] px-5",
                    }}
                    startContent={<Search size={18} className="text-gray-400 mr-1" />}
                    placeholder="Search here"
                    value={searchValue}
                    onValueChange={setSearchValue}
                    
                    type="search"
                />
            </div>


            <div className="flex-1 px-6 pb-24 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    {filteredList.map((service, index) => (
                        <ServiceTile
                            key={index}
                            id={service.id}
                            name={service.name}
                            onClick={() => console.log(`Clicked on ${service.id}`)}
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#F8FAFC]/90 backdrop-blur-md z-10">
                <Button
                    className="w-full bg-[#1DA1FA] text-white font-extrabold h-14 rounded-2xl text-[16px] shadow-[0_4px_10px_rgba(29,161,250,0.3)]"
                    onPress={() => console.log("Continue clicked")}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}