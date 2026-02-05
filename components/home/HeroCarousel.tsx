// components/home/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://res.cloudinary.com/mathsoncloudinary/image/upload/v1770248855/Entreprise_zida_solaire_a3u1ug.jpg",
    title: "L'énergie solaire pour tous au Burkina Faso",
    subtitle: "Installation, vente et maintenance de systèmes solaires photovoltaïques",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/mathsoncloudinary/image/upload/v1770248855/Installations_inverter_batterie_lithium_smp47x.jpg",
    title: "Inverters & Batteries Lithium",
    subtitle: "Solutions complètes pour particuliers et entreprises",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/mathsoncloudinary/image/upload/v1770248854/Installations_pannaux_fhy6uy.jpg",
    title: "Installation de Panneaux Solaires",
    subtitle: "Expertise professionnelle garantie",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/mathsoncloudinary/image/upload/v1770248854/Installations_batteries_gel_kt3tzq.jpg",
    title: "Batteries Gel Haute Performance",
    subtitle: "Stockage fiable et durable pour vos besoins énergétiques",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[520px] w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 sm:h-[600px] lg:h-[650px] xl:h-[700px]">
      {/* Images avec transition */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
            quality={90}
          />
          {/* Overlay gradient pour meilleure lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        </div>
      ))}

      {/* Contenu texte */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl">
            <h1 className="animate-fade-in text-3xl font-bold leading-tight text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
              {slides[currentSlide].title}
            </h1>
            <p className="animate-fade-in-delay mt-4 text-base text-white/95 drop-shadow-lg sm:text-lg md:mt-6 md:text-xl">
              {slides[currentSlide].subtitle}
            </p>
            
            {/* BOUTONS - VERT CLAIR + Blanc transparent */}
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4 md:mt-10">
              <Link
                href="/produits"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-base font-bold text-slate-900 shadow-2xl transition-all hover:scale-105 hover:bg-emerald-500 hover:shadow-xl sm:px-8 sm:py-4"
              >
                Voir nos produits →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:px-8 sm:py-4"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-md transition-all hover:bg-white/20 sm:left-4 sm:p-3 lg:p-4"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-md transition-all hover:bg-white/20 sm:right-4 sm:p-3 lg:p-4"
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
      </button>

      {/* Indicateurs (dots) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all sm:h-2.5 ${
              index === currentSlide
                ? "w-8 bg-orange-500 sm:w-10"
                : "w-2 bg-white/60 hover:bg-white/90 sm:w-2.5"
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
