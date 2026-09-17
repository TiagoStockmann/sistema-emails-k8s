import { Moon, Sun } from "lucide-react";
import type { Theme } from "../App";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const proximo = theme === "dark" ? "claro" : "escuro";

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onToggle}
      title={`Mudar para o tema ${proximo}`}
      aria-label={`Mudar para o tema ${proximo}`}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      <span className="icon-btn__label">{theme === "dark" ? "Claro" : "Escuro"}</span>
    </button>
  );
}
