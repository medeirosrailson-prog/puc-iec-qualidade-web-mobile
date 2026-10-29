# RESPOSTAS — Lab Playwright PWA

> Preencha **depois** de fazer os desafios (≈ 10 min). Respostas **curtas e suas** (3 a 6 linhas cada).
> Não precisa de texto bonito — precisa mostrar que você **entendeu o porquê**, não só o como.
> Vale 1 ponto (correção manual, no Canvas).

**Nome:** <seu nome>
**Login do GitHub:** <seu login>
**Usei IA?** ( ) não · ( X) sim — qual ferramenta e pra quê: <Microsoft Copilot/ChatGPT para tirar dúvidas dos exercícios, entender erros dos testes e revisar as soluções>  *(usar é permitido; esconder não)*

---

### 1. Por que `await expect(locator).toHaveCount(12)` é melhor que `expect(await locator.count()).toBe(12)`?
*(Dica: o que cada um faz se a lista ainda estiver carregando? Pense no Bloco B e no F.)*

<sua resposta >toHaveCount() espera automaticamente até que a quantidade correta apareça na tela. Já count() captura o valor naquele instante e pode falhar se a lista ainda estiver carregando. Por isso toHaveCount() gera testes mais estáveis e menos sujeitos a falhas intermitentes.

### 2. Por que o Bloco C desliga o Service Worker (`serviceWorkers: 'block'`) e o Bloco E mantém ligado?
*(Dica: o que o SW faz com o `fetch` do catálogo? E o que o teste offline precisa do SW?)*

<sua resposta> No Bloco C o objetivo era testar e controlar as requisições da aplicação usando mocks de rede. O Service Worker poderia interceptar essas requisições e atrapalhar o teste. No Bloco E ele precisa ficar ligado porque os testes validam funcionamento offline, cache e comportamento de PWA, que dependem diretamente do Service Worker.

### 3. No D3 você semeou favoritos pelo `localStorage` em vez de clicar nos corações. Qual o ganho? Qual o risco? Cite **um caso em que você NÃO semearia**.
*(Dica: o que o clique prova que a semente não prova?)*

<sua resposta> O ganho é deixar o teste mais rápido e mais simples, preparando o estado inicial sem precisar executar vários cliques. O risco é não validar a funcionalidade de favoritar pela interface. Eu não semearia quando o objetivo do teste fosse verificar se o clique no coração realmente salva ou remove favoritos corretamente.

### 4. Bloco F: quais eram os defeitos dos testes instáveis (F1a, F1b e F1d) e como você **provou** que ficaram estáveis?
*(Cite os comandos que rodou e o resultado.)*

<sua resposta> O F1a utilizava .count() sem espera automática. O F1b usava waitForTimeout() e .count(), tornando o teste frágil. O F1d dependia do estado criado por outro teste. Corrigi utilizando toHaveCount(), removendo esperas fixas e tornando o F1d independente. Para validar executei:npx playwright test 06-flaky-cacada.spec.ts --repeat-each=10

### 5. Seus mocks do Bloco C (C1–C4) dão confiança em quê — e **que bug real passaria batido** mesmo com todos eles verdes?
*(Dica: o que muda quando o backend é de verdade? Pense em contrato, formato, lentidão.)*

<sua resposta> Os mocks dão confiança no comportamento da interface diante de respostas específicas da API, como sucesso, erro e dados modificados. Porém um problema real de contrato entre frontend e backend poderia passar despercebido, por exemplo mudanças no formato do JSON, lentidão extrema ou erros de integração com o servidor real.

### 6. Missão livre: por que você escolheu **esse** fluxo? Que risco do produto ele cobre? O que ficou **sem** teste e por quê?

<sua resposta> Escolhi o fluxo de busca de filmes porque é uma funcionalidade importante para o usuário localizar conteúdos rapidamente. O fluxo cobre cenários feliz, negativo e de borda, validando resultados encontrados, busca sem resultados e busca vazia. Ficaram sem teste aspectos como desempenho da busca e comportamento com grande volume de dados, porque o foco foi validar a funcionalidade principal.
