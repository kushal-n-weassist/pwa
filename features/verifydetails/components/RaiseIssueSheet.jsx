"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { raiseTicket, resetTicketState } from "@/features/issue-raise/storage/issueraiseSlice";
import toast from "react-hot-toast";
import BouncingDots from "@/components/BouncingDots";

export default function RaiseIssueSheet({ ssrId, onClose, onSuccess }) {
    const [issue, setIssue] = useState("");
    const [subject, setSubject] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.ticket);

    const handleSubmit = async () => {
        if (!issue.trim() || !subject.trim() || !name.trim() || !email.trim()) return;

        const result = await dispatch(raiseTicket({ ssr_id: ssrId, reason: issue, subject, name, email }));

        if (raiseTicket.fulfilled.match(result)) {
            toast.success("Ticket raised successfully");
            dispatch(resetTicketState());
            setIssue("");
            setSubject("");
            setName("");
            setEmail("");
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

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full p-4 bg-[#F5F5F5] rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1FA]"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full p-4 bg-[#F5F5F5] rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1FA]"
                    />
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject title"
                    className="w-full p-4 bg-[#F5F5F5] rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1FA]"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
                <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full h-32 p-4 bg-[#F5F5F5] rounded-xl text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1DA1FA]"
                />
            </div>
            <Button
                onPress={handleSubmit}
                isDisabled={!issue.trim() || !subject.trim() || !name.trim() || !email.trim() || loading}
                className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg disabled:opacity-50"
            >
                {loading ? <BouncingDots /> : "Raise Issue"}
            </Button>
        </div>
    );
}