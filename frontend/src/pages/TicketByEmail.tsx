import { Inbox } from "lucide-react";
import OutputBlock from "../components/OutputBlock";
import PageHeader from "../components/PageHeader";

const ASSUNTO = "Abertura de chamado – Suporte Vortex";

const CORPO = `Olá! Seja bem-vindo(a) à Vortex. Tudo bem?

Como podemos te ajudar hoje?

Para abrir uma solicitação ou chamado, é só enviar um e-mail para:

services.support@vortexti.com.br

Por favor, inclua no e-mail:

Assunto: Título da solicitação
Descrição: Detalhamento do problema ou dúvida

Assim que recebermos, nosso sistema criará um chamado automaticamente e você receberá todas as atualizações por e-mail.

Se preferir falar por telefone: (11) 3796-2779

Estamos à disposição!

Atenciosamente,
Equipe Vortex`;

export default function TicketByEmail() {
  return (
    <>
      <PageHeader
        eyebrow="Chamados"
        title="Abertura de ticket"
        description="Resposta padrão que orienta o cliente a registrar a solicitação pelo canal correto."
      />

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">
            <Inbox size={14} />
            E-mail padrão
          </span>
        </div>

        <OutputBlock label="Assunto" value={ASSUNTO} />
        <OutputBlock label="Corpo" value={CORPO} />
      </section>
    </>
  );
}
