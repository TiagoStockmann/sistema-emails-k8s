import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AtSign,
  Building2,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import State, { Skeleton } from "../components/State";
import { api } from "../api/api";
import { useClientes } from "../hooks/useClientes";
import type { Cliente } from "../types/Cliente";

/** Clientes grandes têm dezenas de contatos; a linha da tabela mostra uma amostra. */
const CHIPS_VISIVEIS = 4;

export default function Clientes() {
  const { clientes, estado, recarregar } = useClientes();
  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function fecharMenu() {
      setMenuAberto(null);
    }

    document.addEventListener("click", fecharMenu);
    return () => document.removeEventListener("click", fecharMenu);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const valor = nome.trim();
    if (!valor) {
      toast.error("Informe o nome do cliente");
      return;
    }

    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/Clientes/${editando.clienteId}`, { nome: valor });
        toast.success("Cliente atualizado");
      } else {
        await api.post("/Clientes", { nome: valor });
        toast.success("Cliente cadastrado");
      }

      setNome("");
      setEditando(null);
      recarregar();
    } catch {
      toast.error("O cliente não foi salvo. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(cliente: Cliente) {
    const confirmado = confirm(
      `Excluir ${cliente.nome} e os ${cliente.emails.length} e-mail(s) vinculados?`
    );
    if (!confirmado) return;

    try {
      await api.delete(`/Clientes/${cliente.clienteId}`);
      toast.success("Cliente excluído");
      recarregar();
    } catch {
      toast.error("O cliente não foi excluído. Tente novamente.");
    }
  }

  function handleEditar(cliente: Cliente) {
    setEditando(cliente);
    setNome(cliente.nome);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Cadastro"
        title="Clientes"
        description="Os clientes daqui alimentam a lista de destinatários dos e-mails operacionais."
        actions={
          <button
            type="button"
            className="btn btn--ghost"
            onClick={recarregar}
            disabled={estado === "carregando"}
          >
            <RefreshCw size={14} />
            Atualizar
          </button>
        }
      />

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">
            {editando ? <Pencil size={14} /> : <Plus size={14} />}
            {editando ? `Editando ${editando.nome}` : "Novo cliente"}
          </span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <Field label="Nome do cliente" icon={<Building2 size={12} />}>
            {(id) => (
              <input
                id={id}
                type="text"
                className="field__control"
                placeholder="ApliDigital"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            )}
          </Field>

          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={salvando}
            >
              {editando ? "Salvar alterações" : "Cadastrar cliente"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setEditando(null);
                  setNome("");
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
              <Users size={14} />
              Clientes cadastrados
            </span>
            {estado === "pronto" && (
              <p className="panel__count">
                {clientes.length}{" "}
                {clientes.length === 1 ? "cliente" : "clientes"}
              </p>
            )}
          </div>
        </div>

        {estado === "carregando" && <Skeleton />}

        {estado === "erro" && (
          <State
            tone="error"
            icon={<TriangleAlert size={19} />}
            title="A lista não carregou"
            action={
              <button type="button" className="btn btn--ghost" onClick={recarregar}>
                <RefreshCw size={14} />
                Tentar de novo
              </button>
            }
          >
            O backend não respondeu. Verifique o indicador na barra superior e
            tente novamente.
          </State>
        )}

        {estado === "pronto" && clientes.length === 0 && (
          <State icon={<Users size={19} />} title="Nenhum cliente ainda">
            Cadastre o primeiro cliente no formulário acima para começar a gerar
            e-mails com destinatários.
          </State>
        )}

        {estado === "pronto" && clientes.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Destinatários</th>
                  <th className="table__right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.clienteId}>
                    <td>
                      <span className="id-tag">#{cliente.clienteId}</span>
                    </td>

                    <td className="table__name">{cliente.nome}</td>

                    <td>
                      {cliente.emails.length > 0 ? (
                        <div className="chips">
                          {cliente.emails.slice(0, CHIPS_VISIVEIS).map((contato) => (
                            <span key={contato.emailId} className="chip">
                              {contato.email}
                            </span>
                          ))}

                          {cliente.emails.length > CHIPS_VISIVEIS && (
                            <button
                              type="button"
                              className="chip chip--mais"
                              onClick={() =>
                                navigate(`/clientes/${cliente.clienteId}/emails`)
                              }
                            >
                              +{cliente.emails.length - CHIPS_VISIVEIS}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="dim">Sem destinatários</span>
                      )}
                    </td>

                    <td>
                      <div className="menu">
                        <button
                          type="button"
                          className="menu__btn"
                          aria-label={`Ações de ${cliente.nome}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAberto((atual) =>
                              atual === cliente.clienteId
                                ? null
                                : cliente.clienteId
                            );
                          }}
                        >
                          <MoreVertical size={15} />
                        </button>

                        {menuAberto === cliente.clienteId && (
                          <div
                            className="menu__pop"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="menu__item"
                              onClick={() =>
                                navigate(
                                  `/clientes/${cliente.clienteId}/emails`
                                )
                              }
                            >
                              <AtSign size={14} />
                              Gerenciar e-mails
                            </button>

                            <button
                              type="button"
                              className="menu__item"
                              onClick={() => handleEditar(cliente)}
                            >
                              <Pencil size={14} />
                              Renomear cliente
                            </button>

                            <button
                              type="button"
                              className="menu__item menu__item--danger"
                              onClick={() => handleExcluir(cliente)}
                            >
                              <Trash2 size={14} />
                              Excluir cliente
                            </button>
                          </div>
                        )}
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
