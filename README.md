# 💱 Conversor de Moedas

Uma aplicação web moderna para conversão de valores entre diferentes moedas, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **Conversão em tempo real**: Busca taxas de câmbio atualizadas da API externa
- **Fallback inteligente**: Usa taxas fixas quando a API não está disponível
- **Interface intuitiva**: Design responsivo e fácil de usar
- **10 moedas suportadas**: USD, EUR, BRL, GBP, JPY, CAD, AUD, CHF, CNY, SEK
- **Tratamento de erros**: Validação completa de entrada e tratamento de falhas
- **Testes automatizados**: Cobertura de testes para API e hooks
- **Deploy fácil**: Pronto para deploy na Vercel

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd test-conversor-moedas
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts disponíveis

- `npm run dev` - Executa o projeto em modo de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run start` - Executa a versão de produção
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Executa os testes com relatório de cobertura
- `npm run lint` - Executa o linter

## 🌍 Moedas Suportadas

As moedas, nomes e símbolos são centralizados em `src/constants/currencies.ts`.

Para ver a lista atualizada de moedas suportadas, consulte:

```ts
import { SUPPORTED_CURRENCIES, CURRENCY_NAMES, CURRENCY_SYMBOLS } from '@/constants/currencies';
```

## 🏗️ Arquitetura do Projeto

```
src/
├── app/
│   ├── api/convert/          # API route para conversão
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página inicial
├── components/
│   └── CurrencyConverter.tsx # Componente principal
└── hooks/
    └── useCurrencyConverter.ts # Hook personalizado
```

## 🔧 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Axios** - Cliente HTTP para APIs
- **Jest** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes

## 📡 API Externa

A aplicação utiliza a API [exchangerate.host](https://exchangerate.host/) para buscar taxas de câmbio em tempo real. Em caso de falha na API, o sistema automaticamente utiliza taxas fixas como fallback.

### Endpoints da API

- `GET /api/convert?amount=100&from=USD&to=BRL` - Converte valores
- `POST /api/convert` - Lista moedas suportadas (fonte: `SUPPORTED_CURRENCIES`)

## 🧪 Testes

O projeto inclui testes automatizados para:

- Hook de conversão de moedas
- API routes
- Tratamento de erros
- Validações de entrada

Execute os testes com:
```bash
npm test
```

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório à Vercel
3. A Vercel detectará automaticamente que é um projeto Next.js
4. O deploy será feito automaticamente

A aplicação estará disponível em uma URL da Vercel.

## 📝 Decisões Técnicas

### Por que Next.js?
- **SSR/SSG**: Melhor performance e SEO
- **API Routes**: Backend integrado sem necessidade de servidor separado
- **Deploy fácil**: Integração nativa com Vercel
- **TypeScript**: Suporte nativo e excelente DX

### Por que TypeScript?
- **Type Safety**: Reduz bugs em tempo de compilação
- **IntelliSense**: Melhor experiência de desenvolvimento
- **Refactoring**: Mais seguro e confiável

### Por que Tailwind CSS?
- **Utility-first**: Desenvolvimento mais rápido
- **Responsivo**: Mobile-first por padrão
- **Customizável**: Fácil de personalizar
- **Performance**: CSS otimizado automaticamente

### Tratamento de Erros
- **Validação de entrada**: Valores negativos, moedas inválidas
- **Fallback de API**: Taxas fixas quando API falha
- **Mensagens claras**: Feedback adequado para o usuário
- **Logs estruturados**: Facilita debugging

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como parte de um desafio técnico, demonstrando boas práticas de desenvolvimento web moderno.

