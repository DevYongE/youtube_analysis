import axios from 'axios';
import { YouTubeApiResponse, YouTubeSearchResult, YouTubeVideo } from '@/types/youtube';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeClient = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    },
});

export const youtubeService = {
    // 1. Get Top Videos (Most Popular)
    getMostPopularVideos: async (regionCode: string = 'KR', maxResults: number = 50, categoryId: string = ''): Promise<YouTubeVideo[]> => {
        try {
            const params: any = {
                part: 'snippet,contentDetails,statistics',
                chart: 'mostPopular',
                regionCode,
                maxResults,
            };
            if (categoryId && categoryId !== '0') {
                params.videoCategoryId = categoryId;
            }

            const response = await youtubeClient.get<YouTubeApiResponse<YouTubeVideo>>('/videos', { params });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching popular videos:', error);
            return [];
        }
    },

    // 2. Get Shorts (Approximation using search)
    getShorts: async (maxResults: number = 50, categoryId: string = ''): Promise<YouTubeSearchResult[]> => {
        try {
            const params: any = {
                part: 'snippet',
                q: '#shorts',
                type: 'video',
                videoDuration: 'short',
                maxResults,
                order: 'viewCount',
            };
            if (categoryId && categoryId !== '0') {
                params.videoCategoryId = categoryId;
            }

            const response = await youtubeClient.get<YouTubeApiResponse<YouTubeSearchResult>>('/search', { params });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching shorts:', error);
            return [];
        }
    },

    // 3. Get Video Details (for analysis or enriching search results)
    getVideoDetails: async (videoIds: string[]): Promise<YouTubeVideo[]> => {
        try {
            const response = await youtubeClient.get<YouTubeApiResponse<YouTubeVideo>>('/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    id: videoIds.join(','),
                },
            });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching video details:', error);
            return [];
        }
    },

    // Helper to get full details for search results (since search API doesn't give stats)
    enrichVideoData: async (videos: YouTubeSearchResult[]): Promise<YouTubeVideo[]> => {
        const ids = videos.map(v => v.id.videoId);
        if (ids.length === 0) return [];
        return youtubeService.getVideoDetails(ids);
    }
};
