"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wishesApi } from "@/lib/apiEndpoints";

interface GuestbookPanelProps {
  slug: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function GuestbookPanel({ slug, isOpen, onToggle }: GuestbookPanelProps) {
  const [wishes, setWishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const emojis = ["🎉", "❤️", "🎂", "🌟", "🥳", "🎊", "💕", "🦋"];

  const loadWishes = async () => {
    try {
      const data = await wishesApi.getBySlug(slug);
      setWishes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) loadWishes();
  }, [isOpen, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    try {
      await wishesApi.create(slug, { authorName: name || "Anonymous", message, reactionEmoji: emoji });
      setMessage("");
      setName("");
      loadWishes();
    } catch (e) {
      console.error(e);
      // Fallback for local update if API fails
      setWishes([{ authorName: name || "Anonymous", message, reactionEmoji: emoji, createdAt: new Date().toISOString() }, ...wishes]);
      setMessage("");
      setName("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center text-3xl transition-transform hover:scale-110"
      >
        💌
        {wishes.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {wishes.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">💌 Guestbook</h2>
                <button onClick={onToggle} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishes.map((w, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    key={i} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-pink-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">{w.authorName}</span>
                      <span className="text-2xl">{w.reactionEmoji}</span>
                    </div>
                    <p className="text-gray-300">{w.message}</p>
                  </motion.div>
                ))}
                {wishes.length === 0 && <p className="text-center text-gray-500 mt-10">No messages yet. Be the first!</p>}
              </div>

              <div className="p-6 border-t border-gray-800 bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="text" placeholder="Your name (optional)" 
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                  <textarea 
                    placeholder="Write a message..." rows={3} required
                    value={message} onChange={e => setMessage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
                  />
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {emojis.map(e => (
                      <button 
                        key={e} type="button" onClick={() => setEmoji(e)}
                        className={`text-xl p-2 rounded-lg transition-colors ${emoji === e ? 'bg-pink-500/20 border border-pink-500' : 'hover:bg-gray-800'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
