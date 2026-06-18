import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useCompanionStore } from "../../hooks/useCompanionStore";
import "./companion.css";

export const Route = createFileRoute("/_authenticated/companion")({
  component: Companion,
});

function Companion() {
  const { messages, addMessage } = useCompanionStore();
  const [inputValue, setInputValue] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    addMessage({
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: "BARU SAJA",
    });
    setInputValue("");

    setTimeout(() => {
      const response =
        "Terima kasih atas pertanyaannya. Meninjau data Anda, langkah pertama yang paling efektif adalah memantau asupan garam harian untuk membantu mengelola hipertensi Anda. Apakah Anda ingin tahu lebih banyak tentang pola makan DASH?";
      
      addMessage({
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: "BARU SAJA",
      });
    }, 1000);
  };

  const sendPredefined = (text: string) => {
    addMessage({
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: "BARU SAJA",
    });

    setTimeout(() => {
      let response = "";
      if (text.includes("berisiko")) {
        response =
          "Berdasarkan usia Anda yang 58 tahun, risiko stroke secara alami meningkat, namun faktor ini dapat dikelola. Fokus kita adalah pada variabel yang bisa diubah seperti tekanan darah dan gaya hidup aktif.";
      } else {
        response =
          "Menurunkan risiko stroke melibatkan kombinasi aktivitas fisik moderat (seperti jalan cepat 30 menit sehari) dan menjaga pola makan rendah lemak jenuh. Mengingat BMI Anda di 27.4, penurunan berat badan bertahap juga sangat disarankan.";
      }
      
      addMessage({
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: "BARU SAJA",
      });
    }, 800);
  };

  return (
    <main className="flex-grow flex flex-col max-w-[1100px] mx-auto w-full px-gutter pt-8 pb-32 md:pb-8">
      <div className="mb-section-gap border-l-2 border-primary pl-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">StrokeCare AI Companion</h1>
        <p className="font-body-md text-on-surface-variant max-w-xl">
          Panduan kesehatan personal yang memahami profil risiko Anda. Berdiskusi dengan tenang dan dapatkan informasi berbasis data.
        </p>
        <div className="editorial-line mt-6 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter flex-grow">
        <aside className="hidden md:block md:col-span-3 space-y-stack-md">
          <div className="p-stack-md bg-surface-container-low rounded-xl border border-outline-variant/10">
            <span className="font-label-caps text-label-caps text-secondary block mb-4 uppercase tracking-widest">Profil Risiko</span>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="text-xs text-on-surface-variant/60">Usia</span>
                <span className="font-body-md font-semibold">58 Tahun</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-on-surface-variant/60">BMI</span>
                <span className="font-body-md font-semibold">27.4 (Overweight)</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-on-surface-variant/60">Faktor Utama</span>
                <span className="font-body-md font-semibold">Hipertensi Ringan</span>
              </li>
            </ul>
          </div>
          <div className="p-stack-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant/40 block mb-2">CATATAN</span>
            <p className="text-caption text-on-surface-variant/70 italic leading-relaxed">
              Informasi yang diberikan bersifat edukatif dan bukan pengganti saran medis profesional.
            </p>
          </div>
        </aside>

        <section className="md:col-span-9 flex flex-col h-[600px] md:h-auto bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm">
          <div ref={scrollerRef} className="flex-grow overflow-y-auto p-gutter space-y-8 scroll-smooth min-h-[400px]">
            <div className="space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.isUser ? "flex flex-row-reverse gap-4 animate-fade-in" : "flex gap-4 max-w-2xl animate-fade-in"}>
                  <div className="flex-grow">
                    {msg.isUser ? (
                      <div
                        className="bg-primary-container/10 p-stack-md rounded-l-lg text-right"
                        style={{ borderRight: "3px solid #892d32" }}
                      >
                        <p className="text-body-md text-on-surface leading-relaxed">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="chat-bubble-ai p-stack-md rounded-r-lg">
                        <p className="text-body-md text-on-surface leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                    <span className={`text-[10px] text-on-surface-variant/40 mt-2 block font-label-caps ${msg.isUser ? "text-right" : ""}`}>
                      {msg.isUser ? "ANDA" : "STROKECARE AI"} • {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-stack-sm pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-outline-variant hover:border-primary hover:text-primary transition-all rounded-full text-caption font-medium bg-white"
                  onClick={() => sendPredefined("Apakah umur saya berisiko?")}
                >
                  Apakah umur saya berisiko?
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-outline-variant hover:border-primary hover:text-primary transition-all rounded-full text-caption font-medium bg-white"
                  onClick={() => sendPredefined("Bagaimana cara menurunkan risiko?")}
                >
                  Bagaimana cara menurunkan risiko?
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-outline-variant hover:border-primary hover:text-primary transition-all rounded-full text-caption font-medium bg-white"
                  onClick={() => sendPredefined("Apa gejala stroke yang harus diwaspadai?")}
                >
                  Apa gejala stroke yang harus diwaspadai?
                </button>
              </div>
            )}
          </div>

          <div className="p-gutter bg-surface-container-low/50 border-t border-outline-variant/10">
            <div className="relative flex items-center">
              <textarea
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-6 py-4 pr-16 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none font-body-md"
                placeholder="Tanyakan sesuatu tentang kesehatan Anda..."
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-4 p-2 bg-primary text-on-primary rounded-lg hover:scale-105 active:scale-95 transition-transform"
                onClick={handleSend}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] text-on-surface-variant/40 font-label-caps uppercase tracking-wider">Terhubung dengan aman • Data terenkripsi</span>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-lg cursor-pointer hover:text-primary">mic</span>
                <span className="material-symbols-outlined text-on-surface-variant/40 text-lg cursor-pointer hover:text-primary">attach_file</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
