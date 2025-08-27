# 🚀 K6 Serverest - Testes de Performance

Este projeto implementa testes de performance usando **K6** para a API **Serverest**, permitindo avaliar o comportamento e a capacidade de resposta da aplicação sob diferentes cargas de usuários.

## 📋 Descrição

O projeto realiza testes de carga progressiva na API Serverest, testando endpoints específicos como produtos, com métricas de performance configuradas para garantir qualidade e estabilidade da aplicação.

## 🎯 Objetivos

- **Teste de Carga Progressiva**: Avaliar performance com aumento gradual de usuários
- **Métricas de Qualidade**: Garantir tempos de resposta adequados
- **Relatórios HTML**: Gerar relatórios visuais dos resultados dos testes
- **Configuração Flexível**: Suporte para ambientes local e de produção

## 🏗️ Estrutura do Projeto

```
k6-serverest/
├── README.MD              # Documentação do projeto
├── serverest.js           # Script principal de teste K6
├── summary.html           # Relatório HTML gerado automaticamente
└── utils/
    └── serverestUtils.js  # Configurações e endpoints da API
```

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [K6](https://k6.io/docs/getting-started/installation/) instalado no sistema
- API Serverest rodando (local ou remota)

## 🚀 Instalação

### 1. Instalar K6

#### Windows (via Chocolatey):

```bash
choco install k6
```

#### Windows (via Scoop):

```bash
scoop install k6
```

#### Windows (via MSI):

Baixe o instalador MSI da [página oficial do K6](https://k6.io/docs/getting-started/installation/)

### 2. Verificar Instalação

```bash
k6 version
```

## ⚡ Configuração

### Endpoints da API

O projeto suporta dois ambientes configurados em `utils/serverestUtils.js`:

- **Local**: `http://localhost:3000/`
- **Produção**: `https://serverest.dev/`

Para alterar o ambiente, edite o arquivo `utils/serverestUtils.js`:

```javascript
export const ENDPOINTS = {
  urlBase: "https://serverest.dev/", // Produção
  urlBaseLocalHost: "http://localhost:3000/", // Local
  urlProdutos: "produtos",
};
```

## 🧪 Executando os Testes

### Execução Básica

```bash
k6 run serverest.js
```

### Execução com Variáveis de Ambiente

```bash
k6 run -e ENVIRONMENT=local serverest.js
```

### Execução com Configurações Customizadas

```bash
k6 run --out json=results.json serverest.js
```

## 📊 Configuração dos Testes

### Cenários de Teste

O projeto utiliza um cenário de **ramping VUs** (Virtual Users) com as seguintes etapas:

1. **Rampa de Subida**: 0 → 500 usuários em 2 minutos
2. **Estabilização**: 500 → 1000 usuários em 2 minutos
3. **Pico de Carga**: 1000 → 1500 usuários em 2 minutos
4. **Rampa de Descida**: 1500 → 0 usuários em 2 minutos

**Duração Total**: 8 minutos

### Thresholds (Limites de Qualidade)

- **Iterações**: Mínimo de 5000 execuções
- **Tempo de Resposta**:
  - Média < 1000ms (1 segundo)
  - 95% das requisições < 2000ms (2 segundos)
- **Taxa de Falha**: < 1% (0.01)

## 📈 Relatórios

### Relatório HTML Automático

O projeto gera automaticamente um relatório HTML (`summary.html`) após cada execução, contendo:

- Gráficos de performance
- Métricas detalhadas
- Análise de tendências
- Comparação de resultados

### Acessando o Relatório

Após a execução dos testes, abra o arquivo `summary.html` em qualquer navegador web.

## 🔧 Personalização

### Modificando Cenários

Para alterar os cenários de teste, edite o arquivo `serverest.js`:

```javascript
export const options = {
  scenarios: {
    custom: {
      executor: "ramping-vus",
      stages: [
        { duration: "1m", target: 100 }, // 0 → 100 usuários em 1 min
        { duration: "2m", target: 100 }, // Manter 100 usuários por 2 min
        { duration: "1m", target: 0 }, // Reduzir para 0 usuários
      ],
    },
  },
  // ... outros parâmetros
};
```

### Adicionando Novos Endpoints

Para testar novos endpoints, adicione-os em `utils/serverestUtils.js`:

```javascript
export const ENDPOINTS = {
  // ... endpoints existentes
  urlUsuarios: "usuarios",
  urlCarrinhos: "carrinhos",
};
```

E implemente os testes em `serverest.js`:

```javascript
export default function () {
  // Teste de produtos
  const res1 = http.get(
    `${ENDPOINTS.urlBaseLocalHost}${ENDPOINTS.urlProdutos}`
  );
  check(res1, {
    "Status da requisição Produtos é 200": (r) => r.status === 200,
  });

  // Teste de usuários
  const res2 = http.get(
    `${ENDPOINTS.urlBaseLocalHost}${ENDPOINTS.urlUsuarios}`
  );
  check(res2, {
    "Status da requisição Usuários é 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
```

## 📝 Logs e Debug

### Habilitando Logs

Para ver logs detalhados durante a execução, descomente as linhas em `serverest.js`:

```javascript
// console.log("Chamada da API retornou o status: " + res1.status);
// console.log("URL da requisição: " + res1.request.url);
```

### Verbose Mode

Execute com modo verbose para mais detalhes:

```bash
k6 run --verbose serverest.js
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **K6 não encontrado**: Verifique se o K6 está instalado e no PATH
2. **API não responde**: Confirme se a API Serverest está rodando
3. **Erro de certificado**: Para HTTPS, pode ser necessário configurar certificados
4. **Porta ocupada**: Verifique se a porta 3000 não está sendo usada por outro serviço

### Verificações de Diagnóstico

```bash
# Testar conectividade com a API
curl http://localhost:3000/produtos

# Verificar status do K6
k6 version

# Executar teste simples
k6 run --no-usage-report serverest.js
```

## 📚 Recursos Adicionais

- [Documentação Oficial do K6](https://k6.io/docs/)
- [Serverest API Documentation](https://serverest.dev/)
- [K6 Examples](https://github.com/grafana/k6-examples)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvedor**: [Kaique Ferraz]
- **Projeto**: K6 Serverest Performance Tests
- **Data**: 2025

---

**⭐ Se este projeto foi útil, considere dar uma estrela no repositório!**
