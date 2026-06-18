import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full mt-section-gap bg-surface-container-low border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1100px] mx-auto px-gutter py-stack-md gap-6">
        <div className="font-headline-md text-headline-md text-primary font-bold">StrokeCare AI</div>
        <div className="flex gap-6">
          <Link to="/" className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</Link>
          <Link to="/" className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</Link>
          <Link to="/" className="font-caption text-caption text-on-surface-variant hover:text-secondary transition-colors">Medical Disclaimer</Link>
        </div>
        <div className="font-caption text-caption text-secondary">© 2024 StrokeCare AI. Precision in Care.</div>
      </div>
    </footer>
  );
}
