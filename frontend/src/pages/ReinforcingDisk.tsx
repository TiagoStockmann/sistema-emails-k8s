import { useState } from "react";
import {
  Clock,
  Database,
  HardDrive,
  Inbox,
  Percent,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";
import State from "../components/State";
import ThresholdMeter from "../components/ThresholdMeter";
import { PERIODOS } from "../constants/periodos";

type FormData = {
  periodo: string;
  host: string;
  particao: string;
  percentual: string;
  diskTotal: string;
  diskFree: string;
};

const FORM_VAZIO: FormData = {
  periodo: "",
  host: "",
  particao: "",
  percentual: "",
  diskTotal: "",
  diskFree: "",
};

export default function ReinforcingDisk() {
  const [form, setForm] = useState<FormData>(FORM_VAZIO);
  const [corpo, setCorpo] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((anterior) => ({ ...anterior, [e.target.name]: e.target.value }));
  }

  function handleGerar(e: React.FormEvent) {
    e.preventDefault();

    setCorpo(`Prezados, ${form.periodo}!

Entramos em contato para reforçar o alerta previamente enviado referente ao host ${form.host}.

Até o momento, a condição persiste:
- Volume: ${form.particao}
- Espaço livre atual: ${form.percentual} (${form.diskFree} disponíveis de ${form.diskTotal} totais)

Importante: o alerta será automaticamente finalizado quando as 10 últimas aferições do percentual de espaço livre da partição forem superiores a 15,0%.

Nossa equipe segue monitorando o ambiente e mantém atenção à integridade dos serviços.
Reforçamos a importância de uma ação preventiva para evitar indisponibilidades.

Aguardamos um retorno com o posicionamento da equipe responsável.

Atenciosamente,`);

    toast.success("E-mail gerado");
  }

  return (
    <>
      <PageHeader
        eyebrow="Alertas por e-mail"
        title="Disco — reforço"
        description="Segunda cobrança quando o espaço livre continua abaixo do limite."
      />

      <div className="gen">
        <div className="gen__side">
          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <SlidersHorizontal size={14} />
                Dados do alerta
              </span>
            </div>

            <form className="form" onSubmit={handleGerar}>
              <Field label="Turno" icon={<Clock size={12} />}>
                {(id) => (
                  <select
                    id={id}
                    name="periodo"
                    className="field__control"
                    value={form.periodo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Escolha o turno</option>
                    {PERIODOS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <Field label="Host" icon={<Server size={12} />}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    name="host"
                    className="field__control field__control--mono"
                    placeholder="srv01.empresa.com.br"
                    value={form.host}
                    onChange={handleChange}
                    required
                  />
                )}
              </Field>

              <Field label="Volume" icon={<HardDrive size={12} />}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    name="particao"
                    className="field__control field__control--mono"
                    placeholder="C:"
                    value={form.particao}
                    onChange={handleChange}
                    required
                  />
                )}
              </Field>

              <Field label="Espaço livre (%)" icon={<Percent size={12} />}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    name="percentual"
                    className="field__control field__control--mono"
                    placeholder="8%"
                    value={form.percentual}
                    onChange={handleChange}
                    required
                  />
                )}
              </Field>

              <div className="form__row">
                <Field label="Total" icon={<Database size={12} />}>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      name="diskTotal"
                      className="field__control field__control--mono"
                      placeholder="500 GB"
                      value={form.diskTotal}
                      onChange={handleChange}
                      required
                    />
                  )}
                </Field>

                <Field label="Livre" icon={<Database size={12} />}>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      name="diskFree"
                      className="field__control field__control--mono"
                      placeholder="40 GB"
                      value={form.diskFree}
                      onChange={handleChange}
                      required
                    />
                  )}
                </Field>
              </div>

              <div className="form__actions">
                <button type="submit" className="btn btn--primary btn--block">
                  Gerar e-mail
                </button>
              </div>
            </form>

            <ThresholdMeter
              percentual={form.percentual}
              limiteAlerta={10}
              limiteEncerramento={15}
            />
          </section>
        </div>

        <section className="panel">
          {corpo ? (
            <>
              <div className="panel__head">
                <span className="panel__title">
                  <Inbox size={14} />
                  E-mail gerado
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setForm(FORM_VAZIO);
                    setCorpo(null);
                  }}
                >
                  Limpar
                </button>
              </div>

              <OutputBlock label="Corpo" value={corpo} />
            </>
          ) : (
            <State icon={<Inbox size={19} />} title="Nada gerado ainda">
              Preencha os dados do alerta ao lado. O reforço reaproveita o
              assunto e os destinatários do primeiro contato.
            </State>
          )}
        </section>
      </div>
    </>
  );
}
