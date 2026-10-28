// tests/support/catalog-page.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — D2 · PAGE OBJECT do catálogo (/qa)
//
// 🎯 Page Object = uma classe que "sabe" como mexer numa tela. Os testes passam a
//    ler como frases (catalog.favorite('Pulp Fiction')) e, se a tela mudar, você
//    corrige em UM lugar só.
// 📚 Estudar: https://playwright.dev/docs/pom  ·  https://playwright.dev/docs/test-fixtures
//
// Complete os métodos marcados com ✍️. O  goto()  já está pronto (modelo).
// Regra: nenhum método daqui pode usar id fixo de filme — receba o TÍTULO.
// ─────────────────────────────────────────────────────────────────────────────

import { expect, type Locator, type Page } from '@playwright/test';
import { falta } from './todo';

export class CatalogPage {
  constructor(private readonly page: Page) {}

  /** 📘 Pronto: abre o catálogo e espera a grade aparecer. */
  async goto() {
    await this.page.goto('/qa');
    await expect(this.page.getByTestId('movielist-grid')).toBeVisible();
  }

  /** ✍️ Devolve o card (role "article") cujo texto contém o título — use filter({ hasText }). */
    card(title: string): Locator {
  return this.page
    .getByRole('article')
    .filter({ hasText: title });
}

  /** ✍️ Clica no botão "Favoritar …" DENTRO do card do título. */
    async favorite(title: string) {
  await this.card(title)
    .getByRole('button')
    .click();
}

  /** ✍️ Clica em "Favoritos" (movielist-favorites-button) e espera a tela favorites-screen. */
    async openFavorites() {
  await this.page
    .getByTestId('movielist-favorites-button')
    .click();

  await expect(
    this.page.getByTestId('favorites-screen')
  ).toBeVisible();
}

  /** ✍️ Locator do contador da tela de favoritos (testid favorites-count). */
  get favoritesCount(): Locator {
  return this.page.getByTestId('favorites-count');
}

}
