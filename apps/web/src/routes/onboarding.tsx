import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import "./onboarding.css";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

type Step = 1 | 2 | 3;

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const finishOnboarding = () => {
    setStep(3);
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 2500);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-24 relative overflow-hidden min-h-screen">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary-fixed/20 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary-fixed/20 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-[600px] w-full space-y-stack-md z-10">
        <div className="text-center mb-section-gap">
          <h1 className="font-headline-lg text-headline-lg md:text-display text-primary tracking-tight">StrokeCare AI</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Mari sesuaikan pengalaman pemulihan Anda.</p>
        </div>

        {step < 3 && (
          <div className="flex items-center justify-center space-x-unit mb-stack-md">
            <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? "bg-primary" : "bg-surface-container-highest"}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? "bg-primary" : "bg-surface-container-highest"}`} />
          </div>
        )}

        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden min-h-[500px]">
          {step === 1 && (
            <section className="step-transition fade-in block">
              <div className="mb-stack-md">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Tahap 1 dari 2</span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Informasi Pribadi</h2>
              </div>
              <form className="space-y-6" onSubmit={handleNextStep}>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Nama Lengkap</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all placeholder:text-outline-variant"
                    placeholder="Masukkan nama Anda"
                    type="text"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Umur</label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all"
                      placeholder="Tahun"
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Jenis Kelamin</label>
                    <select className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all appearance-none" required>
                      <option value="">Pilih</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Tinggi Badan (cm)</label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all"
                      placeholder="170"
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Berat Badan (kg)</label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all"
                      placeholder="65"
                      type="number"
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-body-md font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Lanjutkan</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {step === 2 && (
            <section className="step-transition fade-in block">
              <div className="mb-stack-md">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Tahap 2 dari 2</span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Riwayat Medis & Gaya Hidup</h2>
                <p className="text-caption font-caption text-on-surface-variant mt-2 leading-relaxed">Pilih kondisi yang relevan dengan riwayat kesehatan Anda saat ini.</p>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                  <ConditionButton
                    id="hipertensi"
                    label="Hipertensi"
                    icon="pulse_alert"
                    selected={selectedConditions.includes("hipertensi")}
                    onToggle={() => toggleCondition("hipertensi")}
                  />
                  <ConditionButton
                    id="diabetes"
                    label="Diabetes"
                    icon="blood_pressure"
                    selected={selectedConditions.includes("diabetes")}
                    onToggle={() => toggleCondition("diabetes")}
                  />
                  <ConditionButton
                    id="kolesterol"
                    label="Kolesterol Tinggi"
                    icon="monitor_heart"
                    selected={selectedConditions.includes("kolesterol")}
                    onToggle={() => toggleCondition("kolesterol")}
                  />
                  <ConditionButton
                    id="stroke"
                    label="Pernah Stroke Sebelumnya"
                    icon="neurology"
                    selected={selectedConditions.includes("stroke")}
                    onToggle={() => toggleCondition("stroke")}
                  />
                  <ConditionButton
                    id="rokok"
                    label="Merokok"
                    icon="smoking_rooms"
                    selected={selectedConditions.includes("rokok")}
                    onToggle={() => toggleCondition("rokok")}
                  />
                  <ConditionButton
                    id="alkohol"
                    label="Konsumsi Alkohol"
                    icon="wine_bar"
                    selected={selectedConditions.includes("alkohol")}
                    onToggle={() => toggleCondition("alkohol")}
                  />
                  <ConditionButton
                    id="fisik"
                    label="Aktivitas Fisik Rutin"
                    icon="fitness_center"
                    selected={selectedConditions.includes("fisik")}
                    onToggle={() => toggleCondition("fisik")}
                  />
                </div>
              </div>
              <div className="pt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 border border-outline/20 text-on-surface-variant py-4 rounded-xl font-body-md hover:bg-surface-container-high transition-all"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-body-md font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Selesai & Personalisasi</span>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center h-full space-y-stack-md fade-in py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[48px]">verified</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-center">Data Tersimpan!</h2>
              <p className="text-on-surface-variant text-center max-w-[300px]">AI sedang menganalisis profil Anda untuk menyusun rencana pemulihan terbaik.</p>
              <div className="w-full max-w-[200px] h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-6">
                <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="flex items-start space-x-3 bg-tertiary-container/10 p-4 rounded-xl border border-tertiary-container/20">
            <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">info</span>
            <p className="text-caption font-caption text-on-tertiary-container leading-relaxed">
              Data Anda aman dan terenkripsi. Informasi ini membantu AI kami merancang rencana rehabilitasi yang paling aman dan efektif sesuai kondisi fisiologis Anda.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function ConditionButton({
  label,
  icon,
  selected,
  onToggle,
}: {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group flex items-center justify-between p-4 border rounded-xl transition-all text-left ${
        selected ? "bg-primary-container/5 border-primary/40 selected" : "bg-surface-container-lowest border-outline/10 hover:border-secondary/30"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selected ? "bg-primary text-on-primary" : "bg-surface-container-high text-primary"}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="font-body-md text-on-surface">{label}</span>
      </div>
      <span
        className={`material-symbols-outlined transition-colors ${selected ? "text-primary" : "text-outline-variant"}`}
        style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}
      >
        check_circle
      </span>
    </button>
  );
}
