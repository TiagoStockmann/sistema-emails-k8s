import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ConnectionStatus from "./ConnectionStatus";
import type { Theme } from "../App";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
  navAberta: boolean;
  onToggleNav: () => void;
};

export default function Header({
  theme,
  onToggleTheme,
  navAberta,
  onToggleNav,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar__menu"
        onClick={onToggleNav}
        aria-label={navAberta ? "Fechar navegação" : "Abrir navegação"}
        aria-expanded={navAberta}
      >
        {navAberta ? <X size={16} /> : <Menu size={16} />}
      </button>

      <Link to="/" className="topbar__brand">
        <img src="/logo_simbolo.png" alt="" className="brand__mark" />
        <span className="brand__text">
          <span className="brand__name">Vortex</span>
          <span className="brand__sub">Console operacional</span>
        </span>
      </Link>

      <div className="topbar__spacer" />

      <div className="topbar__actions">
        <ConnectionStatus />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
