"use client";

import { useState } from "react";
import { Search, Wand2, Upload as UploadIcon, Youtube, Copy, Check, Image as ImageIcon } from "lucide-react";

export default function YouTubeCreatePage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [topic, setTopic] = useState("");
    const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
    const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState("");
    const [content, setContent] = useState<any>(null);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);

    const handleFindTopics = async () => {
        setIsGeneratingTopics(true);
        try {
            const res = await fetch('/api/youtube/generate', {
                method: 'POST',
                body: JSON.stringify({ type: 'find_topics', prompt: topic })
            });
            const data = await res.json();
            if (data.topics) {
                setGeneratedTopics(data.topics);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate topics");
        } finally {
            setIsGeneratingTopics(false);
        }
    };

    const handleGenerateContent = async (t: string) => {
        setSelectedTopic(t);
        setStep(2);
        setIsGeneratingContent(true);
        try {
            const res = await fetch('/api/youtube/generate', {
                method: 'POST',
                body: JSON.stringify({ type: 'generate_content', prompt: t })
            });
            const data = await res.json();
            setContent(data);
        } catch (e) {
            console.error(e);
            alert("Failed to generate content");
        } finally {
            setIsGeneratingContent(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        YouTube Content Architect
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Generate viral Shorts ideas, scripts, and assets in seconds.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className={`px-4 py-2 rounded-full ${step >= 1 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-500'}`}>1. Topic</div>
                    <div className="w-8 h-[2px] bg-gray-800" />
                    <div className={`px-4 py-2 rounded-full ${step >= 2 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-500'}`}>2. Content</div>
                    <div className="w-8 h-[2px] bg-gray-800" />
                    <div className={`px-4 py-2 rounded-full ${step >= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-500'}`}>3. Upload</div>
                </div>
            </div>

            {/* Step 1: Topic Finding */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Search className="text-blue-400" /> Find Viral Topics
                        </h2>
                        <div className="flex gap-4">
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a niche (e.g., AI, Fitness, Cooking)..."
                                className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                onClick={handleFindTopics}
                                disabled={!topic || isGeneratingTopics}
                                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isGeneratingTopics ? <Wand2 className="animate-spin" /> : <Wand2 />}
                                {isGeneratingTopics ? "Analyzing..." : "Find Topics"}
                            </button>
                        </div>
                    </div>

                    {generatedTopics.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {generatedTopics.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleGenerateContent(t)}
                                    className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-red-500/50 p-6 rounded-2xl text-left transition-all group"
                                >
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors">{t}</h3>
                                    <p className="text-sm text-gray-500">Click to generate script & assets</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Content Generation */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors">← Back to Topics</button>
                        <h2 className="text-xl font-semibold text-center">Drafting: <span className="text-red-400">{selectedTopic}</span></h2>
                        <button onClick={() => setStep(3)} className="text-blue-400 hover:text-blue-300 transition-colors">Next: Upload →</button>
                    </div>

                    {isGeneratingContent ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
                            <Wand2 className="w-12 h-12 animate-bounce text-red-500" />
                            <p>Crafting viral content...</p>
                        </div>
                    ) : content && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Left Col: Script & Details */}
                            <div className="space-y-6">
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Title</h3>
                                    <input className="w-full bg-black border border-gray-700 rounded-lg p-3 text-lg font-bold text-white mb-4" defaultValue={content.title} />

                                    <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Description</h3>
                                    <textarea className="w-full bg-black border border-gray-700 rounded-lg p-3 h-24 text-sm text-gray-300" defaultValue={content.description} />
                                </div>

                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Script</h3>
                                    <textarea className="w-full bg-black border border-gray-700 rounded-lg p-3 h-64 font-mono text-sm leading-relaxed" defaultValue={content.script} />
                                </div>
                            </div>

                            {/* Right Col: Design & Assets */}
                            <div className="space-y-6">
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon size={16} /> Thumbnail / Image Prompt
                                    </h3>
                                    <div className="bg-black border border-gray-700 rounded-lg p-4 text-sm text-purple-300 italic mb-4">
                                        {content.imagePrompt}
                                    </div>
                                    <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 py-3 rounded-lg text-sm font-semibold transition-all">
                                        Generate Image in Nano Banana
                                    </button>
                                </div>

                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {content.tags.map((tag: string, i: number) => (
                                            <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 hover:text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Upload */}
            {step === 3 && (
                <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-12">
                    <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-red-900/50">
                        <Youtube className="w-10 h-10 text-white" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">Ready to Publish?</h2>
                        <p className="text-gray-400">Upload your video file and we'll handle the metadata.</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-3xl p-12 transition-all cursor-pointer group">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-600 group-hover:text-white mb-4 transition-colors" />
                        <p className="font-medium text-gray-300">Drag & Drop video file here</p>
                        <p className="text-sm text-gray-600 mt-2">or click to browse files</p>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/youtube/upload', {
                                    method: 'POST',
                                    body: JSON.stringify({ action: 'get_auth_url' })
                                });
                                const data = await res.json();
                                if (data.url) {
                                    window.location.href = data.url;
                                } else {
                                    alert("Upload feature requires server-side token storage setup.");
                                }
                            } catch (e) {
                                console.error(e);
                                alert("Error initiating upload flow");
                            }
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 transition-all">
                        Authenticate & Upload to YouTube
                    </button>

                    <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white text-sm">
                        ← Back to Editing
                    </button>
                </div>
            )}
        </div>
    );
}
