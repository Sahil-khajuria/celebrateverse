"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import OpeningSequence from "@/components/recipient/OpeningSequence";
import CelebrationStage from "@/components/recipient/CelebrationStage";
import CakeStage from "@/components/recipient/CakeStage";
import SurpriseReveal from "@/components/recipient/SurpriseReveal";
import MusicPlayer from "@/components/celebration/MusicPlayer";
import GuestbookPanel from "@/components/celebration/GuestbookPanel";
import Balloons from "@/components/celebration/Balloons";
import CalmModeToggle from "@/components/ui/CalmModeToggle";
import { pagesApi, engagementApi } from "@/lib/apiEndpoints";

export default function RecipientPage({ params }: { params: { slug: string } }) {
  const [pageData, setPageData] = useState<any>(null);
  const [stage, setStage] = useState<"opening" | "ready" | "celebration" | "cake" | "reveal">("opening");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pagesApi.getBySlug(params.slug);
        if (data.isPasswordProtected) {
          setAuthRequired(true);
        } else {
          setPageData(data);
          setIsCalmMode(data.isCalmModeDefault || false);
          engagementApi.logEvent(params.slug, "PAGE_VIEW");
        }
      } catch (e) {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.slug]);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await pagesApi.verifyPassword(params.slug, password);
      if (res.valid || res === true || res.isValid) { 
        // Real app would set a cookie/token for the password session, or fetch full data
        // Assuming getting full data requires no additional auth for now after knowing it's valid, 
        // actually if the page is protected, `getBySlug` only returns partial data until password verified.
        // Wait, for this MVP we just fetch again or assume pageData is already set but was hidden.
        // Let's re-fetch the data.
        const data = await pagesApi.getBySlug(params.slug);
        setPageData(data);
        setIsCalmMode(data.isCalmModeDefault || false);
        setAuthRequired(false);
        engagementApi.logEvent(params.slug, "PAGE_VIEW").catch(()=>{});
      } else {
        alert("Incorrect password");
      }
    } catch (e) {
      alert("Incorrect password or error");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black" />;

  if (authRequired) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handlePassword} className="bg-gray-800 p-8 rounded-2xl max-w-md w-full">
          <h2 className="text-2xl text-white mb-6">Password Protected</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white mb-4" placeholder="Enter password" />
          <button type="submit" className="w-full bg-pink-500 text-white p-4 rounded-xl font-bold">Unlock</button>
        </form>
      </div>
    );
  }

  if (!pageData) return null;

  const mediaAssets = pageData.mediaAssets || [];
  const customSongUrl = mediaAssets.find((a: any) => a.type === 'MUSIC')?.url || pageData.customSong;
  const slideshowSongUrl = mediaAssets.find((a: any) => a.type === 'SLIDESHOW_MUSIC')?.url;
  const photos = mediaAssets.filter((a: any) => a.type === 'PHOTO').map((a: any) => a.url);
  // Optional: fallback to balloon_photo type if no photos
  const balloonPhotoUrl = mediaAssets.find((a: any) => a.type === 'BALLOON_PHOTO')?.url;
  if (balloonPhotoUrl && !photos.includes(balloonPhotoUrl)) {
    photos.push(balloonPhotoUrl);
  }

  return (
    <div className={`theme-${pageData.theme || 'classic_gold'}`}>
      <CalmModeToggle isCalmMode={isCalmMode} onToggle={() => setIsCalmMode(!isCalmMode)} />
      <MusicPlayer src={customSongUrl} slideshowSongUrl={slideshowSongUrl} stage={stage} isVoiceActive={isVoiceActive} />
      
      {stage !== "opening" && stage !== "ready" && <GuestbookPanel slug={params.slug} isOpen={isGuestbookOpen} onToggle={() => setIsGuestbookOpen(!isGuestbookOpen)} />}
      {stage !== "opening" && stage !== "ready" && !isCalmMode && <Balloons recipientName={pageData.recipientName} photos={photos} />}

      <AnimatePresence mode="wait">
        {stage === "opening" && (
          <OpeningSequence key="opening" recipientName={pageData.recipientName} onComplete={() => setStage("ready")} />
        )}
        {stage === "ready" && (
          <motion.div key="ready" className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50 px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 mb-8 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                🎉 Are you ready for a special birthday surprise?
              </h1>
              <button onClick={() => setStage("cake")} className="px-10 py-5 bg-pink-500 hover:bg-pink-600 rounded-full text-white text-2xl font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(236,72,153,0.6)]">
                🎂 Yes, I'm Ready!
              </button>
            </motion.div>
          </motion.div>
        )}
        {stage === "cake" && (
          <CakeStage key="cake" pageData={pageData} isCalmMode={isCalmMode} onBlowComplete={() => setStage("reveal")} slug={params.slug} />
        )}
        {stage === "reveal" && (
          <SurpriseReveal key="reveal" pageData={pageData} isCalmMode={isCalmMode} slug={params.slug} slideshowSongUrl={slideshowSongUrl} onComplete={() => setStage("celebration")} onSlideTypeChange={(type) => setIsVoiceActive(type === 'voice')} />
        )}
        {stage === "celebration" && (
          <CelebrationStage key="celebration" pageData={pageData} isCalmMode={isCalmMode} onContinueToCake={() => {}} slug={params.slug} />
        )}
      </AnimatePresence>
    </div>
  );
}
