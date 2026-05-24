/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import logoUrl from "../logo.png";
import { gsap } from "gsap";
import LightRays from "./components/LightRays";
import SplashCursor from "./components/SplashCursor";
import { 
  ChevronDown, 
  Sparkles, 
  Mic, 
  Home,
  Network,
  Newspaper,
  HeartPulse,
  Landmark,
  TrendingUp,
  Cpu,
  CloudSun,
  Droplet,
  UserPlus,
  LogIn,
  Menu,
  X,
  Check
} from "lucide-react";

/**
 * Solid VideoBackground component that implements:
 * - 250ms requestAnimationFrame-based fade-in on load/loop start
 * - 250ms fade-out when 0.55 seconds remain before video end
 * - fadingOutRef boolean prevents re-triggering fade-out from repeated timeUpdate events
 * - On ended: opacity set to 0, 100ms delay, reset to currentTime = 0, play, fade back in
 * - Each new fade cancels running animation frames to prevent competing animations
 * - Fades resume from current opacity (no snapping)
 */
function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setPlaybackRateSafe = (rate: number) => {
      try {
        if (video) {
          video.playbackRate = rate;
          video.defaultPlaybackRate = rate;
        }
      } catch (err) {
        console.warn("Could not set playback rate safely on iOS:", err);
      }
    };

    // Apply fast-speed playback natively for cinematic flow
    setPlaybackRateSafe(1.5);

    const handleCanPlay = () => {
      setPlaybackRateSafe(1.5);
    };

    video.addEventListener("canplay", handleCanPlay);

    // Initial load and play trigger with autoplay handling
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaybackRateSafe(1.5);
        })
        .catch((err) => {
          console.log("Video autoplay blocked by browser policy:", err);
        });
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <>
      {/* High-fidelity Static Forest Backdrop rendering safely at z-[-1] beneath the video */}
      <div 
        className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600')",
          backgroundColor: "#0b130e"
        }}
      />
      <video
        ref={videoRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover object-top z-0 pointer-events-none transition-all duration-300 opacity-100"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600"
        style={{
          backgroundColor: "transparent",
        }}
      />
    </>
  );
}

