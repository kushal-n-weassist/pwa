export function BottomPayBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/80 p-5 backdrop-blur-md">
            <div className="mx-auto flex max-w-md items-center justify-between">
                <div>
                    <div className="text-2xl font-bold text-gray-900">₹6,699</div>
                    <button className="text-sm font-semibold text-blue-500 hover:underline">
                        View detailed bill
                    </button>
                </div>
                <button className="rounded-xl bg-blue-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-transform active:scale-95">
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
}