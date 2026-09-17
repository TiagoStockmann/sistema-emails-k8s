import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import type { Cliente } from "../types/Cliente";

type Estado = "carregando" | "pronto" | "erro";

/** Carrega a lista de clientes, compartilhada por todos os geradores. */
export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [estado, setEstado] = useState<Estado>("carregando");

  // Só toca no estado depois da resposta — o estado inicial já é "carregando".
  const buscar = useCallback(async () => {
    try {
      const { data } = await api.get<Cliente[]>("/Clientes");
      setClientes(data);
      setEstado("pronto");
    } catch {
      setEstado("erro");
    }
  }, []);

  const recarregar = useCallback(async () => {
    setEstado("carregando");
    await buscar();
  }, [buscar]);

  useEffect(() => {
    // Busca ao montar. A regra sinaliza qualquer setState alcançável a partir
    // do efeito; aqui ele só ocorre depois da resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscar();
  }, [buscar]);

  return { clientes, estado, recarregar };
}
