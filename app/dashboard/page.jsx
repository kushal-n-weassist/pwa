"use client";
import TopHeader from "@/components/TopHeaders";
import CustomStepper from "@/components/CustomStepper";
import QuickAccess from "@/components/QuickAccess";
import SSRSection from "@/components/SSRSection";
import BottomNav from "@/components/BottomNav";
import { useDispatch } from "react-redux";
import { fetchSSR } from "@/features/dashboard/store/dashboardSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const state = useSelector((state)=>state);

  console.log("the state ",state);

  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSSR());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#018FDE] to-[#008FDF] flex flex-col font-sans">
      <div className="px-6 pt-12 pb-8">
        <TopHeader />
        <div className="mt-6">
          <CustomStepper />
        </div>
      </div>

      <div className="flex-grow bg-white rounded-t-[40px] px-6 pt-8 pb-24">
        <QuickAccess />
        <SSRSection />
      </div>

      <BottomNav />
    </div>
  );
}