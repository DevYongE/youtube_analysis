import Link from "next/link";
import { Home, Lightbulb, Video, Upload, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    YouTube Architect
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors">
                    <Home size={20} />
                    <span>Dashboard</span>
                </Link>

                <Link href="/youtube-create" className="flex items-center gap-3 px-4 py-3 text-white bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-900/50 rounded-xl transition-all shadow-sm">
                    <Video size={20} />
                    <span>Content Studio</span>
                </Link>

                {/* Placeholders for future features */}
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-800/50 rounded-xl transition-colors cursor-not-allowed">
                    <Lightbulb size={20} />
                    <span>Trend Insights</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
