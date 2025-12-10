"use client";

import { useEffect, useState } from "react";
import { youtubeService } from "@/lib/youtube";
import { YouTubeVideo, YouTubeSearchResult } from "@/types/youtube";
import { VideoList } from "@/components/VideoList";
import { AnalysisModal } from "@/components/AnalysisModal";
import { LayoutDashboard, Flame, ThumbsUp, MessageCircle, Youtube } from "lucide-react";
import { YOUTUBE_CATEGORIES } from "@/lib/constants";

type Tab = 'views' | 'likes' | 'comments' | 'trending' | 'shorts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('views');
  const [selectedCategory, setSelectedCategory] = useState<string>('0');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [activeTab, selectedCategory]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let data: YouTubeVideo[] = [];

      if (activeTab === 'shorts') {
        const shortsResults = await youtubeService.getShorts(50, selectedCategory);
        data = await youtubeService.enrichVideoData(shortsResults);
      } else {
        // For other tabs, we fetch popular videos and sort/filter client-side
        // because API sorting is limited for "mostPopular"
        const popular = await youtubeService.getMostPopularVideos('KR', 50, selectedCategory);
        data = popular;

        if (activeTab === 'likes') {
          data.sort((a, b) => Number(b.statistics.likeCount) - Number(a.statistics.likeCount));
        } else if (activeTab === 'comments') {
          data.sort((a, b) => {
            const engagementA = (Number(a.statistics.commentCount) / Number(a.statistics.viewCount));
            const engagementB = (Number(b.statistics.commentCount) / Number(b.statistics.viewCount));
            return engagementB - engagementA;
          });
          data = data.slice(0, 30); // Top 30
        } else if (activeTab === 'trending') {
          // Already trending (mostPopular), but maybe filter by recent upload?
          // For now, just show mostPopular as "Trending"
        }
      }

      setVideos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'views', label: '조회수 TOP 100', icon: Flame },
    { id: 'likes', label: '좋아요 TOP 50', icon: ThumbsUp },
    { id: 'comments', label: '댓글 참여율 TOP 30', icon: MessageCircle },
    { id: 'trending', label: '급상승 (48h)', icon: LayoutDashboard },
    { id: 'shorts', label: 'Shorts TOP 100', icon: Youtube },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Youtube className="text-red-600 w-8 h-8" />
            YouTube Trends Analysis
          </h1>
          <div className="text-sm text-zinc-500">
            Powered by YouTube Data API
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg scale-105'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">전체 카테고리</option>
            {Object.entries(YOUTUBE_CATEGORIES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h2>
            {selectedCategory !== '0' && (
              <span className="text-lg text-zinc-500 font-normal">
                - {YOUTUBE_CATEGORIES[selectedCategory]}
              </span>
            )}
          </div>
          <p className="text-zinc-500 mb-6">실시간 데이터 분석 결과입니다. 카드를 클릭하여 상세 분석을 확인하세요.</p>

          <VideoList
            videos={videos}
            loading={loading}
            type={activeTab === 'shorts' ? 'shorts' : 'default'}
            onVideoClick={setSelectedVideo}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedVideo && (
        <AnalysisModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </main>
  );
}
