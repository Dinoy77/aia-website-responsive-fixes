
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base-url";
import OptimizedImage from "@/components/common/optmized-image";

export default function HomeHero({ slug, bottombar = false }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [slug],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/getBanner/${slug}`, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (!data?.data || !data?.image_url) return;

    const bannerImageUrlObj = data.image_url.find(
      (item) => item.image_for === "Banner",
    );
    const baseImageUrl = bannerImageUrlObj?.image_url || "";

    const slides = data.data.map((banner, index) => ({
      id: index + 1,
      imageUrl: `${baseImageUrl}${banner.banner_image}`,
      link: banner.banner_link,
      alt: banner.banner_image_alt,
    }));

    const announcementsData = data.data.map((banner, index) => ({
      id: index + 1,
      title: banner.banner_text,
      subtext: banner.banner_sub_text,
      link: banner.banner_link,
    }));

    setCarouselSlides(slides);
    setAnnouncements(announcementsData);
  }, [data]);

  const nextSlide = useCallback(() => {
    if (carouselSlides.length > 0)
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }, [carouselSlides.length]);

  const prevSlide = () => {
    if (carouselSlides.length > 0)
      setCurrentSlide(
        (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length,
      );
  };

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    if (!isAutoPlaying || carouselSlides.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length, nextSlide]);

  if (isLoading) {
    return (

      <section className="relative">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "16/5" }}
        >
          <div className="absolute inset-0 bg-gray-200 shimmer" />
        </div>

        {bottombar && (
          <>

            <div
              className="hidden lg:block"
              style={{ height: 44 }}
              aria-hidden="true"
            />

            {/* The actual skeleton bottombar — matches real bottombar structure */}
            <div className="lg:absolute lg:w-[500px] lg:bottom-0 lg:left-5 lg:z-20 lg:translate-y-1/2">
              {/* Orange gradient bar */}
              <div className="h-[3px] bg-gray-300 animate-pulse" />

              {/* Card body */}
              <div className="bg-gray-200 shimmer">
                {/* Row 1: accent bar + text lines + CTA button */}
                <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                  <div className="shrink-0 w-[3px] h-14 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                  </div>
                  <div className="w-20 h-7 bg-gray-300 rounded shrink-0" />
                </div>

                {/* Row 2: counter + dots + arrows */}
                <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-300/30 pt-2">
                  <div className="w-10 h-2.5 bg-gray-300 rounded" />
                  <div className="flex items-center gap-2">
                    {/* Fixed-width dot containers — matches the real dots fix */}
                    <div className="w-4 h-[3px] bg-gray-300 rounded-full" />
                    <div className="w-4 h-[3px] bg-gray-300 rounded-full" />
                    <div className="w-4 h-[3px] bg-gray-300 rounded-full" />
                  </div>
                  <div className="flex gap-0.5">
                    <div className="w-6 h-6 bg-gray-300 rounded" />
                    <div className="w-6 h-6 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative h-[420px] bg-red-50 flex items-center justify-center">
        <span className="text-xs text-red-400 font-medium">
          Failed to load banners: {error?.message}
        </span>
      </section>
    );
  }

  if (carouselSlides.length === 0) {
    return (
      <section className="relative h-[420px] bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400 font-medium">
          No banners available
        </span>
      </section>
    );
  }

  const current = announcements[currentSlide];

  return (
    <section className="relative">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative w-full" style={{ aspectRatio: "11/5" }}>
          {carouselSlides.map((slide, index) => (
            <a
              key={slide.id}
              href={slide.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <OptimizedImage
                src={slide.imageUrl}
                alt={slide.alt}
                priority={index === 0}
                sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1600px"
                width={1600}
                height={727}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/1200x400?text=Banner";
                }}
              />
            </a>
          ))}

          {carouselSlides.length > 1 &&
            [
              {
                dir: "prev",
                Icon: ChevronLeft,
                onClick: prevSlide,
                side: "left-4",
              },
              {
                dir: "next",
                Icon: ChevronRight,
                onClick: nextSlide,
                side: "right-4",
              },
            ].map(({ dir, Icon, onClick, side }) => (
              <button
                key={dir}
                onClick={onClick}
                aria-label={`${dir === "prev" ? "Previous" : "Next"} slide`}
                className={`absolute ${side} top-1/2 -translate-y-1/2 z-20
                w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                rounded-full bg-black/25 hover:bg-black/55
                text-white backdrop-blur-sm border border-white/10
                transition-all duration-200 hover:scale-105 active:scale-95`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            ))}
        </div>
      </div>

      {current != null && bottombar && (
        <div className="lg:absolute lg:w-[500px] lg:bottom-0 lg:left-5 lg:z-20 lg:translate-y-1/2">
          <div className="h-[3px] bg-gradient-to-r from-[#F3831C] via-[#F3831C]/70 to-transparent" />

          <div className="bg-black/85 backdrop-blur-md border border-t-0 border-white/10">
            {/* Row 1 — Text + CTA */}
            <div className="px-4 pt-3.5 pb-2.5 flex items-start gap-3">
              <div className="shrink-0 w-[3px] self-stretch bg-gradient-to-b from-[#F3831C] to-[#F3831C]/20 rounded-full" />

              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white leading-snug">
                  {current.title}
                </p>
                {current.subtext && (
                  <p className="text-[11.5px] text-white/50 mt-1 leading-snug font-normal">
                    {current.subtext}
                  </p>
                )}
              </div>

              <a
                href={current.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5
                  text-[10.5px] font-bold uppercase tracking-widest
                  text-white bg-[#F3831C] hover:bg-[#e07318] active:bg-[#c96510]
                  transition-colors duration-150 whitespace-nowrap self-start"
              >
                Know More.
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            <div className="px-4 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
              <span className="text-[10px] font-mono text-white/25 tracking-widest uppercase">
                {String(currentSlide + 1).padStart(2, "0")} /{" "}
                {String(announcements.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-2">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="w-3 h-[2px] flex items-center justify-start overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    <span
                      className="h-full transition-all duration-300"
                      style={{
                        width: index === currentSlide ? "100%" : "0%",
                        background: "#F3831C",
                      }}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-6 h-6 flex items-center justify-center
                    text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-6 h-6 flex items-center justify-center
                    text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
