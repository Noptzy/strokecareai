import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="max-w-[1100px] mx-auto px-gutter py-stack-md lg:py-section-gap">
      <header className="mb-section-gap">
        <h1 className="font-display text-display mb-2">Halo, Budi</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Laporan kesehatan harian Anda sudah siap untuk ditinjau.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <section className="md:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                title="A warm, professional portrait of an elderly Indonesian man smiling gently."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1PiXoLoIlxqRYOZkqQOx_Hds-79EkB9rPcsppo8YIELNhQWiN7zKlWWSW0LZ1vz-ol7MF-XateB-DPOGS7uBuNjna9V2JVf8YqQu44MKFN-saZzt63YRn3roicphwn6_tclZ-4hTZeEkWukHWpCNhOipPrZuT3MlxXgzwyL611cfSILXXotasci8-0PhIL-gIPQKZBJuoPdASRvXqOBt-Yg4qwaDEemjZZAhdOneNjzYd90UWwnglkDPpCwUT9K_uRUlcp39Us6s')",
                }}
              />
              <div>
                <h2 className="font-headline-md text-headline-md">Profil Saya</h2>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Pasien Rawat Jalan</span>
              </div>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center py-2 border-b border-outline-variant/5">
                <span className="font-body-md text-body-md text-on-surface-variant">Usia</span>
                <span className="font-body-md text-body-md font-medium">62 Tahun</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-outline-variant/5">
                <span className="font-body-md text-body-md text-on-surface-variant">Golongan Darah</span>
                <span className="font-body-md text-body-md font-medium">O+</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="font-body-md text-body-md text-on-surface-variant">Kontak Darurat</span>
                <span className="font-body-md text-body-md font-medium">Siska (Anak)</span>
              </li>
            </ul>
            <button className="w-full mt-6 py-3 border border-secondary text-secondary rounded-lg font-medium hover:bg-secondary/5 transition-colors">
              Perbarui Profil
            </button>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
            <h2 className="font-headline-md text-headline-md mb-4">Ringkasan Risiko</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-error-container/30 rounded-lg">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <p className="font-body-md text-body-md text-on-error-container">Hipertensi (Butuh Perhatian)</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-tertiary-container/20 rounded-lg">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-body-md text-body-md text-on-tertiary-container">Kadar Gula Darah Stabil</p>
              </div>
            </div>
          </div>
        </section>

        <section className="md:col-span-8 flex flex-col gap-gutter">
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-md text-headline-md">Faktor Risiko Saya</h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant cursor-pointer hover:text-primary">Lihat Detail</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-surface rounded-xl border border-outline-variant/20 hover:border-secondary transition-all">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary">blood_pressure</span>
                </div>
                <h3 className="font-headline-md text-[18px] mb-2">Tekanan Darah</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Tekanan darah tinggi merupakan faktor risiko utama stroke. Saat ini tekanan darah Anda 145/90 mmHg. Usahakan untuk mengurangi asupan garam.
                </p>
              </div>
              <div className="p-6 bg-surface rounded-xl border border-outline-variant/20 hover:border-secondary transition-all">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary">monitor_weight</span>
                </div>
                <h3 className="font-headline-md text-[18px] mb-2">Indeks Massa Tubuh</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Berat badan berlebih dapat membebani kerja jantung. Jalan santai 15 menit setiap pagi dapat membantu menjaga berat badan ideal.
                </p>
              </div>
              <div className="p-6 bg-surface rounded-xl border border-outline-variant/20 hover:border-secondary transition-all">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary">ecg_heart</span>
                </div>
                <h3 className="font-headline-md text-[18px] mb-2">Aktivitas Jantung</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Denyut jantung istirahat Anda dalam rentang normal (72 bpm). Menjaga pola tidur yang teratur sangat mendukung pemulihan saraf.
                </p>
              </div>
              <div className="p-6 bg-surface rounded-xl border border-outline-variant/20 hover:border-secondary transition-all">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary">restaurant</span>
                </div>
                <h3 className="font-headline-md text-[18px] mb-2">Pola Makan</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Konsumsi buah dan sayur hijau Anda minggu ini meningkat. Ini adalah langkah tepat untuk menjaga elastisitas pembuluh darah.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
            <h2 className="font-headline-md text-headline-md mb-6">Riwayat Percakapan</h2>
            <div className="space-y-4">
              <div className="group flex items-start gap-4 p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-body-md text-body-md font-semibold">"Bagaimana cara mengenali gejala awal stroke?"</h4>
                    <span className="font-caption text-caption text-on-surface-variant">2 Jam Lalu</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 italic">Ingat metode FAST: Face, Arms, Speech, Time...</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
              <div className="group flex items-start gap-4 p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-body-md text-body-md font-semibold">"Amankah saya berolahraga ringan sore ini?"</h4>
                    <span className="font-caption text-caption text-on-surface-variant">Kemarin</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 italic">Tentu, selama tidak ada rasa pusing atau sesak napas berlebih...</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline">
              Buka Asisten AI <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </button>
          </div>

          <div className="mb-gutter">
            <h2 className="font-headline-md text-headline-md mb-6">Artikel Tersimpan</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <div className="min-w-[280px] bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] group">
                <div
                  className="h-32 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  title="A serene landscape photograph of a calm Japanese Zen garden."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC12JPuXE7Zgdi6maNcCZ7owh0C5iwBZvTtmlwrGFTSU7iA4xYHJSemAonJrWA9kgcBI15DGHjeGL-TAp7TCpgSNYdyUss5TJlDNxApd2A4GSvwftJKgw8h-mY66fVilg0rtNdoF2LpL_oJIKxYVBO7PeRqYQWfMkPGrJAQANCYGFy5F2EqlsleXGR4I2nLnNyUEnziGJFjskEUY7Pdw823eaXPIepNdVZInyWRo68QrzZ2u9SEqqExE6mOb8P4EM7aH7QHE9Ng1UU')",
                  }}
                />
                <div className="p-4">
                  <span className="font-label-caps text-label-caps text-secondary mb-2 block">NUTRISI</span>
                  <h4 className="font-body-md text-body-md font-semibold mb-2">5 Makanan Peningkat Kinerja Saraf</h4>
                  <p className="font-caption text-caption text-on-surface-variant line-clamp-2 mb-4">Konsumsi blueberry dan kenari terbukti membantu proses pemulihan...</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                    <span className="font-caption text-caption text-on-surface-variant">4 Menit Baca</span>
                  </div>
                </div>
              </div>
              <div className="min-w-[280px] bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] group">
                <div
                  className="h-32 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  title="A minimalist photograph of a person practicing tai-chi."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDTkV0tTsp0SNGNmVJxKxu0rLUQMyxJqxMBIO2E08p78wd66oDFPQ8UJxXE1j3iWAUjDSArvZk_fOaNH84NvfFBXQcDWksP8VzFMhCmHcKEZJYTkIYh9Lr82brFDyXscB-mupsQECr6a_9s8iGxecgOeKrxH4-NA-sGI-hYlPOnQLTlGX3AFeUqMjtTacpy0v7ItDAVkoBxSSMl5kckEGISK7uxa6wUb3MaOlKeSlz_FwrFYK7TlTEPSt3EGKexd4yepkUfOPluMzw')",
                  }}
                />
                <div className="p-4">
                  <span className="font-label-caps text-label-caps text-secondary mb-2 block">LATIHAN</span>
                  <h4 className="font-body-md text-body-md font-semibold mb-2">Latihan Koordinasi Tangan di Rumah</h4>
                  <p className="font-caption text-caption text-on-surface-variant line-clamp-2 mb-4">Gerakan sederhana yang bisa Anda lakukan setiap pagi untuk melatih...</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                    <span className="font-caption text-caption text-on-surface-variant">6 Menit Baca</span>
                  </div>
                </div>
              </div>
              <div className="min-w-[280px] bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] group">
                <div
                  className="h-32 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  title="An artistic, minimalist illustration of a brain formed by delicate golden threads."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPzqdK3UnLCwVO27Eh2cr9MIQhdpdUX59D0Aw6qSFD4NWynzzbnxmOW83bUIYimBusDaX-DjQRAapWQHW4futzgqSP-7idm0T6R9OcBChAb2FitP9V1L1K7IFr-zJV_EnuA5Yb2C1Bb53pR27MFDj14YaaKZTgOEwcJHEJxcs9YGuLXQhJ88X7RGisriOxBsbUssVat-dqcNziZbQgq5bY8J3IRSKV4dVN-V5TxrhQeG4mUALOAzerXQLYOsX_Aze3EQ5giL89mFQ')",
                  }}
                />
                <div className="p-4">
                  <span className="font-label-caps text-label-caps text-secondary mb-2 block">SAINS</span>
                  <h4 className="font-body-md text-body-md font-semibold mb-2">Memahami Neuroplastisitas Otak</h4>
                  <p className="font-caption text-caption text-on-surface-variant line-clamp-2 mb-4">Bagaimana otak kita mampu membangun jalur baru setelah cedera...</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                    <span className="font-caption text-caption text-on-surface-variant">8 Menit Baca</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
