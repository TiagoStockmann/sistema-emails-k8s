/**
 * Copia texto para a área de transferência.
 *
 * A Clipboard API só existe em contexto seguro (https ou localhost). Como o
 * console é acessado pela rede em http://<ip>:8080, ela fica indisponível para
 * a maior parte dos analistas — daí o fallback por seleção de texto, que
 * continua funcionando em http.
 */
export async function copyText(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // segue para o fallback
    }
  }

  const scratch = document.createElement("textarea");
  scratch.value = text;
  scratch.setAttribute("readonly", "");
  scratch.style.position = "fixed";
  scratch.style.top = "0";
  scratch.style.left = "-9999px";
  document.body.appendChild(scratch);

  const previousSelection = document.getSelection()?.rangeCount
    ? document.getSelection()!.getRangeAt(0)
    : null;

  scratch.select();
  scratch.setSelectionRange(0, scratch.value.length);

  let copied: boolean;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(scratch);

  if (previousSelection) {
    const selection = document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(previousSelection);
  }

  return copied;
}
