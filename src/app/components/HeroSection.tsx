"use client";

import { useEffect, useState } from "react";

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const HEADING_TEXT = "Mobile's Official\nBusiness License Portal";
const CHAR_DELAY = 30;
const INITIAL_DELAY = 200;

interface FadeInProps {
  children: React.ReactNode;
  delay: number;
  duration?: number;
  className?: string;
}

function FadeIn({ children, delay, duration = 1000, className = "" }: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedHeading({ text }: { text: string }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split("\n");

  return (
    <h1
      className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white"
      style={{ letterSpacing: "-0.04em" }}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split("").map((char, charIndex) => {
            const delay =
              lineIndex * line.length * CHAR_DELAY + charIndex * CHAR_DELAY;
            return (
              <span
                key={charIndex}
                className="inline-block"
                style={{
                  opacity: animated ? 1 : 0,
                  transform: animated ? "translateX(0)" : "translateX(-18px)",
                  transition: `opacity 500ms, transform 500ms`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {char === " " ? " " : char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function HeroSection() {
  const videoUrl =
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
    "/media/hero.mp4";

  const posterUrl = "/Gemini_Generated_Image_heif74heif74heif.png";
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col overflow-hidden bg-black">
      {/* Poster shown until video can play */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: videoReady ? 0 : 1,
          transition: "opacity 350ms ease",
        }}
        aria-hidden="true"
      />

      {/* Video background - no overlays */}
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={posterUrl}
        onCanPlay={() => setVideoReady(true)}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={DEFAULT_VIDEO_URL} type="video/mp4" />
      </video>

      {/* Content layer */}
      <div
        className="relative z-10 flex flex-col h-full px-6 md:px-12 lg:px-16"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      >
        {/* Navbar */}
        <div className="pt-6">
          <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
            {/* Logo */}
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-white">City of Mobile</span>
              <span className="text-xs font-normal text-gray-300">Alabama</span>
            </div>

            {/* Center links */}
            <div className="hidden md:flex items-center gap-8">
              {["Home", "How It Works", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white transition-colors duration-200 hover:text-gray-300"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* CTA button */}
            <a href="/login" className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100">
              Sign In
            </a>
          </nav>
        </div>

        {/* Hero content pushed to bottom */}
        <div className="flex-1 flex flex-col justify-end pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            {/* Left column */}
            <div>
              <AnimatedHeading text={HEADING_TEXT} />

              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-5">
                  Apply for your City of Mobile business license online — fast, secure, and paperless.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <a href="/login" className="bg-white text-black px-8 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-100">
                    Sign In
                  </a>
                  <a href="/login?tab=register" className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-white hover:text-black">
                    Create Account
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right column - tag */}
            <FadeIn
              delay={1400}
              duration={1000}
              className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0"
            >
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <p className="text-lg md:text-xl lg:text-2xl font-light text-white">
                  Secure · Official · Paperless
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
