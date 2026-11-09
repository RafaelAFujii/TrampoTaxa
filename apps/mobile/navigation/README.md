# 🧭 Native Navigation (`apps/mobile/navigation`)

Este módulo implementa a arquitetura de navegação nativa do aplicativo móvel, baseada em **React Navigation** (`@react-navigation/native` e `@react-navigation/bottom-tabs`).

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Componente / Exportação | Responsabilidade Central | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`RootNavigator.tsx`** | `RootNavigator` | Navegador raiz com alternância dinâmica entre fluxo de autenticação e abas principais | `RootNavigator.test.tsx` |
| **`authNavigation.ts`** | `getInitialRouteName` | Decisão da tela inicial com base no papel do usuário logado | N/A |
| **`types.ts`** | Tipos de Navegação | Tipagem estrita de parâmetros para cada tela (`RootStackParamList`, `MainTabParamList`) | N/A |

---

## 🏛️ Detalhamento dos Componentes

### 1. `RootNavigator.tsx` — Pilhas e Abas
* Se o usuário **não estiver logado**, renderiza o stack de autenticação (*Login* e *Cadastro*).
* Se o usuário estiver **logado como Freelancer**, renderiza as 3 abas nativas inferiores:
  * **Radar**: `MapScreen`
  * **Ganhos**: `EarningsScreen`
  * **Perfil**: `ProfileScreen`
* Se o usuário estiver **logado como Contratante**, renderiza o stack B2B:
  * **Vagas**: `ContractorGigsScreen`
  * **Criar Taxa**: `CreateGigScreen`
  * **Relatórios**: `ContractorReportsScreen`
  * **Chat**: `ContractorChatScreen`

### 2. `types.ts` — Type-Safety Estrita
* Define os tipos de parâmetros para o hook `useNavigation<NavigationProp<RootStackParamList>>()`, impedindo navegações para rotas inexistentes em tempo de compilação (`bun run typecheck:mobile`).
