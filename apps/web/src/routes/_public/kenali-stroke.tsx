import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import "./kenali-stroke.css";

export const Route = createFileRoute("/_public/kenali-stroke")({
  component: KenaliStroke,
});

function KenaliStroke() {
  const containerRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const torsoRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const armLRef = useRef<HTMLDivElement>(null);
  const armRRef = useRef<HTMLDivElement>(null);
  const legLRef = useRef<HTMLDivElement>(null);
  const legRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("kenali-body-transition");

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sceneId = entry.target.getAttribute("data-scene");
          activateScene(sceneId || "1");

          const cards = document.querySelectorAll(".editorial-text-card");
          cards.forEach((card) => card.classList.remove("active"));
          const targetCard = entry.target.querySelector(".editorial-text-card");
          if (targetCard) {
            targetCard.classList.add("active");
          }
        }
      });
    }, observerOptions);

    const scenes = document.querySelectorAll(".scene-trigger");
    scenes.forEach((scene) => observer.observe(scene));

    return () => {
      document.body.classList.remove("kenali-body-transition");
      document.body.style.backgroundColor = "";
      observer.disconnect();
    };
  }, []);

  const activateScene = (id: string) => {
    if (
      !figureRef.current ||
      !headRef.current ||
      !mouthRef.current ||
      !armLRef.current ||
      !armRRef.current ||
      !legLRef.current ||
      !legRRef.current
    ) {
      return;
    }

    figureRef.current.style.transform = "rotate(0deg) translateY(0)";
    figureRef.current.style.opacity = "1";
    headRef.current.style.transform = "translateX(-50%) rotate(0deg)";
    mouthRef.current.style.opacity = "0";
    mouthRef.current.style.transform = "translateX(-50%) scale(1)";
    armLRef.current.style.transform = "translateX(-50%) rotate(25deg)";
    armRRef.current.style.transform = "translateX(-50%) rotate(-25deg)";
    legLRef.current.style.transform = "translateX(-50%) rotate(15deg)";
    legRRef.current.style.transform = "translateX(-50%) rotate(-15deg)";

    const parts = document.querySelectorAll<HTMLElement>(".stick-part");
    parts.forEach((p) => {
      p.style.backgroundColor = "#161d1f";
    });
    headRef.current.style.borderColor = "#161d1f";

    switch (id) {
      case "1":
        document.body.style.backgroundColor = "#f4fafd";
        break;
      case "2":
        document.body.style.backgroundColor = "#e8eff1";
        headRef.current.style.transform = "translateX(-50%) rotate(15deg)";
        armRRef.current.style.transform = "translateX(-50%) rotate(-140deg) translateY(10px)";
        break;
      case "3":
        document.body.style.backgroundColor = "#dde4e6";
        mouthRef.current.style.opacity = "1";
        mouthRef.current.style.height = "6px";
        mouthRef.current.style.borderRadius = "50%";
        mouthRef.current.style.transform = "translateX(-50%) skewX(20deg)";
        headRef.current.style.transform = "translateX(-50%) rotate(-5deg)";
        break;
      case "4":
        document.body.style.backgroundColor = "#d4dbdd";
        armRRef.current.style.transform = "translateX(-50%) rotate(5deg)";
        armLRef.current.style.transform = "translateX(-50%) rotate(45deg)";
        figureRef.current.style.transform = "rotate(2deg)";
        break;
      case "5":
        document.body.style.backgroundColor = "#c8ced0";
        figureRef.current.style.transform = "rotate(-12deg) translateX(-15px)";
        legLRef.current.style.transform = "translateX(-50%) rotate(45deg)";
        legRRef.current.style.transform = "translateX(-50%) rotate(-10deg)";
        armLRef.current.style.transform = "translateX(-50%) rotate(-60deg)";
        break;
      case "6":
        document.body.style.backgroundColor = "#ba1a1a";
        parts.forEach((p) => {
          p.style.backgroundColor = "#ffffff";
        });
        headRef.current.style.borderColor = "#ffffff";
        figureRef.current.style.transform = "translateY(160px) rotate(-90deg)";
        armLRef.current.style.transform = "translateX(-50%) rotate(10deg)";
        armRRef.current.style.transform = "translateX(-50%) rotate(-10deg)";
        break;
      case "7":
        figureRef.current.style.opacity = "0";
        break;
    }
  };

  return (
    <main className="relative overflow-x-hidden" ref={containerRef}>
      <div className="sticky-character-container pointer-events-none z-0">
        <div className="stick-figure" ref={figureRef}>
          <div className="stick-part stick-head" ref={headRef}>
            <div className="stick-mouth" ref={mouthRef} />
          </div>
          <div className="stick-part stick-torso" ref={torsoRef} />
          <div className="stick-part stick-arm" ref={armLRef} style={{ transform: "translateX(-50%) rotate(25deg)" }} />
          <div className="stick-part stick-arm" ref={armRRef} style={{ transform: "translateX(-50%) rotate(-25deg)" }} />
          <div className="stick-part stick-leg" ref={legLRef} style={{ transform: "translateX(-50%) rotate(15deg)" }} />
          <div className="stick-part stick-leg" ref={legRRef} style={{ transform: "translateX(-50%) rotate(-15deg)" }} />
        </div>
      </div>

      <section className="scene-trigger" data-scene="1">
        <div className="editorial-text-card bg-surface/40 backdrop-blur-sm p-stack-md rounded-xl border border-outline-variant/20 shadow-sm active">
          <span className="font-label-caps text-label-caps text-secondary mb-unit block">TAHAP AWAL</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Stroke sering dimulai dengan gejala yang terlihat ringan</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Seringkali diabaikan karena dianggap kelelahan biasa. Kewaspadaan dini adalah kunci keselamatan.</p>
        </div>
      </section>

      <section className="scene-trigger" data-scene="2">
        <div className="editorial-text-card bg-surface/40 backdrop-blur-sm p-stack-md rounded-xl border border-outline-variant/20 shadow-sm">
          <span className="font-label-caps text-label-caps text-secondary mb-unit block">KOGNITIF</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Kesulitan memahami percakapan sederhana</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Otak mulai mengalami disrupsi aliran darah, menghambat pemrosesan bahasa dan logika dasar.</p>
        </div>
      </section>

      <section className="scene-trigger" data-scene="3">
        <div className="editorial-text-card bg-surface/40 backdrop-blur-sm p-stack-md rounded-xl border border-outline-variant/20 shadow-sm">
          <span className="font-label-caps text-label-caps text-secondary mb-unit block">ARTIKULASI</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Ucapan menjadi tidak jelas atau terdengar pelo</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Otot wajah melemah. Cobalah meminta mereka mengucap kalimat sederhana; perhatikan kejelasan suaranya.</p>
        </div>
      </section>

      <section className="scene-trigger" data-scene="4">
        <div className="editorial-text-card bg-surface/40 backdrop-blur-sm p-stack-md rounded-xl border border-outline-variant/20 shadow-sm">
          <span className="font-label-caps text-label-caps text-secondary mb-unit block">MOTORIK HALUS</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Kesulitan mengangkat satu sisi tubuh</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Kelumpuhan sesaat atau kelemahan drastis pada satu lengan atau kaki merupakan tanda bahaya utama.</p>
        </div>
      </section>

      <section className="scene-trigger" data-scene="5">
        <div className="editorial-text-card bg-surface/40 backdrop-blur-sm p-stack-md rounded-xl border border-outline-variant/20 shadow-sm">
          <span className="font-label-caps text-label-caps text-secondary mb-unit block">KESEIMBANGAN</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Kesulitan berjalan atau koordinasi tubuh menurun</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Sensasi limbung yang tiba-tiba. Dunia seakan berputar, dan langkah kaki menjadi tidak sinkron.</p>
        </div>
      </section>

      <section className="scene-trigger" data-scene="6">
        <div className="editorial-text-card bg-surface-container-highest/90 p-stack-md rounded-xl border border-primary/20 shadow-lg">
          <span className="font-label-caps text-label-caps text-primary font-bold mb-unit block">GOLDEN HOUR</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight">Setiap menit sangat berarti.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Penanganan yang terlambat dapat meningkatkan risiko kerusakan permanen pada jaringan otak.</p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-primary text-on-primary text-center px-gutter relative z-20 scene-trigger" data-scene="7">
        <div className="max-w-[800px] animate-fade-up">
          <h1 className="font-display text-display mb-stack-md">Jangan tunggu gejala memburuk</h1>
          <p className="font-body-lg text-body-lg mb-section-gap opacity-90">Deteksi dini adalah perlindungan terbaik bagi Anda dan orang yang Anda cintai. Gunakan AI kami untuk memantau risiko secara presisi.</p>
          <div className="flex flex-col md:flex-row gap-stack-md justify-center">
            <button className="px-10 py-4 bg-on-primary text-primary rounded-full font-headline-md text-headline-md font-bold shadow-xl hover:scale-105 transition-transform">
              Pelajari Risiko Anda
            </button>
            <button className="px-10 py-4 border border-on-primary/30 text-on-primary rounded-full font-headline-md text-headline-md font-medium hover:bg-on-primary/10 transition-colors">
              Hubungi Layanan Darurat
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
