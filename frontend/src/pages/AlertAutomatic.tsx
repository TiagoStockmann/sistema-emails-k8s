import { BellRing } from "lucide-react";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";

const TEXTO_JIRA = `Alerta identificado pelo sistema de monitoramento e analisado pela equipe.

O evento foi aberto e encerrado automaticamente em um curto intervalo de tempo, sem necessidade de intervenção manual. Durante a análise, não foi identificada nenhuma anomalia persistente no ambiente, indicando que o alerta pode ter sido um falso positivo ou uma condição transitória.

No momento da verificação, o ambiente encontrava-se estável e operante.

Diante do cenário apresentado, nenhuma ação corretiva foi realizada e este alerta está sendo encerrado. O ambiente permanecerá sob monitoramento contínuo para identificação de possíveis recorrências.`;

export default function AlertAutomatic() {
  return (
    <>
      <PageHeader
        eyebrow="Chamados"
        title="Alerta resolvido automaticamente"
        description="Registro de encerramento para alertas que abriram e fecharam sozinhos, sem intervenção."
      />

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">
            <BellRing size={14} />
            Registro no Jira
          </span>
        </div>

        <OutputBlock label="Texto para o Jira" value={TEXTO_JIRA} />
      </section>
    </>
  );
}
