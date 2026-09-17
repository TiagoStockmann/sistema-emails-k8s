import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  HardDrive,
  Ticket,
  Users,
} from "lucide-react";

type Bloco = {
  icone: typeof HardDrive;
  titulo: string;
  texto: string;
  links: { to: string; label: string }[];
};

const BLOCOS: Bloco[] = [
  {
    icone: HardDrive,
    titulo: "Alertas por e-mail",
    texto:
      "Notificação e reforço para espaço em disco e host desligado, com os destinatários do cliente já montados.",
    links: [
      { to: "/first-disk", label: "Disco — primeiro contato" },
      { to: "/reinforcing-disk", label: "Disco — reforço" },
      { to: "/first-powerdown", label: "Power down — primeiro contato" },
      { to: "/reinforcing-powerdown", label: "Power down — reforço" },
    ],
  },
  {
    icone: Ticket,
    titulo: "Chamados",
    texto:
      "Respostas padronizadas para orientar a abertura de ticket e para encerrar alertas resolvidos sozinhos.",
    links: [
      { to: "/ticket", label: "Abertura de ticket" },
      { to: "/alert", label: "Alerta resolvido automaticamente" },
    ],
  },
  {
    icone: ClipboardList,
    titulo: "Triagem técnica",
    texto:
      "Registro inicial no Jira para os cenários que mais aparecem no plantão.",
    links: [{ to: "/triagens", label: "Textos de triagem" }],
  },
  {
    icone: Users,
    titulo: "Cadastro",
    texto:
      "Clientes e contatos que alimentam a lista de destinatários dos e-mails.",
    links: [{ to: "/clientes", label: "Clientes e e-mails" }],
  },
];

export default function Home() {
  return (
    <>
      <section className="home__hero">
        <span className="home__eyebrow">Console operacional</span>
        <h1 className="home__title">
          Do alerta ao <em>texto pronto</em>.
        </h1>
        <p className="home__lede">
          Escolha o tipo de comunicação, preencha os dados do host e copie cada
          campo direto para o Outlook ou para o Jira. Os limiares de
          monitoramento e a lista de destinatários vêm preenchidos.
        </p>
      </section>

      <section className="board">
        {BLOCOS.map(({ icone: Icone, titulo, texto, links }) => (
          <article key={titulo} className="board__card">
            <span className="board__icon">
              <Icone size={17} />
            </span>

            <h2 className="board__title">{titulo}</h2>
            <p className="board__text">{texto}</p>

            <div className="board__list">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="board__link">
                  {link.label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
