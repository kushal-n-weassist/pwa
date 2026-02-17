"use client";
import React from "react";
import { X } from "lucide-react";

const NotificationModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-[2px]">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-end mb-2 :hover:bg-gray-100 p-2 rounded-xl ">
                    <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
                </div>
                <h2 className="text-2xl dont-bold text-grey-900 mb-4">Description</h2>

                <div className="min-h-[150px] mb-8">
                    <p className="text-grey-700 text-lg">
                        {data.description || "No description available"}
                    </p>
                </div>
                {/* Pay Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors text-lg">
                    Pay
                </button>
            </div>
        </div>
    )
}

export default NotificationModal;