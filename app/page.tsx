"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CarouselShell, { SlideEntry } from "@/components/carousel/CarouselShell";
import { SLIDES } from "@/lib/slides.config";
import HeroSlide from "@/components/slides/HeroSlide";
import WhySlide from "@/components/slides/WhySlide";
import RetailSlide from "@/components/slides/RetailSlide";
import LuxurySlide from "@/components/slides/LuxurySlide";
import DiningSlide from "@/components/slides/DiningSlide";
import EntertainmentSlide from "@/components/slides/EntertainmentSlide";
import EventsSlide from "@/components/slides/EventsSlide";
import CTASlide from "@/components/slides/CTASlide";
import LoadingScreen from "@/components/deck/LoadingScreen";
import GrainOverlay from "@/components/deck/GrainOverlay";

// Cursor is desktop-only; skip on touch devices
const CustomCursor = dynamic(() => import("@/components/deck/CustomCursor"), {
  ssr: false,
});

const SLIDE_COMPONENTS: Record<string, React.ComponentType<{ isActive: boolean }>> = {
  hero:          HeroSlide,
  why:           WhySlide,
  retail:        RetailSlide,
  luxury:        LuxurySlide,
  dining:        DiningSlide,
  entertainment: EntertainmentSlide,
  events:        EventsSlide,
  cta:           CTASlide,
};

const slides: SlideEntry[] = SLIDES.map(s => ({
  ...s,
  component: SLIDE_COMPONENTS[s.id],
}));

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <GrainOverlay />
      <CustomCursor />

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
          cursor: "none",
        }}
      >
        <CarouselShell slides={slides} />
      </div>
    </>
  );
}
