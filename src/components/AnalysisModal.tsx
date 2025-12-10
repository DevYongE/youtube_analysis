import { YouTubeVideo } from "@/types/youtube";
import { X, BarChart2, MessageCircle, ThumbsUp, Clock, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import { formatNumber, formatDuration } from "@/lib/utils";
import { YOUTUBE_CATEGORIES } from "@/lib/constants";

interface AnalysisModalProps {
    video: YouTubeVideo | null;
    onClose: () => void;
}

export function AnalysisModal({ video, onClose }: AnalysisModalProps) {
    if (!video) return null;

    const { snippet, statistics, contentDetails } = video;
    const views = Number(statistics.viewCount);
    const likes = Number(statistics.likeCount);
    const comments = Number(statistics.commentCount);
    const engagementRate = ((likes + comments) / views * 100).toFixed(2);

    // Simple Heuristics for Analysis
    const titleLength = snippet.title.length;
    const hasQuestionMark = snippet.title.includes('?');
    const hasExclamation = snippet.title.includes('!');
    const isShort = contentDetails.duration.includes('M') ? false : true; // Rough check, better to parse duration

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
                    <h2 className="text-lg font-bold truncate pr-4">영상 상세 분석</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Video Info */}
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100">
                            <Image src={snippet.thumbnails.high.url} alt={snippet.title} fill className="object-cover" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold mb-2 leading-snug">{snippet.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{snippet.channelTitle}</span>
                                <span>•</span>
                                <span>{new Date(snippet.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="text-center">
                                <div className="text-xs text-zinc-500 mb-1">조회수</div>
                                <div className="font-bold text-lg">{formatNumber(views)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-zinc-500 mb-1">좋아요</div>
                                <div className="font-bold text-lg">{formatNumber(likes)}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-zinc-500 mb-1">댓글</div>
                                <div className="font-bold text-lg">{formatNumber(comments)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Analysis */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-blue-600" />
                                핵심 성과 지표
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">참여율 (Engagement Rate)</span>
                                    <span className="font-bold text-blue-600">{engagementRate}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">영상 길이</span>
                                    <span className="font-bold">{formatDuration(contentDetails.duration)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">카테고리</span>
                                    <span className="font-bold">{YOUTUBE_CATEGORIES[snippet.categoryId] || snippet.categoryId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                콘텐츠 전략 분석
                            </h3>

                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
                                    <div>
                                        <span className="font-semibold text-sm block">제목 전략</span>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                            {titleLength < 30 ? '짧고 강렬한 제목' : '정보를 많이 담은 상세 제목'} 사용.
                                            {hasQuestionMark && ' 의문형으로 호기심 자극.'}
                                            {hasExclamation && ' 감탄사로 강조.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
                                    <div>
                                        <span className="font-semibold text-sm block">썸네일 패턴</span>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                            고화질 이미지 사용. 텍스트/인물 강조 여부 확인 필요.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
                                    <div>
                                        <span className="font-semibold text-sm block">예상 타겟</span>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                            카테고리 및 콘텐츠 스타일 기반 추정 (자동 분류 필요).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
