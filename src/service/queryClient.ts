import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
// QueryClient é usado para gerenciar o estado global e as consultas de dados

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;



export const queryClient = new QueryClient({
  // defaultOptions: define opções padrão para todoas as consultas
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // desativa atualização automática quando troca de aba no navegador
      retry(failureCount, error) { // retry recebe como parametros: o número de falhas e o tipo de erro, e decide se vai tentar novamente a consulta
        if (failureCount >= 3) {
          return false;
        }
        if (error instanceof Error && axios.isAxiosError(error)) {
          if (
            error.response?.status &&
            error.response.status >= 400 &&
            error.response.status < 500
          ) {
            return false;
          }
        }

        return true;
      },
    },
  },
});

export default queryClient;
