import { YouTubeVideo } from "@/types/youtube";
import { VideoCard } from "./VideoCard";

interface VideoListProps {
    videos: YouTubeVideo[];
    type?: 'default' | 'shorts';
    onVideoClick?: (video: YouTubeVideo) => void;
    loading?: boolean;
}

export function VideoList({ videos, type = 'default', onVideoClick, loading }: VideoListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl aspect-[4/3]" />
                ))}
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-500">
                영상이 없습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${type === 'shorts' ? 'lg:grid-cols-5' : ''}`}>
            {videos.map((video, index) => (
                <VideoCard
                    key={video.id}
                    video={video}
                    rank={index + 1}
                    type={type}
                    onClick={() => onVideoClick?.(video)}
                />
            ))}
        </div>
    );
}
