"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-10] flex overflow-hidden bg-gradient-to-br from-[#DA4E86] via-[#DA4E86] to-[#B44DFF]">
      {/* Immersive Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(255,106,0,0.28),_transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.08)_100%)] pointer-events-none" />
      
      {/* Floating Animated Glowing Orbs (SLOW & ELEGANT) */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-yellow-300/60 to-orange-400/50 rounded-full blur-[80px] mix-blend-overlay animate-[pulse_8s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] bg-gradient-to-tl from-cyan-400/60 to-pink-500/60 rounded-full blur-[90px] mix-blend-overlay animate-[pulse_12s_ease-in-out_infinite_reverse] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-gradient-to-tr from-lime-300/50 to-emerald-500/50 rounded-full blur-[70px] mix-blend-overlay animate-[pulse_10s_ease-in-out_infinite] pointer-events-none" />

      {/* Floating Glassmorphic Abstract Shapes (SLOW & ELEGANT) */}
      <div className="absolute top-[15%] right-[15%] w-40 h-40 md:w-56 md:h-56 bg-white/20 backdrop-blur-md border-[3px] border-white/40 rounded-3xl animate-[spin_15s_linear_infinite] shadow-[0_10px_50px_rgba(255,255,255,0.4)] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-white/30 to-transparent backdrop-blur-xl border-[4px] border-white/50 rounded-full animate-[pulse_10s_ease-in-out_infinite] shadow-[0_15px_60px_rgba(255,255,255,0.5)] pointer-events-none" />
      <div className="absolute top-[45%] left-[5%] w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-lg border-[3px] border-white/40 rounded-full animate-[pulse_8s_ease-in-out_infinite_reverse] shadow-[0_10px_40px_rgba(255,255,255,0.3)] pointer-events-none" />
      <div className="absolute bottom-[40%] right-[5%] w-32 h-32 bg-gradient-to-tr from-yellow-300/40 to-pink-500/40 backdrop-blur-xl border-[2px] border-white/30 rounded-[2rem] animate-[spin_20s_linear_infinite_reverse] shadow-[0_10px_50px_rgba(255,255,255,0.4)] pointer-events-none" />
      
      {/* Geometric Decorative Elements */}
      <div className="absolute bottom-[10%] right-[30%] w-32 h-32 border-[5px] border-white/50 rounded-xl rotate-45 animate-[spin_25s_linear_infinite] pointer-events-none" />
      <div className="absolute top-[25%] left-[30%] w-16 h-16 border-[4px] border-yellow-300/60 rounded-full animate-[ping_8s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url('/hero/pattern.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          backgroundPosition: "center top",
        }}
      />
    </div>
  );
}
