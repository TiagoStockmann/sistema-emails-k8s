import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Inbox,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";
import State from "../components/State";
import { PERIODOS } from "../constants/periodos";

type FormData = {
  periodo: string;
  host: string;
  date: string;
  time: string;
};

const FORM_VAZIO: FormData = {
  periodo: "",
  host: "",
  date: "",
  time: "",
};

function formatarData(iso: string): string {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ReinforcingPowerDown() {
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

Entramos em contato para reforçar o alerta previamente enviado referente ao host ${form.host}, que permanece desligado desde ${formatarData(form.date)} às ${form.time}.

Até o momento, não recebemos confirmação se o desligamento foi intencional ou decorrente de algum incidente.

Poderiam, por gentileza, nos atualizar se essa máquina permanecerá desligada temporariamente ou de forma definitiva?

Seguimos acompanhando o ambiente e à disposição para qualquer suporte necessário.

Atenciosamente,`);

    toast.success("E-mail gerado");
  }

  return (
    <>
      <PageHeader
        eyebrow="Alertas por e-mail"
        title="Power down — reforço"
        description="Segunda cobrança quando o host segue desligado sem confirmação."
      />

      <div className="gen">
        <div className="gen__side">
          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <SlidersHorizontal size={14} />
                Dados do desligamento
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

              <div className="form__row">
                <Field label="Data" icon={<CalendarDays size={12} />}>
                  {(id) => (
                    <input
                      id={id}
                      type="date"
                      name="date"
                      className="field__control field__control--mono"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  )}
                </Field>

                <Field label="Hora" icon={<Clock size={12} />}>
                  {(id) => (
                    <input
                      id={id}
                      type="time"
                      name="time"
                      className="field__control field__control--mono"
                      value={form.time}
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
              Informe o host e o momento do desligamento ao lado. O reforço
              reaproveita o assunto e os destinatários do primeiro contato.
            </State>
          )}
        </section>
      </div>
    </>
  );
}
