import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AtSign,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import State, { Skeleton } from "../components/State";
import { api } from "../api/api";
import type { Cliente, Email } from "../types/Cliente";

type Estado = "carregando" | "pronto" | "erro";

export default function ClienteEmails() {
  const { clienteId } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [estado, setEstado] = useState<Estado>("carregando");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState<Email | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Só toca no estado depois da resposta — o estado inicial já é "carregando".
  const buscar = useCallback(async () => {
    try {
      const { data } = await api.get<Cliente>(`/Clientes/${clienteId}`);
      setCliente(data);
      setEstado("pronto");
    } catch {
      setEstado("erro");
    }
  }, [clienteId]);

  const carregar = useCallback(async () => {
    setEstado("carregando");
    await buscar();
  }, [buscar]);

  useEffect(() => {
    // Busca ao montar. A regra sinaliza qualquer setState alcançável a partir
    // do efeito; aqui ele só ocorre depois da resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscar();
  }, [buscar]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

    if (!nomeLimpo || !emailLimpo) {
      toast.error("Preencha o contato e o e-mail");
      return;
    }

    const payload = {
      clienteId: Number(clienteId),
      nome: nomeLimpo,
      email: emailLimpo,
    };

    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/Email/${editando.emailId}`, payload);
        toast.success("E-mail atualizado");
      } else {
        await api.post("/Email", payload);
        toast.success("E-mail cadastrado");
      }

      setNome("");
      setEmail("");
      setEditando(null);
      carregar();
    } catch {
      toast.error("O e-mail não foi salvo. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(item: Email) {
    const confirmado = confirm(`Remover ${item.email} dos destinatários?`);
    if (!confirmado) return;

    try {
      await api.delete(`/Email/${item.emailId}`);
      toast.success("E-mail removido");
      carregar();
    } catch {
      toast.error("O e-mail não foi removido. Tente novamente.");
    }
  }

  function handleEditar(item: Email) {
    setEditando(item);
    setNome(item.nome);
    setEmail(item.email);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const voltar = (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={() => navigate("/clientes")}
    >
      <ArrowLeft size={14} />
      Clientes
    </button>
  );

  if (estado === "erro") {
    return (
      <>
        <PageHeader
          eyebrow="Cadastro"
          title="Destinatários"
          description="Contatos que recebem os e-mails operacionais deste cliente."
          actions={voltar}
        />

        <section className="panel">
          <State
            tone="error"
            icon={<TriangleAlert size={19} />}
            title="O cliente não carregou"
            action={
              <button type="button" className="btn btn--ghost" onClick={carregar}>
                <RefreshCw size={14} />
                Tentar de novo
              </button>
            }
          >
            O backend não respondeu, ou este cliente não existe mais.
          </State>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Cadastro"
        title={cliente ? `Destinatários · ${cliente.nome}` : "Destinatários"}
        description="Contatos que entram na linha Para dos e-mails operacionais deste cliente."
        actions={voltar}
      />

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">
            {editando ? <Pencil size={14} /> : <Plus size={14} />}
            {editando ? `Editando ${editando.nome}` : "Novo destinatário"}
          </span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <Field label="Contato" icon={<UserRound size={12} />}>
              {(id) => (
                <input
                  id={id}
                  type="text"
                  className="field__control"
                  placeholder="NOC, Infraestrutura, Financeiro…"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              )}
            </Field>

            <Field label="E-mail" icon={<AtSign size={12} />}>
              {(id) => (
                <input
                  id={id}
                  type="email"
                  className="field__control field__control--mono"
                  placeholder="noc@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={salvando}
            >
              {editando ? "Salvar alterações" : "Cadastrar e-mail"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setEditando(null);
                  setNome("");
                  setEmail("");
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel__head">
          <div>
            <span className="panel__title">
              <AtSign size={14} />
              Destinatários
            </span>
            {cliente && (
              <p className="panel__count">
                {cliente.emails.length}{" "}
                {cliente.emails.length === 1 ? "contato" : "contatos"}
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={carregar}
            disabled={estado === "carregando"}
          >
            <RefreshCw size={13} />
            Atualizar
          </button>
        </div>

        {estado === "carregando" && <Skeleton rows={3} />}

        {estado === "pronto" && cliente && cliente.emails.length === 0 && (
          <State icon={<AtSign size={19} />} title="Nenhum destinatário">
            Sem contatos, os e-mails deste cliente saem apenas com a cópia para
            o N1. Cadastre o primeiro acima.
          </State>
        )}

        {estado === "pronto" && cliente && cliente.emails.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contato</th>
                  <th>E-mail</th>
                  <th className="table__right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {cliente.emails.map((item) => (
                  <tr key={item.emailId}>
                    <td>
                      <span className="id-tag">#{item.emailId}</span>
                    </td>

                    <td className="table__name">{item.nome}</td>

                    <td>
                      <span className="chip">{item.email}</span>
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => handleEditar(item)}
                        >
                          <Pencil size={13} />
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn--danger btn--sm"
                          onClick={() => handleExcluir(item)}
                        >
                          <Trash2 size={13} />
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
