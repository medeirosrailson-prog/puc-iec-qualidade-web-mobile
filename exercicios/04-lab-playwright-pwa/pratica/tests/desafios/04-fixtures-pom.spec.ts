// tests/desafios/04-fixtures-pom.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — BLOCO D · CONTA, PAGE OBJECT E FIXTURES (≈ 25 min)
//
// 🎯 Objetivo do bloco: organizar a suíte pra ela crescer sem virar bagunça.
//
// 📚 Conectado com a aula: na Aula 3 você GRAVOU um cadastro com o recorder e viu
//    que o código gerado tem cliques repetidos, Tab sobrando e nenhuma asserção.
//    O D1 é exatamente isso: refazer aquele fluxo, LIMPO e COM expect.
//    Novo: Page Object (D2) e test.extend (D3).
//    Estudar: https://playwright.dev/docs/pom  ·  https://playwright.dev/docs/test-fixtures  ·  https://playwright.dev/docs/auth
//
// ✅ Validar:  npx playwright test 04-fixtures   (e as linhas falta('D?') precisam sumir)
//    D2 e D3 também dependem dos arquivos  tests/support/catalog-page.ts  e  fixtures.ts
// ─────────────────────────────────────────────────────────────────────────────

import { test as base, expect } from '@playwright/test';
import { CatalogPage } from '../support/catalog-page';
import { test, expect as expectFx } from '../support/fixtures'; // expectFx = o mesmo expect, reexportado por fixtures.ts
import { falta } from '../support/todo';

base.describe('Bloco D — conta nova (sem sessão)', () => {
  base.use({ storageState: { cookies: [], origins: [] } });

  // ── D1 🟡 · ≈ 8 min ────────────────────────────────────────────────────────
  // 📚 Aprende: fluxo completo de autenticação + caso NEGATIVO (senha errada).
  // 💡 Dica de ouro: rode  npx playwright codegen http://localhost:4174/login  pra gravar
  //    o cadastro, depois LIMPE (sem Tab, sem clique repetido) e ACRESCENTE os expects.
  // 🧩 Use um e-mail único a cada execução:  `aluna.${Date.now()}@teste.com`
  //    1. /login → clique em criar conta (testid auth-mode-toggle)
  //    2. preencha nome, e-mail e senha "abcd" (testids register-*) e envie
  //    3. espere SAIR do /login (page.waitForURL((url) => !url.pathname.startsWith('/login'))) e depois  page.goto('/qa')  (o app vai para '/', que usa o TMDB e pode mostrar erro de token — é normal; por isso vamos para '/qa')
  //    4. clique em Sair (logout-button) → a URL volta a ser /login
  //    5. NEGATIVO: entre com a senha "errada" → login-error-message mostra
  //       "E-mail ou senha inválidos"
  //    6. POSITIVO: entre com "abcd" → sai do /login e, em '/qa', o logout-button aparece
  base('D1. cadastro → sair → senha errada → entrar com a conta nova', async ({ page }) => {
    void page;
    const email = `aluna.${Date.now()}@teste.com`;

await page.goto('/login');

await page.getByTestId('auth-mode-toggle').click();

await page.getByTestId('register-name-input')
  .fill('Aluna Teste');

await page.getByTestId('register-email-input')
  .fill(email);

await page.getByTestId('register-password-input')
  .fill('abcd');

await page.getByTestId('register-submit-button')
  .click();

await page.waitForURL(
  url => !url.pathname.startsWith('/login')
);

await page.goto('/qa');

await page.getByTestId('logout-button')
  .click();

await expect(page).toHaveURL(/login/);

await page.getByTestId('login-email-input')
  .fill(email);

await page.getByTestId('login-password-input')
  .fill('errada');

await page.getByTestId('login-submit-button')
  .click();

await expect(
  page.getByTestId('login-error-message')
).toContainText('E-mail ou senha inválidos');

await page.getByTestId('login-password-input')
  .fill('abcd');

await page.getByTestId('login-submit-button')
  .click();

await page.waitForURL(
  url => !url.pathname.startsWith('/login')
);

await page.goto('/qa');

await expect(
  page.getByTestId('logout-button')
).toBeVisible();

  });
});

// ── D2 🟡 · ≈ 7 min ──────────────────────────────────────────────────────────
// 📚 Aprende: Page Object. Primeiro complete  tests/support/catalog-page.ts
//    e depois escreva aqui um teste que LEIA COMO UMA FRASE:
//      abre o catálogo → favorita "Pulp Fiction" → abre favoritos → "1 filme favorito"
//    O teste não pode ter NENHUM getBy… dentro dele: tudo passa pelo CatalogPage.
base('D2. Page Object: o teste lê como uma frase', async ({ page }) => {
  const catalog = new CatalogPage(page);
await catalog.goto();

await catalog.favorite('Pulp Fiction');

await catalog.openFavorites();

await expect(
  catalog.favoritesCount
).toContainText('1 filme favorito');
});

// ── D3 🔴 · ≈ 12 min ─────────────────────────────────────────────────────────
// 📚 Aprende: fixtures próprias. Complete  tests/support/fixtures.ts  e então:
//    • use as fixtures { catalog, seedFavorites } (note: este teste usa o `test` de fixtures)
//    • semeie os favoritos [603, 680] ANTES de abrir a página (ordem importa!)
//    • abra o catálogo → favoritos → confira "2 filmes favoritos"
//    • confira que os itens favorites-item-603 e favorites-item-680 estão visíveis
//    (peça também  page  no parâmetro do teste: os itens favorites-item-… são conferidos com ele)
// 🆘 Por que semear em vez de clicar? Responda na pergunta 3 do RESPOSTAS.md.
test('D3. fixtures: semeia favoritos sem clicar e confere na tela', async ({ catalog, seedFavorites, page }) => {
await seedFavorites([603, 680]);

await catalog.goto();

await catalog.openFavorites();

await expectFx(
  catalog.favoritesCount
).toContainText('2 filmes favoritos');

await expectFx(
  page.getByTestId('favorites-item-603')
).toBeVisible();

await expectFx(
  page.getByTestId('favorites-item-680')
).toBeVisible();
});
