// tests/desafios/01-locators.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — BLOCO A · LOCATORS (≈ 25 min)
//
// 🎯 Objetivo do bloco: achar elementos do jeito que um USUÁRIO enxerga a tela
//    (papel, nome, label) — e só cair pro data-testid quando não houver jeito melhor.
//
// 📚 Você viu na Aula 2 (recorder: getByTestId / getByRole) e vai aprofundar:
//    getByRole · getByLabel · locator.filter({ hasText }) · escopo (card.getByRole)
//    Estudar: https://playwright.dev/docs/locators  ·  https://playwright.dev/docs/other-locators
//
// 🧭 Como ler os desafios:   🟢 fácil (só falta o expect)
//                            🟡 médio (você monta a sequência, com dica)
//                            🔴 difícil (você escreve o teste inteiro)
//
// ✅ Como saber que está certo:  npx playwright test 01-locators   → tudo verde
//    E a linha  falta('A?')  precisa ter SUMIDO (ela é o "vermelho de propósito").
//    Placar geral:  npm run check
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';
import { falta } from '../support/todo';

test.describe('Bloco A — Locators', () => {
  // ── A1 🟢 · ≈ 4 min ────────────────────────────────────────────────────────
  // 📚 Aprende: getByRole('button', { name }) + toHaveURL
  // 🧩 O clique já está pronto, repare que NÃO usa data-testid: usa o PAPEL (button)
  //    e o NOME visível ("🔍 Buscar"). Falta você provar que o app navegou.
  // 🆘 Dica: a URL da tela de busca termina em /search. expect(page).toHaveURL(regex)
  test('A1. ir pra busca pelo botão (role + nome)', async ({ page }) => {
    await page.goto('/qa');
    await page.getByRole('button', { name: /Buscar/ }).click();

    // ✍️ sua vez: confirme que a página está em /search
    await expect(page).toHaveURL(/search$/);
  });

  test.describe('sem sessão', () => {
    // Zera a sessão salva pelo auth.setup: aqui o usuário NÃO está logado.
    test.use({ storageState: { cookies: [], origins: [] } });

    // ── A2 🟡 · ≈ 7 min ──────────────────────────────────────────────────────
    // 📚 Aprende: getByLabel (campo pelo texto do <label>) — como um leitor de tela acha o campo
    // 🧩 Faça o login SEM nenhum data-testid:
    //    1. goto('/login')
    //    2. preencha o campo "E-mail" com aluno@puc.br e o campo "Senha" com 1234
    //    3. clique no botão "Entrar" (por role + name)
    //    4. espere SAIR do /login:  await page.waitForURL((url) => !url.pathname.startsWith('/login'));
    //       (o app vai para '/', que usa o TMDB e pode mostrar erro de token — é normal; depois faça  await page.goto('/qa'))
    //    5. prove que logou: o botão "Sair" (testid logout-button) fica visível
    // 🆘 Dica: page.getByLabel('E-mail').fill('...')
    test('A2. login só com label e role (zero testid)', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel('E-mail').fill('aluno@puc.br');

await page.getByLabel('Senha').fill('1234');

await page.getByRole('button', { name: 'Entrar' }).click();

await page.waitForURL(
  (url) => !url.pathname.startsWith('/login')
);

await expect(
  page.getByTestId('logout-button')
).toBeVisible();
    });
  });

  // ── A3 🔴 · ≈ 12 min ───────────────────────────────────────────────────────
  // 📚 Aprende: locator.filter({ hasText }) e ESCOPO — achar "o card do Pulp Fiction",
  //    e só então mexer no botão que está DENTRO dele. Nada de id fixo (603, 680…):
  //    se a ordem do catálogo mudar, o seu teste continua certo.
  // 🧩 Escreva o teste inteiro:
  //    • em /qa, localize o card (role "article") do filme "Pulp Fiction" usando filter
  //    • dentro dele, clique no botão "Favoritar …"
  //    • prove (no MESMO card) que o botão agora diz "Remover …" e tem aria-pressed="true"
  //    • abra "Favoritos" pelo botão da tela e confira o texto "1 filme favorito"
  //    • confirme que o link "Pulp Fiction" aparece na lista de favoritos
  // 🆘 Dicas (abra só se travar):
  //    1) const card = page.getByRole('article').filter({ hasText: '...' })
  //    2) card.getByRole('button', { name: /Favoritar/ })
  //    3) toHaveAttribute('aria-pressed', 'true')
  test('A3. favoritar pelo TÍTULO (filter + escopo dentro do card)', async ({ page }) => {
    await page.goto('/qa');

const card = page
  .getByRole('article')
  .filter({ hasText: 'Pulp Fiction' });

await card.getByTestId('movie-card-heart-680').click();


await page.getByTestId(
  'movielist-favorites-button'
).click();

await expect(
  page.getByText('1 filme favorito')
).toBeVisible();

await expect(
  page.getByText('Pulp Fiction')
).toBeVisible();
  });
});
