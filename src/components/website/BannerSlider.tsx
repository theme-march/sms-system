"use client";
import React, { useCallback, useEffect, useState } from "react";
type Banner = {
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
  buttonHref?: string;
};
export function BannerSlider({
  banners,
  fallbackTitle,
}: {
  banners: Banner[];
  fallbackTitle: string;
}) {
  const [active, setActive] = useState(0);
  const changeSlide = useCallback(
    (next: number | ((current: number) => number)) => setActive(next),
    [],
  );
  useEffect(() => {
    banners.forEach((banner) => {
      const image = new Image();
      image.src = banner.image;
    });
    if (banners.length < 2) return;
    const id = setInterval(
      () => changeSlide((v) => (v + 1) % banners.length),
      5500,
    );
    return () => clearInterval(id);
  }, [banners, changeSlide]);
  const slide = banners[active] || banners[0];
  return (
    <header
      className="school-hero"
      style={{
        backgroundImage: `url(${slide.image})`,
        overflowAnchor: "none",
        contain: "layout paint",
      }}
    >
      <div className="school-title">
        <h1>{slide.title || fallbackTitle}</h1>
        <p>{slide.subtitle}</p>
        {slide.buttonText && (
          <a className="slider-button" href={slide.buttonHref || "/"}>
            {slide.buttonText}
          </a>
        )}
      </div>
      {banners.length > 1 && (
        <>
          <div className="slider-dots">
            {banners.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => changeSlide(i)}
                className={i === active ? "active" : ""}
                aria-label={`স্লাইড ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="slider-arrow prev"
            onClick={() =>
              changeSlide((v) => (v - 1 + banners.length) % banners.length)
            }
            aria-label="আগের স্লাইড"
          >
            ‹
          </button>
          <button
            type="button"
            className="slider-arrow next"
            onClick={() => changeSlide((v) => (v + 1) % banners.length)}
            aria-label="পরের স্লাইড"
          >
            ›
          </button>
        </>
      )}
    </header>
  );
}
