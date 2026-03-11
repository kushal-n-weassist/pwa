"use client";
import React from "react";
import { X } from "lucide-react";

const NotificationModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-[3px]">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Close Button + Subject */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{data.document_name}</h2>
          <X
            className="w-6 h-6 cursor-pointer hover:text-gray-500 transition-colors flex-shrink-0 ml-2"
            onClick={onClose}
          />
        </div>
        {/* Document Name */}
        {/* <p className="text-sm text-blue-500 font-medium mb-4">{data.document_name}</p> */}

        {/* Email Content */}
        <div className="min-h-[150px] mb-8 bg-gray-50 rounded-2xl p-4">
          <p className="text-grey-700 text-lg">
            {data.subject || "No details available"}
          </p>
        </div>
        {/* Pay Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
