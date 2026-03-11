"use client";

import ssr from "@/public/ssr.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { fetchSingleSSR } from "@/features/details/store/detailsSlice";
import { useDispatch} from "react-redux";
import { setAllDetails } from "@/features/details/store/detailsSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function SSRSection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ssrList, loading } = useSelector((state) => state.dashboard);

  if (loading)
    return <p className="text-center text-gray-400 mt-6">Loading SSR...</p>;

  const handleItemClick = async (ssrName) => {
    const result = await dispatch(fetchSingleSSR(ssrName));
    console.log("the result ",result);
    if (fetchSingleSSR.fulfilled.match(result)) {
      dispatch(setAllDetails(result.payload));
      router.push("/details"); 
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
    </div>
  );
}