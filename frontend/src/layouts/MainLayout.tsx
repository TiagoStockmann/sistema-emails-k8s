import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BellRing,
  ClipboardList,
  HardDrive,
  Home,
  PowerOff,
  Ticket,
  Users,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Theme } from "../App";

type MainLayoutProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

/**
 * Navegação única do sistema. Os grupos seguem o que o analista faz, não como
 * a API está organizada; dentro de cada grupo a ordem é a do fluxo real —
 * primeiro contato antes do reforço.
 */
const NAV: NavGroup[] = [
  {
    label: "Painel",
    items: [{ to: "/", label: "Início", icon: Home }],
  },
  {
    label: "Cadastro",
    items: [{ to: "/clientes", label: "Clientes", icon: Users }],
  },
  {
    label: "Alertas por e-mail",
    items: [
      { to: "/first-disk", label: "Disco — primeiro", icon: HardDrive },
      { to: "/reinforcing-disk", label: "Disco — reforço", icon: HardDrive },
      { to: "/first-powerdown", label: "Power down — primeiro", icon: PowerOff },
      {
        to: "/reinforcing-powerdown",
        label: "Power down — reforço",
        icon: PowerOff,
      },
    ],
  },
  {
    label: "Chamados",
    items: [
      { to: "/ticket", label: "Abertura de ticket", icon: Ticket },
      { to: "/alert", label: "Alerta automático", icon: BellRing },
    ],
  },
  {
    label: "Triagem",
    items: [
      { to: "/triagens", label: "Textos de triagem", icon: ClipboardList },
    ],
  },
];

export default function MainLayout({ theme, onToggleTheme }: MainLayoutProps) {
  const [navAberta, setNavAberta] = useState(false);

  useEffect(() => {
    function fecharComEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") setNavAberta(false);
    }

    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, []);

  return (
    <div className="shell">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        navAberta={navAberta}
        onToggleNav={() => setNavAberta((aberta) => !aberta)}
      />

      <div className="shell__body">
        <nav
          className={navAberta ? "rail rail--open" : "rail"}
          aria-label="Navegação principal"
        >
          {NAV.map((grupo) => (
            <div key={grupo.label} className="rail__group">
              <p className="rail__label">{grupo.label}</p>

              {grupo.items.map(({ to, label, icon: Icone }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    isActive ? "rail__link rail__link--active" : "rail__link"
                  }
                  onClick={() => setNavAberta(false)}
                >
                  <Icone size={15} />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {navAberta && (
          <button
            type="button"
            className="rail__backdrop"
            aria-label="Fechar navegação"
            onClick={() => setNavAberta(false)}
          />
        )}

        <main className="canvas">
          <div className="canvas__inner">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
