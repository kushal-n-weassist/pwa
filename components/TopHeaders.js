"use client";
import { Avatar, Input } from "@heroui/react";
import { Search, Bell, X, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
    Modal, ModalContent, ModalBody, useDisclosure
} from "@heroui/react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import NewRequest from '@/public/newrequest1.svg';
import RequestSummary from "@/public/requestsummary1.svg";
import archivedrequest from "@/public/arcchivedrequest1.svg";
import ssr from "@/public/ssr.png";
import { useDispatch } from "react-redux";
import { fetchSingleSSR, setAllDetails } from "@/features/details/store/detailsSlice";
import { setSelectedSSR } from "@/features/dashboard/store/dashboardSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import maleprofile from '@/public/maleprofile.svg';
import femaleprofile from '@/public/femaleprofile.svg';

const HISTORY_KEY = "ssr_search_history";
const MAX_HISTORY = 8;

const quickAccessItems = [
    { id: 1, label: "New Request", icon: NewRequest, w: 95, h: 85, href: '/newrequest' },
    { id: 2, label: "Request Summary", icon: RequestSummary, w: 0, h: 95, href: '' },
    { id: 3, label: "Archived Request", icon: archivedrequest, w: 105, h: 105, href: '' },
];

export default function TopHeader() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [query, setQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();
    const { username, gender } = useSelector((state) => state.login);

    const { ssrList } = useSelector((state) => state.dashboard);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            if (stored) setSearchHistory(JSON.parse(stored));
        } catch { }
    }, []);

    const saveToHistory = (item) => {
        setSearchHistory((prev) => {
            const filtered = prev.filter((h) => h.name !== item.name);
            const updated = [item, ...filtered].slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromHistory = (e, name) => {
        e.stopPropagation();
        setSearchHistory((prev) => {
            const updated = prev.filter((h) => h.name !== name);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearAllHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    };

    const filteredSSRs = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return ssrList.filter((s) =>
            s.name?.toLowerCase().includes(q) ||
            s.patient_first_name?.toLowerCase().includes(q) ||
            s.patient_last_name?.toLowerCase().includes(q) ||
            s.city_name?.toLowerCase().includes(q)
        );
    }, [query, ssrList]);

    const handleSSRClick = async (item, onClose) => {
        saveToHistory(item);
        const result = await dispatch(fetchSingleSSR(item.name));
        if (fetchSingleSSR.fulfilled.match(result)) {
            dispatch(setAllDetails(result.payload));
            dispatch(setSelectedSSR(item.name));
            onClose();
            setQuery("");
            router.push("/details");
        } else {
            toast.error("Could not load request details");
        }
    };

    const handleModalClose = (open) => {
        if (!open) setQuery("");
        onOpenChange(open);
    };


    const SSRRow = ({ item, onClose, showHistoryIcon = false }) => (
        <div
            onClick={() => handleSSRClick(item, onClose)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-left w-full group cursor-pointer"
        >
            {showHistoryIcon ? (
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock size={15} className="text-gray-400" />
                </div>
            ) : (
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <Image src={ssr} alt="ssr" width={24} height={24} />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1DA1FA] truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate">
                    {item.patient_first_name} · {item.city_name}
                </p>
            </div>
            {showHistoryIcon ? (
                <button
                    onClick={(e) => removeFromHistory(e, item.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                >
                    <X size={13} className="text-gray-400" />
                </button>
            ) : (
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <Link href='/profile' className="flex items-center gap-3 transition-opacity">
                    <Image
                        src={gender?.toLowerCase() === "female" ? femaleprofile : maleprofile}
                        alt="profile"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="text-white">
                        <h1 className="text-xl font-bold">Hi, {username}</h1>
                        <p className="text-sm opacity-80">Welcome Back</p>
                    </div>
                </Link>
                <div className="bg-white/20 p-2 rounded-full">
                    <button className="p-1 text-white" onClick={() => router.push("/notification")}>
                        <Bell className="text-white" size={24} />
                    </button>
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={onOpen}
                    className="flex items-center gap-2 bg-white/20 rounded-2xl w-5/6 px-4 h-11 text-left"
                >
                    <Search size={16} className="text-white flex-shrink-0" />
                    <span className="text-sm text-white font-medium">Search SSR, name, city...</span>
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={handleModalClose}
                placement="top"
                backdrop="blur"
                size="lg"
                classNames={{
                    backdrop: "bg-black/40 backdrop-blur-sm",
                    base: "bg-white rounded-3xl shadow-2xl mx-4 mt-4",
                    body: "p-0",
                    header: "p-0",
                    closeButton: "hidden",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <ModalBody>
                            <div className="flex flex-col max-h-[80vh]">


                                <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
                                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search SSR, name, city..."
                                        className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                                    />
                                    {query ? (
                                        <button
                                            onClick={() => setQuery("")}
                                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setQuery(""); onClose(); }}
                                            className="text-sm text-gray-400 font-medium px-1 hover:text-gray-600 transition-colors"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>


                                <div className="overflow-y-auto flex-1 px-4 py-4 space-y-6">

                                    {!query.trim() && (
                                        <>
                                            {searchHistory.length > 0 && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                            Recent Searches
                                                        </p>
                                                        <button
                                                            onClick={clearAllHistory}
                                                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={11} />
                                                            Clear all
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {searchHistory.map((item) => (
                                                            <SSRRow
                                                                key={item.name}
                                                                item={item}
                                                                onClose={onClose}
                                                                showHistoryIcon
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                                    Quick Access
                                                </p>
                                                <div className="flex justify-between gap-3">
                                                    {quickAccessItems.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={item.href}
                                                            onClick={() => { setQuery(""); onClose(); }}
                                                            className="flex-1 flex flex-col items-center gap-2 bg-blue-50 rounded-2xl p-3 active:opacity-70 transition-opacity"
                                                        >
                                                            <div className="h-12 flex items-center justify-center">
                                                                <Image
                                                                    src={item.icon}
                                                                    alt={item.label}
                                                                    width={item.w || 48}
                                                                    height={item.h || 48}
                                                                    className="object-contain max-h-12"
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {query.trim() && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Results for "{query}"
                                            </p>
                                            {filteredSSRs.length === 0 ? (
                                                <div className="text-center py-10 space-y-2">
                                                    <Search size={32} className="text-gray-200 mx-auto" />
                                                    <p className="text-sm text-gray-400">No results found</p>
                                                    <p className="text-xs text-gray-300">Try searching by SSR ID, name or city</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    {filteredSSRs.map((item) => (
                                                        <SSRRow
                                                            key={item.name}
                                                            item={item}
                                                            onClose={onClose}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
