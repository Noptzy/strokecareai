import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero section animations
    gsap.from(".hero-content > *", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    });

    gsap.from(".hero-image", {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
    });

    // Scroll-triggered animations for sections
    const sections = gsap.utils.toArray<HTMLElement>(".fade-up-section");
    
    sections.forEach((section) => {
      gsap.from(section, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Staggered cards animation
    gsap.from(".feature-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".feature-cards-container",
        start: "top 75%",
      },
    });

    // Staggered steps animation
    gsap.from(".step-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".steps-container",
        start: "top 75%",
      },
    });
  }, { scope: container });

  return (
    <main className="max-w-[1100px] mx-auto px-gutter" ref={container}>
      <section className="py-section-gap flex flex-col md:flex-row items-center gap-12 min-h-[716px]">
        <div className="flex-1 space-y-stack-md hero-content">
          <div className="inline-block bg-primary-container/10 text-primary font-label-caps text-label-caps px-3 py-1 rounded-sm border border-primary/20">
            EDUKASI PENCEGAHAN
          </div>
          <h1 className="font-display text-display leading-tight text-on-surface">
            Kenali Gejala Stroke <br />
            <span className="text-primary italic">Sebelum Terlambat</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px]">
            Pelajari tanda-tanda awal stroke, pahami faktor risiko Anda, dan dapatkan informasi kesehatan yang mudah dipahami.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps tracking-widest hover:shadow-lg transition-all active:scale-95">
              KENALI STROKE
            </button>
            <button className="bg-transparent text-secondary border border-outline-variant px-8 py-4 rounded-full font-label-caps text-label-caps tracking-widest hover:bg-secondary/5 transition-all active:scale-95">
              MASUK
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative hero-image">
          <div className="aspect-square rounded-full overflow-hidden border border-outline-variant/30 editorial-shadow">
            <img
              className="w-full h-full object-cover"
              alt="A cinematic, minimalist photographic portrait of an elderly person with a serene expression."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb_SIa8KwAbTl7hN9KPeaIbdtWeVoW2muKfBwTJ0ZaoX3BSL2pxXmgRnNT_I0HhqBLwCr8ZgAihG6PtDIS6lUJYxiUTh3BUAzRm8JaTd_QLN5ArmM3Q76MiQXc_YSvsApJd0FRhViYQrF5Gcr7CUJI3aa23y4K46pHbjdmgqIlWmQrQGPAH_VOmBQSydeBt1H7BgW69goR6c9Gm4bk87QLL90bS7yDBONfWHg08qtWJqEQLE3s26ziQoi4TRfGbqBf8qjBt-cLgxA"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-xl space-y-2 hidden md:block">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">GOLDEN HOUR</span>
            </div>
            <p className="text-[12px] font-medium max-w-[150px]">Respon cepat dalam 4.5 jam pertama sangat krusial.</p>
          </div>
        </div>
      </section>

      <section className="py-section-gap fade-up-section">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Mengapa Ini Penting?</h2>
          <div className="w-16 h-1 bg-primary mx-auto opacity-20" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-surface-container-low p-10 rounded-xl flex flex-col justify-center border border-outline-variant/10">
            <div className="text-primary mb-6">
              <span className="material-symbols-outlined text-[48px]">emergency_home</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">Waktu Adalah Otak</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Setiap menit stroke tidak tertangani, jutaan sel otak mati. Kesadaran akan gejala awal bukan sekadar pengetahuan—ini adalah alat penyelamat nyawa yang paling efektif.
            </p>
          </div>
          <div className="bg-on-secondary-fixed text-on-primary-container p-10 rounded-xl flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md mb-4">Pemulihan yang Bermakna</h3>
              <p className="font-body-md text-body-md opacity-80 leading-relaxed">
                Penanganan medis dini meningkatkan peluang pemulihan fungsional hingga 3x lipat. Kami hadir untuk membantu Anda memahami langkah-langkah kritis tersebut sebelum krisis terjadi.
              </p>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 100" }}>
                favorite
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-gap">
        <div className="grid md:grid-cols-4 gap-6 feature-cards-container">
          <div className="glass-card p-8 group hover:bg-primary transition-all duration-500 cursor-pointer rounded-xl feature-card">
            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors mb-6 text-[32px]">visibility</span>
            <h4 className="font-headline-md text-[20px] mb-3 group-hover:text-white transition-colors">Memahami gejala awal</h4>
            <p className="font-caption text-caption text-on-surface-variant group-hover:text-white/80 transition-colors">Identifikasi metode F.A.S.T untuk deteksi dini gejala yang sering terabaikan.</p>
          </div>
          <div className="glass-card p-8 group hover:bg-primary transition-all duration-500 cursor-pointer rounded-xl feature-card">
            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors mb-6 text-[32px]">analytics</span>
            <h4 className="font-headline-md text-[20px] mb-3 group-hover:text-white transition-colors">Mengenali faktor risiko</h4>
            <p className="font-caption text-caption text-on-surface-variant group-hover:text-white/80 transition-colors">Cek gaya hidup dan riwayat medis yang mempengaruhi risiko kesehatan pembuluh darah.</p>
          </div>
          <div className="glass-card p-8 group hover:bg-primary transition-all duration-500 cursor-pointer rounded-xl feature-card">
            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors mb-6 text-[32px]">menu_book</span>
            <h4 className="font-headline-md text-[20px] mb-3 group-hover:text-white transition-colors">Belajar tentang stroke</h4>
            <p className="font-caption text-caption text-on-surface-variant group-hover:text-white/80 transition-colors">Akses literatur medis yang disederhanakan untuk pemahaman orang awam.</p>
          </div>
          <div className="bg-primary text-white p-8 group hover:opacity-90 transition-all duration-500 cursor-pointer rounded-xl shadow-lg feature-card">
            <span className="material-symbols-outlined text-white mb-6 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <h4 className="font-headline-md text-[20px] mb-3">Bertanya kepada AI</h4>
            <p className="font-caption text-caption text-white/80">Pendamping cerdas yang siap menjawab pertanyaan kesehatan Anda kapan saja.</p>
          </div>
        </div>
      </section>

      <section className="py-section-gap fade-up-section">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Langkah Perjalanan Anda</h2>
          <p className="font-body-md text-on-surface-variant">Sebuah siklus pemahaman yang berkelanjutan untuk hidup yang lebih sehat.</p>
        </div>
        <div className="relative px-gutter steps-container">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -translate-y-1/2 hidden md:block" />
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 step-item">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center font-bold text-primary shadow-sm">1</div>
              <h5 className="font-label-caps text-label-caps tracking-widest">KENALI</h5>
              <p className="font-caption text-caption text-on-surface-variant">Deteksi sinyal tubuh secara dini.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 step-item">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center font-bold text-outline-variant shadow-sm">2</div>
              <h5 className="font-label-caps text-label-caps tracking-widest text-on-surface-variant">PAHAMI</h5>
              <p className="font-caption text-caption text-on-surface-variant">Mengerti apa yang terjadi pada sistem syaraf.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 step-item">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center font-bold text-outline-variant shadow-sm">3</div>
              <h5 className="font-label-caps text-label-caps tracking-widest text-on-surface-variant">LINDUNGI</h5>
              <p className="font-caption text-caption text-on-surface-variant">Lakukan tindakan pencegahan preventif.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 step-item">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center font-bold text-outline-variant shadow-sm">4</div>
              <h5 className="font-label-caps text-label-caps tracking-widest text-on-surface-variant">BERTINDAK</h5>
              <p className="font-caption text-caption text-on-surface-variant">Respon cepat saat keadaan darurat medis.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-40">
        <button className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          <span className="absolute right-full mr-4 bg-on-surface text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Ask AI Companion
          </span>
        </button>
      </div>
    </main>
  );
}