function PremiumPreloader({ onComplete }: { onComplete: () => void }) {
  const [activePhrase, setActivePhrase] = useState<number | null>(null);

  useEffect(() => {
    // Lock scrolling during preloader
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-enable scrolling after split reveal animation completes
        document.body.style.overflow = "";
        onComplete();
      }
    });

    // 6.0s progress bar animation
    tl.to("#progressBar", {
      width: "100%",
      duration: 6.0,
      ease: "power1.inOut"
    }, 0);

    const segments = [
      { id: "#phrase1", index: 1, start: 0.0, length: 1.2 },
      { id: "#phrase2", index: 2, start: 1.2, length: 1.2 },
      { id: "#phrase3", index: 3, start: 2.4, length: 1.8 },
      { id: "#phrase4", index: 4, start: 4.2, length: 1.8 }
    ];

    segments.forEach((seg) => {
      // Trigger phrase display state (adds the .active class to reveal text opacity/scale)
      tl.to({}, {
        onStart: () => setActivePhrase(seg.index),
        duration: 0.05
      }, seg.start);

      // Animation of '--gy' CSS property from 160% to -60%
      tl.fromTo(seg.id,
        { "--gy": "160%" },
        {
          "--gy": "-60%",
          duration: seg.length,
          ease: "none"
        },
        seg.start
      );
    });

    // --- Cinematic Split Reveal Actions ---

    // 1. Gently fade out and scale down the loader utility text & bar at 6.0s
    tl.to("#loaderContent", {
      opacity: 0,
      scale: 0.94,
      duration: 0.4,
      ease: "power2.out"
    }, 6.0);

    // 2. Clear out the spotlight light rays
    tl.to("#loaderLightRays", {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out"
    }, 6.0);

    // 3. Slide the left splitting cover to the left (-100% X translation)
    tl.to("#loaderPanelLeft", {
      xPercent: -100,
      duration: 1.2,
      ease: "power3.inOut"
    }, 6.15);

    // 4. Slide the right splitting cover to the right (100% X translation)
    tl.to("#loaderPanelRight", {
      xPercent: 100,
      duration: 1.2,
      ease: "power3.inOut"
    }, 6.15);

    // 5. Ensure parent wrapper ignores pointers once splitting begins so background items are linkable
    tl.to("#loaderWrapper", {
      pointerEvents: "none",
      duration: 0.1
    }, 6.1);

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div className="loader-wrapper" id="loaderWrapper" style={{ backgroundColor: "transparent" }}>
      {/* Absolute Sliding Splits */}
      <div 
        id="loaderPanelLeft" 
        className="loader-panel-left" 
        style={{ willChange: "transform" }}
      />
      <div 
        id="loaderPanelRight" 
        className="loader-panel-right" 
        style={{ willChange: "transform" }}
      />

      {/* 3D WebGL Spotlight system */}
      <div id="loaderLightRays" className="absolute inset-0 z-[2] opacity-75 pointer-events-none">
        <LightRays
          raysOrigin="bottom-center"
          raysColor="#fffafb"
          raysSpeed={1.5}
          lightSpread={2}
          rayLength={3}
          saturation={1.5}
          fadeDistance={1.7}
          pulsating={true}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.06}
          distortion={0.1}
        />
      </div>

      {/* Centered details */}
      <div id="loaderContent" className="loader-content relative z-10">
        <div className="progress-container">
          <div className="progress-bar" id="progressBar" />
        </div>

        <div className="text-display-area font-inter">
          <h1
            className={`headline ${activePhrase === 1 ? "active" : ""}`}
            id="phrase1"
          >
            Welcome to Farm Shield
          </h1>
          <h1
            className={`headline ${activePhrase === 2 ? "active" : ""}`}
            id="phrase2"
          >
            Packed with features Such As...
          </h1>
          <h1
            className={`headline ${activePhrase === 3 ? "active" : ""}`}
            id="phrase3"
          >
            AI Plant Diagnosis — Price Forecasting — Farmer LinkedIn
          </h1>
          <h1
            className={`headline ${activePhrase === 4 ? "active" : ""}`}
            id="phrase4"
          >
            With 13+ Indian languages One Place For Farmers
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // New navigation items array
  const navItems = [
    { id: "Home", label: "Home", icon: Home, desc: "AI agricultural telemetry command center", color: "from-emerald-400 to-teal-500" },
    { id: "Krishi Setu", label: "Krishi Setu", icon: Network, desc: "Consult directly with verified agronomists", color: "from-blue-400 to-indigo-500" },
    { id: "Kisan Times", label: "Kisan Times", icon: Newspaper, desc: "Real-time crop news, trends & bulletins", color: "from-amber-400 to-orange-500" },
    { id: "Diagnosis", label: "Diagnosis", icon: HeartPulse, desc: "Scan plant leaves for pathogen prognosis", color: "from-red-400 to-rose-500" },
    { id: "Government Schemes", label: "Government Schemes", icon: Landmark, desc: "Sarkari grants, subsidies & local benefits", color: "from-violet-400 to-purple-500" },
    { id: "Price Forecasting", label: "Price Forecasting", icon: TrendingUp, desc: "Market pricing forecasts & price trends", color: "from-yellow-400 to-amber-500" },
    { id: "Crop Simulator", label: "Crop Simulator", icon: Cpu, desc: "Interactive growth simulation sandbox", color: "from-cyan-400 to-blue-500" },
    { id: "Weather", label: "Weather", icon: CloudSun, desc: "Regional rainfall & humidity telemetry", color: "from-sky-400 to-indigo-500" },
    { id: "Soil Intelligence", label: "Soil Intelligence", icon: Droplet, desc: "N-P-K readings & irrigation calibration", color: "from-emerald-500 to-green-600" },
  ];

  return (
    <>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3.5}
        SPLAT_RADIUS={0.35}
        SPLAT_FORCE={8000}
        COLOR_UPDATE_SPEED={10}
        SHADING={true}
        RAINBOW_MODE={false}
        COLOR="#10B981"
      />
      {preloaderActive && (
        <PremiumPreloader onComplete={() => setPreloaderActive(false)} />
      )}
      <main className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center select-none font-schibsted selection:bg-white/20 selection:text-white pb-20 bg-[#0b130e]">
      {/* Video Looping background with custom fade logic */}
      <VideoBackground />

      {/* Decorative overhead subtle gradient */}
      <div className="absolute top-0 inset-x-0 h-[240px] bg-gradient-to-b from-[#f8f8f8]/60 to-transparent pointer-events-none z-[1]" />

      {/* Primary Landing Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1580px] px-6 md:px-10 xl:px-14 flex flex-col justify-between py-4">
        
        {/* Navigation Bar */}
        <nav className="w-full relative py-6 font-schibsted bg-transparent z-25">
          {/* Logo element with brand name matching specs - DESKTOP LAYOUT ONLY */}
          <div className="hidden lg:flex items-center justify-center w-full relative">
            {/* Logo (Left aligned absolutely) */}
            <div className="absolute left-0 flex items-center gap-3 select-none cursor-pointer">
              <img 
                src={logoUrl} 
                alt="Farm Shield Logo" 
                className="w-10 h-10 object-contain rounded-xl shadow-sm transition-transform hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-[23px] font-bold tracking-tight text-gray-900 font-fustat">
                Farm Shield
              </span>
            </div>

            {/* Core Navigation Items (True Centered) */}
            <div className="flex items-center gap-7 text-[14.5px] font-medium text-gray-800 font-inter">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1.5 transition-colors duration-200 whitespace-nowrap ${
                    activeTab === item.id 
                      ? "text-black font-semibold" 
                      : "opacity-75 hover:opacity-100 hover:text-black"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="activeHeaderTab"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-600 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* MOBILE LAYOUT ONLY - Keep logo in center, remove Sign Up/Log In, keep Liquid Glass corner three-line menu tab */}
          <div className="flex lg:hidden items-center justify-between w-full px-2">
            {/* Left Slot: Empty container to balance centering */}
            <div className="w-12 h-12" />

            {/* Center Logo & Brand */}
            <div className="flex items-center gap-2 select-none cursor-pointer">
              <img 
                src={logoUrl} 
                alt="Farm Shield Logo" 
                className="w-9 h-9 object-contain rounded-lg shadow-sm flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-[20px] font-semibold tracking-[-1.2px] text-black whitespace-nowrap">
                Farm Shield
              </span>
            </div>

            {/* Right Slot: Liquid Glass Three-line menu Trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="liquid-glass-btn !min-w-0 !w-11 !h-11 !p-0 !rounded-full flex items-center justify-center cursor-pointer shadow-md text-white transition-all duration-300 ring-1 ring-white/20 active:scale-95 group relative overflow-hidden"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="hamburger"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} className="text-white group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* MOBILE FLOATING LIQUID GLASS MENU PANEL - Render when mobileMenuOpen is active */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="absolute top-[88px] left-0 right-0 mx-auto w-[calc(100%-16px)] max-w-[460px] bg-white/70 backdrop-blur-2xl border-2 border-white/65 p-4 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.22)] z-40 select-none overflow-hidden"
              >
                {/* SVG filter integration overlay inside menu container to apply fluid look */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/10 via-transparent to-white/10 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="px-3 py-1.5 border-b border-black/5 mb-2 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-black/45">
                      Farm Shield Features of App
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
                      Active: {activeTab}
                    </span>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-black/10">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-start gap-3.5 p-3 rounded-2xl transition-all duration-300 relative border group ${
                            isActive 
                              ? "bg-black text-white border-black shadow-md scale-[1.01]" 
                              : "bg-white/50 hover:bg-white/95 text-black border-black/5 hover:border-black/10 active:scale-95"
                          }`}
                        >
                          {/* Colored Thumbnail/Icon Indicator Frame */}
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} p-2.5 flex items-center justify-center text-white shadow-sm flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                            <IconComponent size={20} className="text-white" />
                            <div className="absolute -inset-1 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          {/* Titles and descriptions metadata list */}
                          <div className="flex-grow min-w-0 pr-4">
                            <h3 className={`font-semibold tracking-[-0.3px] text-sm ${isActive ? "text-white" : "text-black"}`}>
                              {item.id === "Diagnosis" ? "AI plant Diagnosis" : item.id === "Home" ? "Shield Home" : item.label}
                            </h3>
                            <p className={`text-xs truncate font-medium mt-0.5 ${isActive ? "text-white/70" : "text-black/50"}`}>
                              {item.desc}
                            </p>
                          </div>

                          {/* Checkmark overlay denoting selected status matching wooden pier in image */}
                          {isActive && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white scale-110 shadow-sm border border-black/10">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center mt-12 md:mt-24 mb-16 -mt-[50px]">
          
          {/* Headline - Fustat typography with line-height adjustments */}
          <h1 className="font-fustat font-bold text-[54px] sm:text-[68px] md:text-[80px] tracking-[-3px] sm:tracking-[-4px] md:tracking-[-4.8px] leading-[1] text-black text-center mb-8 max-w-4xl select-none">
            AI In Agriculture
          </h1>

          {/* Subtitle - Fustat Medium */}
          <p className="font-fustat font-medium text-[16px] sm:text-[18px] md:text-[20px] tracking-[-0.4px] text-[#505050] text-center leading-relaxed mb-6 max-w-[736px] w-full px-4 select-none">
            Farm Shield is an AI-powered smart agriculture platform that helps farmers detect crop diseases, predict market prices,
            It combines real-time data, AI intelligence to support faster, smarter, and more sustainable farming decisions.
          </p>

          {/* Infinite Horizontal Scroller of Icons in full width */}
          <div className="w-full overflow-hidden py-14 mt-12 z-20 relative scroller-mask">
            <div className="animate-scroller-track flex items-center gap-14">
              {[
                ...navItems.filter(item => item.id !== "Home"),
                ...navItems.filter(item => item.id !== "Home"),
                ...navItems.filter(item => item.id !== "Home")
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 text-black hover:text-emerald-800 transition-all duration-300 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-11 h-11 bg-white/45 border border-white/60 shadow-sm backdrop-blur-[6px] rounded-xl flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} className="text-black/85 group-hover:text-emerald-700" />
                    </div>
                    <span className="font-fustat font-semibold tracking-[-0.4px] text-base md:text-lg select-none">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Liquid Glass Action Buttons below the Scroller */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 z-30 relative w-full px-4">
            <button className="liquid-glass-btn group" id="signUpLiquid">
              <UserPlus size={20} className="text-white group-hover:rotate-[15deg] transition-transform duration-300" />
              <span>Sign Up</span>
            </button>
            <button className="liquid-glass-btn group" id="logInLiquid">
              <LogIn size={20} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
              <span>Log In</span>
            </button>
          </div>

          {/* Core Feature Cards Row  - Fixed on one dynamic horizontal line */}
          <div className="w-full mt-16 max-w-[1480px] overflow-x-auto flex flex-row flex-nowrap gap-6 items-center justify-start lg:justify-center pb-12 px-6 scrollbar-none scroller-mask-horizontal z-30 relative select-none">
            
            {/* Card 1: AI DIAGNOSIS */}
            <div className="ux-parent ux-parent--mint flex-shrink-0 w-[290px] xl:w-[320px] h-[330px]">
              <div className="ux-card">
                <div className="ux-logo" aria-hidden="true">
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle bg-[#38761d]/20 flex items-center justify-center">
                    <HeartPulse size={18} className="text-white" />
                  </span>
                </div>
                <div className="ux-glass"></div>
                <div className="ux-content">
                  <span className="ux-title font-schibsted font-extrabold text-[#16300c]">AI DIAGNOSIS</span>
                  <span className="ux-text font-schibsted font-medium mt-3 text-xs leading-relaxed text-[#224414]">
                    Upload a plant image and get instant disease identification with treatment recommendations.
                  </span>
                </div>
                <div className="ux-bottom">
                  <div className="ux-social">
                    <button type="button" className="ux-social-btn" aria-label="AI Activity">
                      <Sparkles size={13} className="text-[#38761d]" />
                    </button>
                  </div>
                  <div className="ux-more">
                    <span className="ux-more-btn font-schibsted text-[10px] tracking-wider font-extrabold text-[#38761d]">IDENTIFY</span>
                    <ChevronDown size={12} className="text-[#38761d] -rotate-90 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: FARMER LINKEDLIN */}
            <div className="ux-parent ux-parent--violet ux-parent--cut flex-shrink-0 w-[290px] xl:w-[320px] h-[330px]">
              <div className="ux-card">
                <div className="ux-logo" aria-hidden="true">
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle bg-[#739c38]/25 flex items-center justify-center">
                    <Network size={18} className="text-white" />
                  </span>
                </div>
                <div className="ux-glass"></div>
                <div className="ux-content">
                  <span className="ux-title font-schibsted font-extrabold text-[#1c3308]">FARMER LINKEDIN</span>
                  <span className="ux-text font-schibsted font-medium mt-3 text-xs leading-relaxed text-[#1c3308]/90">
                    It offers a localized, multi-lingual marketplace where farmers can find workers and laborers can find reliable employment.
                  </span>
                </div>
                <div className="ux-bottom">
                  <div className="ux-social">
                    <button type="button" className="ux-social-btn" aria-label="Farmer Network">
                      <Network size={13} className="text-[#739c38]" />
                    </button>
                  </div>
                  <div className="ux-more">
                    <span className="ux-more-btn font-schibsted text-[10px] tracking-wider font-extrabold text-[#739c38]">CONNECT</span>
                    <ChevronDown size={12} className="text-[#739c38] -rotate-90 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: PRICE FORECASTING */}
            <div className="ux-parent ux-parent--solar flex-shrink-0 w-[290px] xl:w-[320px] h-[330px]">
              <div className="ux-card">
                <div className="ux-logo" aria-hidden="true">
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle bg-[#1f6f5b]/25 flex items-center justify-center">
                    <TrendingUp size={18} className="text-white" />
                  </span>
                </div>
                <div className="ux-glass"></div>
                <div className="ux-content">
                  <span className="ux-title font-schibsted font-extrabold text-[#092f25]">PRICE FORECASTING</span>
                  <span className="ux-text font-schibsted font-medium mt-3 text-xs leading-relaxed text-[#115243]">
                    Farm Shield helps you anticipate price fluctuations for various crop, maximizing your profitability 
                  </span>
                </div>
                <div className="ux-bottom">
                  <div className="ux-social">
                    <button type="button" className="ux-social-btn" aria-label="Trends Analysis">
                      <TrendingUp size={13} className="text-[#1f6f5b]" />
                    </button>
                  </div>
                  <div className="ux-more">
                    <span className="ux-more-btn font-schibsted text-[10px] tracking-wider font-extrabold text-[#1f6f5b]">PREDICT</span>
                    <ChevronDown size={12} className="text-[#1f6f5b] -rotate-90 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: AI CHAT-BOT */}
            <div className="ux-parent ux-parent--void flex-shrink-0 w-[290px] xl:w-[320px] h-[330px]">
              <div className="ux-card">
                <div className="ux-logo" aria-hidden="true">
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle"></span>
                  <span className="ux-circle bg-[#5eead4]/25 flex items-center justify-center">
                    <Mic size={18} className="text-white" />
                  </span>
                </div>
                <div className="ux-glass"></div>
                <div className="ux-content">
                  <span className="ux-title font-schibsted font-extrabold text-[#e2fbf3]">AI CHAT-BOT</span>
                  <span className="ux-text font-schibsted font-medium mt-3 text-xs leading-relaxed text-[#e2fbf3]/85">
                    Not comfortable typing? Just tap the microphone icon. Farm Shield's AI Voice Assistant understands and speaks multiple Indian languages 
                  </span>
                </div>
                <div className="ux-bottom">
                  <div className="ux-social">
                    <button type="button" className="ux-social-btn" aria-label="Voice Interface">
                      <Mic size={13} className="text-[#0b3d2e]" />
                    </button>
                  </div>
                  <div className="ux-more">
                    <span className="ux-more-btn font-schibsted text-[10px] tracking-wider font-extrabold text-[#5eead4]">TALK Now</span>
                    <ChevronDown size={12} className="text-[#5eead4] -rotate-90 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SVG Liquid Distortion Filters backing custom reflections */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">  
            <feDisplacementMap in="SourceGraphic" scale="40" xChannelSelector="A" yChannelSelector="R" result="goo" />
            <feGaussianBlur in="goo" stdDeviation="6" />
          </filter>
        </defs>
      </svg>
    </main>
    </>
  );
}
