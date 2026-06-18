import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/recovery")({
  component: Recovery,
});

function Recovery() {
  return (
    <main className="max-w-[1100px] mx-auto px-gutter py-section-gap flex flex-col gap-section-gap">
      <header className="max-w-2xl border-l-2 border-primary pl-6">
        <span className="font-label-caps text-label-caps text-secondary block mb-4 uppercase tracking-widest">
          Serene Recovery
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display text-on-surface mb-6 tracking-tight">
          Pemulihan Anda adalah perjalanan yang tenang.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Kami telah menyusun panduan khusus yang disesuaikan dengan kondisi fisiologis Anda. 
          Luangkan waktu sejenak, bernapas perlahan, dan mari kita mulai langkah demi langkah.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>self_improvement</span>
          </div>
          <h2 className="font-headline-md text-[20px] mb-3">Meditasi Pagi</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
            Latihan pernapasan 5 menit untuk menenangkan pikiran dan mempersiapkan sistem saraf Anda.
          </p>
          <button type="button" className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
            Mulai Sesi <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>directions_walk</span>
          </div>
          <h2 className="font-headline-md text-[20px] mb-3">Aktivitas Ringan</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
            Panduan gerakan lambat untuk meregangkan otot tanpa membebani detak jantung Anda.
          </p>
          <button type="button" className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
            Lihat Panduan <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant_menu</span>
          </div>
          <h2 className="font-headline-md text-[20px] mb-3">Nutrisi Harian</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
            Rekomendasi makanan yang mendukung elastisitas pembuluh darah dan kesehatan otak.
          </p>
          <button type="button" className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
            Cek Menu <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      <section className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary-fixed/20 blur-[80px] rounded-full -z-10" />
        <h2 className="font-headline-md text-[24px] mb-8 text-on-surface">Pencapaian Minggu Ini</h2>
        
        <div className="relative border-l-2 border-outline-variant/30 pl-6 ml-4 space-y-8">
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-low" />
            <h3 className="font-body-lg font-medium text-on-surface">Menjaga Tekanan Darah</h3>
            <p className="font-body-md text-on-surface-variant mt-1">4 hari berturut-turut dalam batas normal.</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-low" />
            <h3 className="font-body-lg font-medium text-on-surface">Konsisten Bergerak</h3>
            <p className="font-body-md text-on-surface-variant mt-1">Telah menyelesaikan 3 sesi jalan santai.</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-surface-container-highest ring-4 ring-surface-container-low" />
            <h3 className="font-body-lg font-medium text-on-surface-variant/60">Tidur Berkualitas (Mendatang)</h3>
            <p className="font-body-md text-on-surface-variant/60 mt-1">Target: 7-8 jam per malam.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
