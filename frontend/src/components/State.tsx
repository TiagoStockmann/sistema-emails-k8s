import type { ReactNode } from "react";

type StateProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  /** Ação que resolve o estado, quando existe uma. */
  action?: ReactNode;
  tone?: "neutral" | "error";
};

/** Estado vazio ou de erro: diz o que houve e qual é o próximo passo. */
export default function State({
  icon,
  title,
  children,
  action,
  tone = "neutral",
}: StateProps) {
  return (
    <div className={`state${tone === "error" ? " state--error" : ""}`}>
      <div className="state__icon">{icon}</div>
      <h3 className="state__title">{title}</h3>
      <p className="state__text">{children}</p>
      {action}
    </div>
  );
}

/** Barras de carregamento com a forma da tabela que vai substituí-las. */
export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="skeleton">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="skeleton__bar"
          style={{ width: `${92 - i * 11}%` }}
        />
      ))}
    </div>
  );
}
