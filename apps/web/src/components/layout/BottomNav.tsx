import { Link } from "@tanstack/react-router";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-container-low border-t border-outline-variant/20 shadow-sm rounded-t-full">
      <Link
        to="/"
        className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
        activeProps={{ className: "bg-primary-container text-on-primary-container rounded-full px-4 py-1" }}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-label-caps text-[10px] uppercase">Home</span>
      </Link>
      <Link
        to="/kenali-stroke"
        className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
        activeProps={{ className: "bg-primary-container text-on-primary-container rounded-full px-4 py-1" }}
      >
        <span className="material-symbols-outlined">menu_book</span>
        <span className="font-label-caps text-[10px] uppercase">Kenali</span>
      </Link>
      <Link
        to="/dashboard"
        className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
        activeProps={{ className: "bg-primary-container text-on-primary-container rounded-full px-4 py-1" }}
      >
        <span className="material-symbols-outlined">dashboard</span>
        <span className="font-label-caps text-[10px] uppercase">Dash</span>
      </Link>
      <div className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full">
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-caps text-[10px] uppercase">Profil</span>
      </div>
    </nav>
  );
}
