import { useState } from "react";
import {
  Clock,
  Database,
  HardDrive,
  Inbox,
  Percent,
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
import ThresholdMeter from "../components/ThresholdMeter";
import { useClientes } from "../hooks/useClientes";
import { COPIA_N1, PERIODOS } from "../constants/periodos";

type FormData = {
  clienteId: string;
  periodo: string;
  host: string;
  particao: string;
  percentual: string;
  diskTotal: string;
  diskFree: string;
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
  particao: "",
  percentual: "",
  diskTotal: "",
  diskFree: "",
};

/** A Vexia opera com limiares próprios, mais apertados que o padrão. */
function limiares(nomeCliente: string | undefined) {
  const vexia = nomeCliente === "Vexia";
  return { alerta: vexia ? 5 : 10, encerramento: vexia ? 6 : 15 };
}

function porcentagem(valor: number) {
  return `${valor.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`;
}

export default function FirstDisk() {
  const { clientes, estado } = useClientes();
  const [form, setForm] = useState<FormData>(FORM_VAZIO);
  const [gerado, setGerado] = useState<Gerado | null>(null);
  // null = ainda não mexeram na seleção, então vale o padrão: todos em Para.
  const [selecao, setSelecao] = useState<Selecao | null>(null);

  const clienteSelecionado = clientes.find(
    (c) => c.clienteId === Number(form.clienteId)
  );
  const { alerta, encerramento } = limiares(clienteSelecionado?.nome);

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

    if (!clienteSelecionado) {
      toast.error("Escolha um cliente para montar os destinatários");
      return;
    }

    const contatosPara = clienteSelecionado.emails.filter(
      (contato) => selecaoAtual[contato.emailId] === "para"
    );
    const contatosCc = clienteSelecionado.emails.filter(
      (contato) => selecaoAtual[contato.emailId] === "cc"
    );

    if (clienteSelecionado.emails.length > 0 && contatosPara.length === 0) {
      toast.error("Marque ao menos um destinatário em Para");
      return;
    }

    const para = contatosPara.map((contato) => contato.email).join(", ");
    const cc = [...contatosCc.map((contato) => contato.email), COPIA_N1].join(
      ", "
    );

    const assunto = `[${clienteSelecionado.nome}] - Alerta de espaço ${form.particao} - ${form.host}`;

    const corpo = `Prezados, ${form.periodo}!

Identificamos, através do nosso sistema de monitoramento, que o volume ${form.particao} do host ${form.host} encontra-se com espaço livre abaixo do limite recomendado.

Situação atual:
- Espaço livre: ${form.percentual} (${form.diskFree} disponíveis de ${form.diskTotal} totais)
- Limite configurado para alerta: ${porcentagem(alerta)}

Importante: a condição para que o alerta seja automaticamente finalizado é que as últimas 10 aferições do percentual de espaço livre da partição apresentem valores superiores a ${porcentagem(encerramento)}.

Atenciosamente,`;

    setGerado({ para, cc, assunto, corpo });
    toast.success("E-mail gerado");
  }

  return (
    <>
      <PageHeader
        eyebrow="Alertas por e-mail"
        title="Disco — primeiro contato"
        description="Primeira notificação de espaço livre abaixo do limite de alerta."
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
              limiteAlerta={alerta}
              limiteEncerramento={encerramento}
            />
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
              Preencha os dados do alerta ao lado. O e-mail aparece aqui em três
              campos, prontos para copiar na ordem.
            </State>
          )}
        </section>
      </div>
    </>
  );
}
