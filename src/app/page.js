import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <button
        className="px-8 py-4 rounded-lg bg-blue-600 text-white text-xl font-semibold shadow hover:bg-blue-700 transition-colors"
        type="button"
      >
        Level 1
      </button>
    </div>
  );
}
