import { Avatar, Badge, Input } from "@heroui/react";
import { Search, Bell } from "lucide-react";

export default function TopHeader() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="md" />
                    <div className="text-white">
                        <h1 className="text-xl font-bold">Hi, Bala</h1>
                        <p className="text-sm opacity-80">Welcome Back</p>
                    </div>
                </div>
                {/* <Badge color="primary" content="5"> */}
                <div className="bg-white/20 p-2 rounded-full">
                    <Bell className="text-white" size={24} />
                </div>
                {/* </Badge> */}
            </div>

            <div className="flex justify-center items-center">
                <Input
                    placeholder="Search"
                    variant="flat"
                    startContent={<Search size={18} className="text-gray-400" />}
                    className="bg-white/60 backdrop-blur-md rounded-2xl w-3/4"
                    classNames={{
                        innerWrapper:[
                            "px-3",
                            "flex",
                            "gap-3",
                        ],
                        input:[
                            "text-[#6F92AD]"
                        ]
                    }}
                />
            </div>

        </div>
    );
}