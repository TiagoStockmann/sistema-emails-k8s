import { useEffect, useSyncExternalStore } from "react";
import { getApiStatus, probeApi, subscribeApiStatus } from "../api/api";

const ROTULO = {
  checking: "Verificando",
  online: "Backend ativo",
  offline: "Backend fora",
} as const;

/**
 * Estado do backend na barra superior. Sem ele, uma API fora do ar aparece
 * apenas como listas vazias — e o analista culpa o cadastro.
 */
export default function ConnectionStatus() {
  const status = useSyncExternalStore(subscribeApiStatus, getApiStatus);

  useEffect(() => {
    if (status === "online") return;

    probeApi();
    const id = window.setInterval(probeApi, 30000);
    return () => window.clearInterval(id);
  }, [status]);

  return (
    <span className={`conn conn--${status}`} title={ROTULO[status]}>
      <span className="conn__dot" />
      <span className="conn__label">{ROTULO[status]}</span>
    </span>
  );
}
