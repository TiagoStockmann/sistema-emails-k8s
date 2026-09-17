type ThresholdMeterProps = {
  /** Percentual livre como o analista digitou: "8", "8%", "8,4 %". */
  percentual: string;
  /** Abaixo deste percentual o monitoramento abre o alerta. */
  limiteAlerta: number;
  /** Acima deste percentual, por 10 aferições, o alerta fecha sozinho. */
  limiteEncerramento: number;
};

/** Aceita "8", "8%", "8,4 %" e devolve 8 / 8.4. */
function lerPercentual(bruto: string): number | null {
  const numero = Number.parseFloat(bruto.replace("%", "").replace(",", ".").trim());
  return Number.isFinite(numero) ? numero : null;
}

function formatar(valor: number): string {
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

/**
 * A régua do monitoramento. O e-mail existe porque um número cruzou um limiar,
 * então o número aparece aqui contra os dois limiares que importam: o que
 * abriu o alerta e o que vai encerrá-lo.
 */
export default function ThresholdMeter({
  percentual,
  limiteAlerta,
  limiteEncerramento,
}: ThresholdMeterProps) {
  const valor = lerPercentual(percentual);

  if (valor === null) {
    return (
      <div className="gauge">
        <div className="gauge__head">
          <span className="gauge__label">Espaço livre</span>
          <span className="gauge__value" style={{ color: "var(--ink-3)" }}>
            —
          </span>
        </div>
        <div className="gauge__track" />
        <p className="gauge__note">
          Informe o percentual livre para ver a posição contra os limiares de{" "}
          {formatar(limiteAlerta)} e {formatar(limiteEncerramento)}.
        </p>
      </div>
    );
  }

  // Escala fixada nos limiares: é a faixa onde a decisão acontece.
  const teto = Math.max(
    25,
    Math.ceil((Math.max(valor, limiteEncerramento) * 1.35) / 5) * 5
  );

  const posicao = (v: number) => `${Math.min(100, (v / teto) * 100)}%`;

  const estado =
    valor < limiteAlerta ? "crit" : valor < limiteEncerramento ? "warn" : "ok";

  const cor =
    estado === "crit"
      ? "var(--red)"
      : estado === "warn"
        ? "var(--amber)"
        : "var(--green)";

  const nota =
    estado === "crit"
      ? `Abaixo do limite de alerta. O alerta permanece aberto até 10 aferições acima de ${formatar(limiteEncerramento)}.`
      : estado === "warn"
        ? `Acima do limite de alerta, mas ainda abaixo de ${formatar(limiteEncerramento)} — o alerta não fecha sozinho neste patamar.`
        : `Acima de ${formatar(limiteEncerramento)}. Mantido por 10 aferições, o alerta encerra automaticamente.`;

  return (
    <div className="gauge">
      <div className="gauge__head">
        <span className="gauge__label">Espaço livre</span>
        <span className="gauge__value" style={{ color: cor }}>
          {formatar(valor)}
        </span>
      </div>

      <div className="gauge__track">
        <div
          className="gauge__fill"
          style={{ width: posicao(valor), background: cor }}
        />
        <div className="gauge__tick" style={{ left: posicao(limiteAlerta) }} />
        <div
          className="gauge__tick"
          style={{ left: posicao(limiteEncerramento) }}
        />
      </div>

      <div className="gauge__scale">
        <span className="gauge__mark" style={{ left: posicao(limiteAlerta) }}>
          <b>{formatar(limiteAlerta)}</b>
          alerta
        </span>
        <span
          className="gauge__mark"
          style={{ left: posicao(limiteEncerramento) }}
        >
          <b>{formatar(limiteEncerramento)}</b>
          encerra
        </span>
      </div>

      <p className="gauge__note">{nota}</p>
    </div>
  );
}
