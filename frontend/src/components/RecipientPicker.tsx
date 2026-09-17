import { useMemo, useState } from "react";
import { AtSign, Search } from "lucide-react";
import type { Email } from "../types/Cliente";

/** Onde o contato entra no e-mail. Ausente do mapa = não entra. */
export type Destino = "para" | "cc";
export type Selecao = Record<number, Destino>;

type RecipientPickerProps = {
  /** Contatos cadastrados do cliente escolhido. */
  emails: Email[];
  /** Mapa emailId -> "para" | "cc". Quem não aparece aqui fica de fora. */
  selecionados: Selecao;
  onChange: (selecao: Selecao) => void;
  /** Endereço que sempre recebe cópia, independente da seleção. */
  copiaFixa: string;
};

/** A busca só aparece quando a lista deixa de caber na tela de uma vez. */
const LIMITE_SEM_BUSCA = 8;

export default function RecipientPicker({
  emails,
  selecionados,
  onChange,
  copiaFixa,
}: RecipientPickerProps) {
  const [busca, setBusca] = useState("");

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return emails;

    return emails.filter(
      (contato) =>
        contato.nome.toLowerCase().includes(termo) ||
        contato.email.toLowerCase().includes(termo)
    );
  }, [emails, busca]);

  /** Clicar no destino já ativo tira o contato do e-mail; clicar no outro move. */
  function definir(emailId: number, destino: Destino) {
    const proximo = { ...selecionados };
    if (proximo[emailId] === destino) {
      delete proximo[emailId];
    } else {
      proximo[emailId] = destino;
    }
    onChange(proximo);
  }

  if (emails.length === 0) {
    return (
      <div className="rcp">
        <span className="field__label">
          <AtSign size={12} />
          Destinatários
        </span>
        <p className="rcp__aviso">
          Este cliente não tem contatos cadastrados. O e-mail sairá apenas com a
          cópia para o N1.
        </p>
      </div>
    );
  }

  const totalMarcados = Object.keys(selecionados).length;
  const todosVisiveisMarcados =
    visiveis.length > 0 &&
    visiveis.every((contato) => selecionados[contato.emailId] !== undefined);

  function alternarVisiveis() {
    const proximo = { ...selecionados };
    if (todosVisiveisMarcados) {
      visiveis.forEach((contato) => delete proximo[contato.emailId]);
    } else {
      // Quem já tinha destino escolhido mantém; o resto entra em Para.
      visiveis.forEach((contato) => {
        if (proximo[contato.emailId] === undefined) {
          proximo[contato.emailId] = "para";
        }
      });
    }
    onChange(proximo);
  }

  return (
    <div className="rcp">
      <div className="rcp__head">
        <span className="field__label">
          <AtSign size={12} />
          Destinatários
        </span>
        <span className="rcp__count">
          {totalMarcados} de {emails.length}
        </span>
      </div>

      {emails.length > LIMITE_SEM_BUSCA && (
        <div className="rcp__search">
          <Search size={13} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar por nome ou e-mail"
            aria-label="Filtrar destinatários"
          />
        </div>
      )}

      <div className="rcp__bar">
        <button type="button" className="rcp__link" onClick={alternarVisiveis}>
          {todosVisiveisMarcados
            ? busca
              ? "Desmarcar filtrados"
              : "Desmarcar todos"
            : busca
              ? "Marcar filtrados em Para"
              : "Marcar todos em Para"}
        </button>
      </div>

      <div className="rcp__list">
        {visiveis.length === 0 ? (
          <p className="rcp__aviso">Nenhum contato corresponde ao filtro.</p>
        ) : (
          visiveis.map((contato) => {
            const destino = selecionados[contato.emailId];
            return (
              <div key={contato.emailId} className="rcp__row">
                <span className="rcp__texto">
                  <span className="rcp__nome">{contato.nome}</span>
                  <span className="rcp__mail">{contato.email}</span>
                </span>

                <div className="rcp__seg" role="group" aria-label={`Destino de ${contato.nome}`}>
                  <button
                    type="button"
                    className={`rcp__seg-btn rcp__seg-btn--para${destino === "para" ? " is-active" : ""}`}
                    onClick={() => definir(contato.emailId, "para")}
                    aria-pressed={destino === "para"}
                  >
                    Para
                  </button>
                  <button
                    type="button"
                    className={`rcp__seg-btn rcp__seg-btn--cc${destino === "cc" ? " is-active" : ""}`}
                    onClick={() => definir(contato.emailId, "cc")}
                    aria-pressed={destino === "cc"}
                  >
                    CC
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="rcp__fixo">
        <span className="rcp__mail">{copiaFixa}</span> entra sempre em cópia.
      </p>
    </div>
  );
}
