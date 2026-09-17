import { useState } from "react";
import CopyButton from "./CopyButton";

type OutputBlockProps = {
  /** Rótulo do campo do e-mail: "Para", "Assunto", "Corpo". */
  label: string;
  /** Conteúdo já montado, pronto para colar. */
  value: string;
};

/**
 * Um campo do e-mail gerado. Depois de copiado, o trilho lateral acende e
 * continua aceso — durante o plantão isso mostra o que já foi para o Outlook.
 */
export default function OutputBlock({ label, value }: OutputBlockProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`out out__enter${copied ? " out--copied" : ""}`}>
      <div className="out__head">
        <span className="out__label">{label}</span>
        <CopyButton value={value} label={label} onCopy={() => setCopied(true)} />
      </div>
      <pre className="out__body">{value}</pre>
    </div>
  );
}
