"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  WhatsappShareButton, WhatsappIcon,
  TelegramShareButton, TelegramIcon,
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  EmailShareButton, EmailIcon,
} from "react-share";
import Confetti from "@/components/celebration/Confetti"; // Assume exists

interface ShareScreenProps {
  slug: string;
  shareUrl: string;
}

export default function ShareScreen({ slug, shareUrl }: ShareScreenProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 2000);
  }, [copied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <div className="max-w-2xl mx-auto text-center relative z-10">
      <Confetti isActive={true} mode="explosion" />
      
      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-pulse">
          ✓
        </div>
      </div>
      
      <h2 className="text-4xl font-bold text-white mb-4">Your celebration is live!</h2>
      <p className="text-gray-400 mb-10 text-lg">Share this special link with the birthday person.</p>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white p-4 rounded-xl shadow-inner">
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
          <div className="flex-1 w-full space-y-6">
            <div className="flex gap-4 justify-center flex-wrap">
              <WhatsappShareButton url={shareUrl} title="I made a surprise for you!"><WhatsappIcon size={48} round className="hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] rounded-full" /></WhatsappShareButton>
              <TelegramShareButton url={shareUrl} title="I made a surprise for you!"><TelegramIcon size={48} round className="hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(0,136,204,0.5)] rounded-full" /></TelegramShareButton>
              <FacebookShareButton url={shareUrl}><FacebookIcon size={48} round className="hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] rounded-full" /></FacebookShareButton>
              <TwitterShareButton url={shareUrl}><TwitterIcon size={48} round className="hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(29,161,242,0.5)] rounded-full" /></TwitterShareButton>
              <EmailShareButton url={shareUrl} subject="A birthday surprise for you!" body="Check out this link:"><EmailIcon size={48} round className="hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(128,128,128,0.5)] rounded-full" /></EmailShareButton>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-2 border border-gray-700">
              <input type="text" readOnly value={shareUrl} className="bg-transparent text-gray-300 w-full px-2 outline-none" />
              <button onClick={copyToClipboard} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap">
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => window.open(`/p/${slug}`, '_blank')}
        className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold text-lg transition-colors"
      >
        Preview as Recipient <span>→</span>
      </button>
    </div>
  );
}
