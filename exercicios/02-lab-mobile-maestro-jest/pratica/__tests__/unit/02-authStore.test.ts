// __tests__/unit/02-authStore.test.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — teste unitário do authStore
//
// Regra do store: email com "@" + senha de 4+ chars → autentica.
//
// Legenda:  🧑‍🏫 = professor faz no screencast · 🧑‍💻 = você faz sozinho
//           FÁCIL = arrange/act prontos, você escreve o expect
//           🔴 DESAFIO = você escreve o teste inteiro
// ─────────────────────────────────────────────────────────────────────────────

import { useAuthStore } from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, email: null });
  });

  // 🧑‍🏫 1. FÁCIL — login válido
  it('1. login com credenciais válidas autentica e guarda o email', () => {
    const ok = useAuthStore.getState().login('aluno@puc.br', '1234');

    expect(ok).toBe(true);

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.email).toBe('aluno@puc.br');
  });

  // 🧑‍💻 2. FÁCIL — email inválido
  it('2. email sem @ NÃO autentica', () => {
    const ok = useAuthStore.getState().login('aluno.puc.br', '1234');

  expect(ok).toBe(false);

  const state = useAuthStore.getState();

  expect(state.isAuthenticated).toBe(false);
  expect(state.email).toBeNull();
  });

  // 🧑‍💻 3. 🔴 DESAFIO — senha curta
  it('3. senha com menos de 4 caracteres NÃO autentica', () => {
   const ok = useAuthStore.getState().login('aluno@puc.br', '123');

expect(ok).toBe(false);

const state = useAuthStore.getState();

expect(state.isAuthenticated).toBe(false);
expect(state.email).toBeNull();
  });

  // 🧑‍💻 4. 🔴 DESAFIO — logout
  it('4. logout limpa a sessão', () => {
  useAuthStore.getState().login('aluno@puc.br', '1234');

useAuthStore.getState().logout();

const state = useAuthStore.getState();

expect(state.isAuthenticated).toBe(false);
expect(state.email).toBeNull();
  });

  // 🧑‍💻 5. 🔴 DESAFIO — borda: senha só de espaços
  it('5. senha "     " (espaços) NÃO autentica', () => {
  const ok = useAuthStore.getState().login('aluno@puc.br', '    ');

expect(ok).toBe(false);

const state = useAuthStore.getState();

expect(state.isAuthenticated).toBe(false);
expect(state.email).toBeNull();

  });
});
