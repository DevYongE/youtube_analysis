import { YouTubeVideo } from "@/types/youtube";
import { formatDuration, formatNumber } from "@/lib/utils";
import { Eye, ThumbsUp, MessageCircle, TrendingUp } from "lucide-react";
import Image from "next/image";

interface VideoCardProps {
    video: YouTubeVideo;
    rank?: number;
    type?: 'default' | 'shorts';
    onClick?: () => void;
}

export function VideoCard({ video, rank, type = 'default', onClick }: VideoCardProps) {
    const { snippet, statistics, contentDetails } = video;

    // Engagement Rate Calculation: (Likes + Comments) / Views * 100
    const views = Number(statistics.viewCount) || 1;
    const likes = Number(statistics.likeCount) || 0;
    const comments = Number(statistics.commentCount) || 0;
    const engagementRate = ((likes + comments) / views * 100).toFixed(2);

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800"
            onClick={onClick}
        >
            {/* Thumbnail */}
            <div className={`relative ${type === 'shorts' ? 'aspect-[9/16]' : 'aspect-video'} bg-zinc-100 dark:bg-zinc-800 overflow-hidden`}>
                <Image
                    src={type === 'shorts' ? snippet.thumbnails.high.url : snippet.thumbnails.medium.url}
                    alt={snippet.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(contentDetails.duration)}
                </div>
                {rank && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
                        {rank}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {snippet.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                    {snippet.channelTitle}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400 mt-auto">
                    <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(statistics.viewCount)}
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {formatNumber(statistics.likeCount)}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {engagementRate}%
                    </div>
                </div>
            </div>
        </div>
    );
}
