import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Seção a que a página pertence. */
  eyebrow: string;
  title: string;
  description: string;
  /** Ações da página, alinhadas à direita. */
  actions?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="ph">
      <div>
        <span className="ph__eyebrow">{eyebrow}</span>
        <h1 className="ph__title">{title}</h1>
        <p className="ph__desc">{description}</p>
      </div>

      {actions && <div className="ph__actions">{actions}</div>}
    </header>
  );
}
