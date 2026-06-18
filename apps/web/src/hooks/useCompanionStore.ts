import { create } from "zustand";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface CompanionState {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Selamat pagi. Saya telah meninjau profil kesehatan Anda. Berdasarkan data usia 58 tahun dan riwayat hipertensi Anda, ada beberapa hal yang bisa kita diskusikan untuk menjaga kesehatan saraf Anda. Apa yang ingin Anda tanyakan hari ini?",
    isUser: false,
    timestamp: "SEKARANG",
  },
];

export const useCompanionStore = create<CompanionState>((set) => ({
  messages: initialMessages,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
