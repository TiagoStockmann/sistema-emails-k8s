import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { copyText } from "../utils/clipboard";

type CopyButtonProps = {
  /** Texto que vai para a área de transferência. */
  value: string;
  /** Nome do conteúdo, usado no rótulo e na confirmação. Ex: "Assunto". */
  label: string;
  /** Avisa o bloco pai para acender o trilho de "já copiado". */
  onCopy?: () => void;
};

export default function CopyButton({ value, label, onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function handleClick() {
    const ok = await copyText(value);

    if (!ok) {
      toast.error(`${label} não foi copiado. Selecione o texto e use Ctrl+C.`);
      return;
    }

    setCopied(true);
    onCopy?.();
    toast.success(`${label} copiado`);

    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button
      type="button"
      className={copied ? "copy copy--done" : "copy"}
      onClick={handleClick}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
