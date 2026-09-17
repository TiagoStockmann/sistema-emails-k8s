import { useState } from "react";
import { ClipboardList, FileText } from "lucide-react";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";
import State from "../components/State";

type TriagemKey =
  | "create_vm"
  | "delete_vm"
  | "snapshot"
  | "vpn"
  | "cisco"
  | "performance"
  | "access";

type Triagem = {
  key: TriagemKey;
  label: string;
  texto: string;
};

const TRIAGENS: Triagem[] = [
  {
    key: "create_vm",
    label: "Criação de VM",
    texto: `Solicitação recebida para criação de nova máquina virtual.

A demanda será analisada considerando recursos necessários, políticas do ambiente e capacidade disponível. Após a validação, a atividade será programada e executada conforme alinhamento com o solicitante.`,
  },
  {
    key: "delete_vm",
    label: "Exclusão de VM",
    texto: `Solicitação de exclusão de máquina virtual registrada.

A ação será realizada somente após validação formal e confirmação de que não há dependências ou impactos em serviços críticos. Backups e snapshots existentes serão verificados antes da execução.`,
  },
  {
    key: "snapshot",
    label: "Criação de snapshot",
    texto: `Solicitação para criação de snapshot de máquina virtual.

A atividade será avaliada considerando boas práticas de armazenamento e impacto no desempenho. O snapshot será criado conforme necessidade informada e removido posteriormente, se aplicável.`,
  },
  {
    key: "vpn",
    label: "Problema de VPN",
    texto: `Relato de problema de conectividade VPN recebido.

Serão realizadas verificações iniciais de disponibilidade, autenticação e status do túnel. Caso necessário, o chamado poderá ser escalonado para análise mais aprofundada.`,
  },
  {
    key: "cisco",
    label: "Chamado Cisco",
    texto: `Identificada necessidade de abertura de chamado junto ao fabricante Cisco.

As informações técnicas serão consolidadas e o case será aberto conforme contrato vigente, seguindo o fluxo de suporte do fabricante.`,
  },
  {
    key: "performance",
    label: "Problema de performance",
    texto: `Relato de degradação de performance no ambiente.

A equipe realizará análise de consumo de recursos, logs e métricas para identificar a causa raiz e propor as ações corretivas necessárias.`,
  },
  {
    key: "access",
    label: "Problema de acesso",
    texto: `Relato de problema de acesso ao ambiente ou serviço.

Serão realizadas verificações iniciais de permissões, autenticação e disponibilidade para identificar a origem do problema e restabelecer o acesso.`,
  },
];

export default function Triagens() {
  const [selecionada, setSelecionada] = useState<TriagemKey | null>(null);
  const triagem = TRIAGENS.find((t) => t.key === selecionada);

  return (
    <>
      <PageHeader
        eyebrow="Triagem"
        title="Textos de triagem"
        description="Registro inicial no Jira para os cenários mais recorrentes do plantão."
      />

      <div className="gen">
        <div className="gen__side">
          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <ClipboardList size={14} />
                Cenário
              </span>
            </div>

            <div className="picker">
              {TRIAGENS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={
                    item.key === selecionada
                      ? "picker__item picker__item--active"
                      : "picker__item"
                  }
                  aria-pressed={item.key === selecionada}
                  onClick={() => setSelecionada(item.key)}
                >
                  <FileText size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="panel">
          {triagem ? (
            <>
              <div className="panel__head">
                <span className="panel__title">
                  <FileText size={14} />
                  {triagem.label}
                </span>
              </div>

              <OutputBlock
                key={triagem.key}
                label="Texto para o Jira"
                value={triagem.texto}
              />
            </>
          ) : (
            <State icon={<ClipboardList size={19} />} title="Escolha um cenário">
              Selecione o cenário ao lado para ver o texto de triagem pronto
              para colar no chamado.
            </State>
          )}
        </section>
      </div>
    </>
  );
}
