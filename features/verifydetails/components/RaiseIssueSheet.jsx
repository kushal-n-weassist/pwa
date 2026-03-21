"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { raiseTicket, resetTicketState } from "@/features/issue-raise/storage/issueraiseSlice";
import toast from "react-hot-toast";
import BouncingDots from "@/components/BouncingDots";

export default function RaiseIssueSheet({ ssrId, onClose, onSuccess }) {
    const [issue, setIssue] = useState("");
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.ticket);

    const handleSubmit = async () => {
        if (!issue.trim()) return;

        const result = await dispatch(raiseTicket({ ssr_id: ssrId, reason: issue }));

        if (raiseTicket.fulfilled.match(result)) {
            toast.success("Ticket raised successfully");
            dispatch(resetTicketState());
            setIssue("");
            onSuccess?.();
        } else {
            toast.error(result.payload || "Failed to raise ticket");
        }
    };

    return (
        <div className="p-8 flex flex-col gap-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-2 mx-auto" />

            <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-900">Raise issue</h3>
            </div>

            <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full h-32 p-4 bg-[#F5F5F5] rounded-xl text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1DA1FA]"
            />
            <Button
                onPress={handleSubmit}
                isDisabled={!issue.trim() || loading}
                className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg disabled:opacity-50"
            >
                {loading ? <BouncingDots /> : "Raise Issue"}
            </Button>
        </div>
    );
}