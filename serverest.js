import http from "k6/http";
import { check, sleep } from "k6";
import { ENDPOINTS } from "./utils/serverestUtils.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Executor: "ramping-vus" - Aumenta e diminui gradualmente o número de usuários virtuais
export const options = {
  scenarios: {
    default: {
      executor: "ramping-vus",
      stages: [
        { duration: "2m", target: 500 },
        { duration: "2m", target: 1000 },
        { duration: "2m", target: 1500 },
        { duration: "2m", target: 0 },
      ],
    },
  },

  // Thresholds para as métricas de performance
  thresholds: {
    iterations: ["count>5000"], // Mínimo de 5000 execuções
    http_req_duration: ["avg<1000", "p(95)<2000"], // Tempo médio de resposta menor que 1000ms/1s e // 95% das requisições abaixo de 2000ms
    http_req_failed: ["rate<0.01"], // Menos de 1% de falhas
  },
};

// Função principal que realiza a chamada à API
export default function () {
  const res1 = http.get(
    `${ENDPOINTS.urlBaseLocalHost}${ENDPOINTS.urlProdutos}`
  );

  check(res1, {
    "Status da requisição Produtos é 200": (r) => r.status === 200,
  });

  sleep(0.5);
}

// Função para gerar o relatório HTML
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
