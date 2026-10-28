// tests/support/fixtures.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — D3 · SUAS PRÓPRIAS FIXTURES (test.extend)
//
// 🎯 Fixture = algo que o Playwright prepara pra você e entrega no parâmetro do
//    teste ({ page, context }… já são fixtures!). Aqui você cria as SUAS:
//
//      catalog         → um CatalogPage pronto (o Page Object do D2)
//      seedFavorites   → função que PRÉ-CARREGA favoritos no localStorage, sem clicar
//                        na tela (mais rápido e menos frágil que favoritar pela UI)
//
// 📚 Estudar: https://playwright.dev/docs/pom  ·  https://playwright.dev/docs/test-fixtures
// 🆘 Dica da seedFavorites: context.addInitScript roda ANTES de qualquer script da
//    página. Ela aceita um argumento serializável:
//       await context.addInitScript(([k, v]) => localStorage.setItem(k, v), ['chave', 'valor'])
//    A chave que o app usa é  cinefav-favorites  e o valor é JSON de ids: "[603,680]".
// ─────────────────────────────────────────────────────────────────────────────

import { test as base, expect } from '@playwright/test';
import { CatalogPage } from './catalog-page';
import { falta } from './todo';

type Fixtures = {
  catalog: CatalogPage;
  seedFavorites: (ids: number[]) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  // ✍️ entregue um  new CatalogPage(page)  via  await use(...)
  catalog: async ({ page }, use) => {
  await use(new CatalogPage(page));
  },

  // ✍️ entregue uma função (ids) => … que faz o addInitScript descrito acima
  seedFavorites: async ({ context }, use) => {
  await use(async (ids: number[]) => {
    await context.addInitScript(
      ([key, value]) => localStorage.setItem(key, value),
      ['cinefav-favorites', JSON.stringify(ids)]
     );
    });
  },
});


export { expect };
