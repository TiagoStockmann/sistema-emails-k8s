import axios from "axios";

export type ApiStatus = "checking" | "online" | "offline";

let status: ApiStatus = "checking";
const listeners = new Set<() => void>();

export function getApiStatus(): ApiStatus {
  return status;
}

export function subscribeApiStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setStatus(next: ApiStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
}

export const api = axios.create({
  baseURL: "/api",
  timeout: 12000,
});

/**
 * Toda resposta vira sinal de disponibilidade: se o backend respondeu — mesmo
 * com 404 ou 500 — ele está de pé. Só falha sem resposta significa fora do ar.
 */
api.interceptors.response.use(
  (response) => {
    setStatus("online");
    return response;
  },
  (error) => {
    setStatus(error.response ? "online" : "offline");
    return Promise.reject(error);
  }
);

/** Consulta usada quando nenhuma tela pediu dados ainda. */
export async function probeApi(): Promise<void> {
  try {
    await api.get("/Clientes");
  } catch {
    // o interceptor já registrou o resultado
  }
}
