import { Heart } from "lucide-react";
import Anchor from "./Anchor.jsx";
import GitHub from "./icons/GitHub.jsx";

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => (
  <footer className="mt-8 flex flex-col gap-3 border-t border-border bg-surface/50 px-5 py-4 shadow-[0_-8px_16px_-8px_var(--shadow)] sm:flex-row sm:items-center sm:justify-between sm:px-10">
    <span className="text-sm text-text-muted sm:text-base">
      &copy; {CURRENT_YEAR}{" "}
      <span className="transition[text,font] mr-1.5 ml-2 font-medium text-accent/60 duration-300 hover:font-semibold hover:text-accent">
        CronVert
      </span>
      Built with <Heart size={18} color="red" fill="red" className="inline-block align-text-top" />
    </span>

    <div className="flex items-center gap-5">
      <Anchor
        url="https://github.com/OzenFern/CronVert"
        ariaLabel="CronVert on GitHub"
        linkColour="text-text-muted"
      >
        <GitHub className="size-7 text-text-muted transition-[scale,text] duration-200 hover:scale-110 hover:text-text sm:size-8" />
        <span>GitHub</span>
      </Anchor>
      <span className="transition[scale,text] cursor-none text-xs text-text-muted duration-300 hover:scale-120 hover:text-text/75">
        v{__APP_VERSION__}
      </span>
    </div>
  </footer>
);

export default Footer;
