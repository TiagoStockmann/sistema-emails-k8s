import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Inbox,
  Server,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";
import RecipientPicker, { type Selecao } from "../components/RecipientPicker";
import State from "../components/State";
import { useClientes } from "../hooks/useClientes";
import { COPIA_N1, PERIODOS } from "../constants/periodos";

type FormData = {
  clienteId: string;
  periodo: string;
  host: string;
  date: string;
  time: string;
};

type Gerado = {
  para: string;
  cc: string;
  assunto: string;
  corpo: string;
};

const FORM_VAZIO: FormData = {
  clienteId: "",
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

export default function FirstPowerDown() {
  const { clientes, estado } = useClientes();
  const [form, setForm] = useState<FormData>(FORM_VAZIO);
  const [gerado, setGerado] = useState<Gerado | null>(null);
  // null = ainda não mexeram na seleção, então vale o padrão: todos em Para.
  const [selecao, setSelecao] = useState<Selecao | null>(null);

  const clienteSelecionado = clientes.find(
    (c) => c.clienteId === Number(form.clienteId)
  );

  const selecaoAtual: Selecao =
    selecao ??
    Object.fromEntries(
      (clienteSelecionado?.emails ?? []).map((c) => [c.emailId, "para"])
    );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    // Trocar de cliente descarta a seleção do anterior.
    if (name === "clienteId") setSelecao(null);

    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  function handleGerar(e: React.FormEvent) {
    e.preventDefault();

    const cliente = clienteSelecionado;

    if (!cliente) {
      toast.error("Escolha um cliente para montar os destinatários");
      return;
    }

    const contatosPara = cliente.emails.filter(
      (contato) => selecaoAtual[contato.emailId] === "para"
    );
    const contatosCc = cliente.emails.filter(
      (contato) => selecaoAtual[contato.emailId] === "cc"
    );

    if (cliente.emails.length > 0 && contatosPara.length === 0) {
      toast.error("Marque ao menos um destinatário em Para");
      return;
    }

    const para = contatosPara.map((contato) => contato.email).join(", ");
    const cc = [...contatosCc.map((contato) => contato.email), COPIA_N1].join(
      ", "
    );

    const assunto = `[${cliente.nome}] - VM Power Down - ${form.host}`;

    const corpo = `Prezados, ${form.periodo}!

Nosso sistema de monitoramento identificou que o host ${form.host} foi desligado às ${form.time} de ${formatarData(form.date)}.

Poderiam, por gentileza, confirmar se essa ação foi intencional (por manutenção, atualização, desligamento programado, etc.)?

Caso o desligamento tenha sido proposital, solicitamos informar se a máquina permanecerá desligada provisoriamente ou definitivamente, para que possamos ajustar o monitoramento conforme a necessidade.

Aguardamos o retorno da equipe responsável.

Atenciosamente,`;

    setGerado({ para, cc, assunto, corpo });
    toast.success("E-mail gerado");
  }

  return (
    <>
      <PageHeader
        eyebrow="Alertas por e-mail"
        title="Power down — primeiro contato"
        description="Confirmação de desligamento de host junto ao cliente."
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

              <Field label="Cliente" icon={<Users size={12} />}>
                {(id) => (
                  <select
                    id={id}
                    name="clienteId"
                    className="field__control"
                    value={form.clienteId}
                    onChange={handleChange}
                    required
                    disabled={estado !== "pronto"}
                  >
                    <option value="">
                      {estado === "carregando"
                        ? "Carregando clientes…"
                        : estado === "erro"
                          ? "Clientes indisponíveis"
                          : "Escolha o cliente"}
                    </option>
                    {clientes.map((c) => (
                      <option key={c.clienteId} value={c.clienteId}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              {clienteSelecionado && (
                <RecipientPicker
                  emails={clienteSelecionado.emails}
                  selecionados={selecaoAtual}
                  onChange={setSelecao}
                  copiaFixa={COPIA_N1}
                />
              )}

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
          {gerado ? (
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
                    setGerado(null);
                    setSelecao(null);
                  }}
                >
                  Limpar
                </button>
              </div>

              <OutputBlock label="Para" value={gerado.para} />
              <OutputBlock label="CC" value={gerado.cc} />
              <OutputBlock label="Assunto" value={gerado.assunto} />
              <OutputBlock label="Corpo" value={gerado.corpo} />
            </>
          ) : (
            <State icon={<Inbox size={19} />} title="Nada gerado ainda">
              Informe o host e o momento do desligamento ao lado. O e-mail
              aparece aqui em três campos, prontos para copiar na ordem.
            </State>
          )}
        </section>
      </div>
    </>
  );
}
