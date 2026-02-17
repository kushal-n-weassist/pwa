export default function ActionButton({ label, onClick }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md bg-white/80 p-6 backdrop-blur-md">
        <button
          onClick={onClick}
          className="w-full bg-blue-500 py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
