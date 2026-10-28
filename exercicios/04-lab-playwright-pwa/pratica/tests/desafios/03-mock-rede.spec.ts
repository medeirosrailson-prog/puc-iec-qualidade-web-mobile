// tests/desafios/03-mock-rede.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — BLOCO C · MOCK DE REDE (≈ 30 min)
//
// 🎯 Objetivo do bloco: controlar o "backend" sem backend. O catálogo do CineFav
//    vem de UMA requisição:  GET /api/movies.json  — interceptando ela você inventa
//    dados, simula erro e até altera a resposta real.
//
// 📚 Você viu na Aula 2 (page.route / fulfill / abort). Novo aqui:
//    route.fetch() (pegar a resposta real e alterar) · page.on('request') (contar
//    requisições) · page.unroute (soltar a rota no meio do teste).
//    Estudar: https://playwright.dev/docs/mock  ·  https://playwright.dev/docs/network
//
// ⚠️ PITFALL REAL (Aula 3): o Service Worker responde do cache e o fetch NUNCA chega
//    no page.route. Por isso este arquivo desliga o SW com a linha abaixo.
//    Sem ela os testes C falham "de um jeito misterioso". Guarde esse aprendizado!
//
// ✅ Validar:  npx playwright test 03-mock   (e as linhas falta('C?') precisam sumir)
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';
import { falta } from '../support/todo';

test.use({ serviceWorkers: 'block' });

const CATALOGO = '**/api/movies.json';

test.describe('Bloco C — mock de rede', () => {
  // ── C1 🟢 · ≈ 4 min ────────────────────────────────────────────────────────
  // 📚 Aprende: route.fulfill — o "backend" devolve o que VOCÊ mandar.
  // 🧩 O mock já está escrito: o catálogo agora tem 1 filme só (id 777). Confira que
  //    a tela mostra exatamente 1 card e que o título dele é "Filme do Mock".
  // 🆘 Dica: o testid do título é  movie-card-title-777
  test('C1. fulfill: o backend devolve 1 filme inventado', async ({ page }) => {
    // Registre o mock ANTES do goto — rota registrada tarde não intercepta nada.
    await page.route(CATALOGO, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 777, title: 'Filme do Mock', overview: 'Só existe no teste.', release_date: '2026-01-01', vote_average: 8.5 },
        ]),
      }),
    );
    await page.goto('/qa');

    // ✍️ sua vez
    const cards = page.getByRole('article');

await expect(cards).toHaveCount(1);

await expect(
  page.getByTestId('movie-card-title-777')
).toContainText('Filme do Mock');
  });

  // ── C2 🟡 · ≈ 7 min ────────────────────────────────────────────────────────
  // 📚 Aprende: simular erro (status 500) e SOLTAR o mock no meio do teste (unroute)
  //    pra provar que a recuperação funciona.
  // 🧩 1. responda 500 em CATALOGO (route.fulfill com status: 500)
  //    2. goto('/qa') e espere o estado de erro (testid movielist-error)
  //    3. solte o mock:  await page.unroute(CATALOGO)
  //    4. clique em "Tentar de novo" (movielist-retry-button)
  //    5. o erro some e os 12 cards aparecem
  test('C2. erro 500 mostra o estado de erro; destrava a rota e "Tentar de novo" funciona', async ({ page }) => {
    void page;
    await page.route(CATALOGO, route =>
  route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'erro' }),
  }),
);

await page.goto('/qa');

await expect(
  page.getByTestId('movielist-error')
).toBeVisible();

await page.unroute(CATALOGO);

await page.getByTestId(
  'movielist-retry-button'
).click();

await expect(
  page.getByRole('article')
).toHaveCount(12);
  });

  // ── C3 🟡 · ≈ 7 min ────────────────────────────────────────────────────────
  // 📚 Aprende (NOVO): route.fetch() — deixa a requisição ir pra rede de verdade,
  //    pega a resposta real e você altera SÓ o que importa. Muito usado em QA: dado
  //    real + 1 caso extremo.
  // 🧩 Intercepte CATALOGO com um handler assíncrono que:
  //    • faz  const response = await route.fetch()  e lê o JSON (await response.json())
  //    • fica só com os 3 primeiros filmes e coloca TODOS os títulos em MAIÚSCULAS
  //    • devolve com  route.fulfill({ response, json: ... })
  //    Depois: goto('/qa'), confira 3 cards e que o título do Matrix (id 603) é "MATRIX".
  test('C3. route.fetch(): pega a resposta REAL e altera só o que importa', async ({ page }) => {
    void page;
    await page.route(CATALOGO, async route => {
  const response = await route.fetch();

  const json = await response.json();

  const alterado = json
    .slice(0, 3)
    .map((movie: any) => ({
      ...movie,
      title: movie.title.toUpperCase(),
    }));

  await route.fulfill({
    response,
    json: alterado,
  });
});

await page.goto('/qa');

await expect(
  page.getByRole('article')
).toHaveCount(3);

await expect(
  page.getByTestId('movie-card-title-603')
).toContainText('MATRIX');
  });

  // ── C4 🔴 · ≈ 12 min ───────────────────────────────────────────────────────
  // 📚 Aprende: observar a rede (page.on('request')) pra testar COMPORTAMENTO, não só tela.
  //    A busca tem debounce de 250ms: digitar 6 letras rápido deve disparar UMA
  //    requisição ao catálogo, não seis. Isso é qualidade de performance, testável.
  // 🧩 Escreva o teste inteiro:
  //    • antes de navegar, registre  page.on('request', ...)  e conte as requisições
  //      cuja URL termina em /api/movies.json
  //    • vá pra /search e digite "matrix" tecla a tecla (pressSequentially, delay 40ms)
  //    • espere o resultado (search-result-603) ficar visível
  //    • só ENTÃO confira que o contador é exatamente 1 — com uma mensagem de erro
  //      útil:  expect(valor, 'mensagem').toBe(1)
  // 🆘 Por que esperar o resultado antes de contar? Pense: o que acontece se você
  //    contar logo depois de digitar?
  test('C4. debounce: digitar "matrix" faz UMA requisição só', async ({ page }) => {
    void page;
    let requests = 0;

page.on('request', request => {
  if (
    request.url().endsWith('/api/movies.json')
  ) {
    requests++;
  }
});

await page.goto('/search');

await page
  .getByTestId('search-input')
  .pressSequentially('matrix', {
    delay: 40,
  });

await expect(
  page.getByTestId('search-result-603')
).toBeVisible();

expect(
  requests,
  'A busca deveria disparar apenas uma requisição'
).toBe(1);
  });
});
