// __tests__/integration/01-login-favoritar.test.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — integração: navegação real + estado real (RNTL)
//
// Renderiza o RootStack INTEIRO (navegação + react-query + stores) e atravessa
// o fluxo como o usuário: login → lista → favoritar. Sem token TMDB o app usa
// o mock determinístico — "Matrix" (id 603) sempre existe.
//
// Teste 1 vem resolvido (🧑‍🏫). Você completa o 2 e o 3.
// ─────────────────────────────────────────────────────────────────────────────

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootStack from '@/routes/RootStack';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { testIDs } from '@/utils/testIDs';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryClientProvider>,
  );
}

async function loginPelaUI() {
  fireEvent.changeText(screen.getByTestId(testIDs.login.emailInput), 'aluno@puc.br');
  fireEvent.changeText(screen.getByTestId(testIDs.login.passwordInput), '1234');
  fireEvent.press(screen.getByTestId(testIDs.login.submit));
  await waitFor(() => expect(screen.getByTestId(testIDs.movieList.screen)).toBeOnTheScreen());
}

describe('integração — login e favoritar', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, email: null });
    useFavoritesStore.setState({ ids: [] });
  });

  // 🧑‍🏫 1. resolvido — o fluxo de login atravessa a navegação
  it('1. login pela UI leva à lista de filmes com dados do mock', async () => {
    renderApp();

    // sem auth, o porteiro (RootStack) só mostra o Login
    expect(screen.getByTestId(testIDs.login.screen)).toBeOnTheScreen();

    await loginPelaUI();

    // dados do mock renderizados na lista
    await waitFor(() => expect(screen.getByText('Matrix')).toBeOnTheScreen());
  });

  // 🧑‍💻 2. FÁCIL — favoritar na lista atualiza o store
  it('2. tocar no coração do card favorita o filme no store', async () => {
    renderApp();
    await loginPelaUI();
    await waitFor(() => expect(screen.getByText('Matrix')).toBeOnTheScreen());

    // o handler do coração usa e.stopPropagation() — sem event data o RNTL
    // entrega undefined e o handler explode (pitfall real de RNTL!)
    fireEvent.press(screen.getByTestId(testIDs.movieCard.heart(603)), {
      stopPropagation: jest.fn(),
    });

    expect(
  useFavoritesStore.getState().isFavorite(603)
).toBe(true);
  });

  // 🧑‍💻 3. 🔴 DESAFIO — credencial inválida não navega
  it('3. login inválido mantém a tela de Login', async () => {
  renderApp();

fireEvent.changeText(
  screen.getByTestId(testIDs.login.emailInput),
  'aluno.puc.br'
);

fireEvent.changeText(
  screen.getByTestId(testIDs.login.passwordInput),
  '123'
);

fireEvent.press(
  screen.getByTestId(testIDs.login.submit)
);

expect(
  screen.queryByTestId(testIDs.movieList.screen)
).toBeNull();

expect(
  screen.getByTestId(testIDs.login.screen)
).toBeOnTheScreen();
  });
});
