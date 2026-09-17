BEGIN;
WITH c AS (INSERT INTO cliente (nome) VALUES ('EMPRESA EXEMPLO') RETURNING cliente_id)
INSERT INTO emails (cliente_id, nome, email)
SELECT c.cliente_id, v.nome, v.email FROM c CROSS JOIN (VALUES
    ('Joao Silva', 'joao.silva@exemplo.com'),
    ('Maria Souza', 'maria.souza@exemplo.com')
) AS v(nome, email)
ON CONFLICT (email) DO NOTHING;
COMMIT;
