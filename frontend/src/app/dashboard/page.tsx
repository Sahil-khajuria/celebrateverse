'use client'
import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const pages = [
    { id: 1, name: "Alex's 25th", views: 42, wishes: 15, theme: "Neon Night" },
    { id: 2, name: "Mom's Surprise", views: 108, wishes: 45, theme: "Classic Gold" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold">My Birthday Pages</h1>
          <Link href="/create" className="px-6 py-3 bg-pink-500 rounded-full font-bold shadow-lg shadow-pink-500/30 hover:bg-pink-600">
            + Create New
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map(page => (
            <div key={page.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{page.name}</h3>
                <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">{page.theme}</span>
              </div>
              <div className="flex gap-4 text-gray-400 text-sm mb-6">
                <span>👁 {page.views} views</span>
                <span>💌 {page.wishes} wishes</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/10 rounded-lg font-bold hover:bg-white/20">Preview</button>
                <button className="flex-1 py-2 bg-pink-500/20 text-pink-400 rounded-lg font-bold hover:bg-pink-500/30">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
