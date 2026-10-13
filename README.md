# TaskFlow App — Checkpoint 2

Aplicativo mobile para gerenciamento de tarefas pessoais, desenvolvido com **React Native**, **Expo** e **TypeScript**.

O usuário se autentica, permanece conectado ao reabrir o app, cadastra, consulta, edita, altera o status e exclui suas próprias tarefas, filtra a lista por status, alterna e persiste o tema claro/escuro e vê uma frase motivacional obtida de uma API pública.

## Integrantes

| Nome | RM |
| --- | --- |
| Arthur Gomes | RM560771 |
| Luiz Gustavo | RM560110 |
| Matheus Siroma | RM560248 |
| Pedro Estevam | RM560642 |

## Vídeo de demonstração

[_Link do vídeo (3 a 7 minutos):_ <!-- cole aqui o link do vídeo -->](https://drive.google.com/file/d/1f3bCVv34yEQMkvKx3pjX9j1movvKc5eM/view?usp=sharing)

## Tecnologias utilizadas

- React Native 0.86 + Expo SDK 57
- TypeScript (modo `strict`, sem `any`)
- React Navigation 7 (Bottom Tabs + Native Stack)
- Context API + hooks customizados
- AsyncStorage (`@react-native-async-storage/async-storage`)
- Fetch API (com timeout via `AbortController`)
- `@expo/vector-icons` (Ionicons)
- ESModules (`import`/`export`)

## Funcionalidades implementadas

### Autenticação
- Login com validação dos campos e mensagem clara para credenciais inválidas.
- Sessão persistida no AsyncStorage: ao reabrir o app, o usuário vai direto para o fluxo principal.
- Logout com confirmação (`Alert`), que apaga a sessão e volta para o login.
- Fluxo inicial por perfil: **admin** abre na aba **Configurações**; **user** abre na aba **Home**.
- `Header` em todas as telas principais com nome, perfil e botão de logout.

### Navegação
- **Bottom Tabs**: Home, Tarefas e Configurações.
- **Stack de tarefas** (dentro da aba Tarefas): Lista → Cadastro / Detalhes → Edição.
- A Home navega direto para a lista ou para o cadastro de tarefa, mantendo a lista na pilha para o botão voltar.

### CRUD de tarefas
- **Create**: formulário com título, descrição, status, prioridade e categoria.
- **Read**: listagem com `FlatList` e tela de detalhes.
- **Update**: edição completa e troca rápida de status na tela de detalhes.
- **Delete**: exclusão com confirmação via `Alert`.
- Cada tarefa pertence ao usuário que a criou; cada usuário vê e altera somente as próprias tarefas.
- `id` único gerado automaticamente; `createdAt` definido no cadastro e `updatedAt` atualizado a cada edição.
- Feedback visual: loading nos botões, `Alert` de sucesso/erro ao salvar, editar ou excluir.

### Validações
- Título obrigatório, sem aceitar somente espaços, com no mínimo 3 caracteres (máx. 60).
- Descrição obrigatória com no mínimo 5 caracteres (máx. 300), com contador de caracteres.
- Status, prioridade e categoria validados contra os valores permitidos.
- Formulário inválido não é salvo; os erros aparecem abaixo de cada campo e são revalidados enquanto o usuário digita.
- Os dados lidos do AsyncStorage também são validados (type guards) antes de serem usados.

### Listagem
- Exibe título, status, categoria com ícone, prioridade, data de criação e data de atualização.
- Filtros: Todas, Pendente, Em andamento e Concluída (com a contagem de cada um).
- Estado vazio amigável (com atalho para cadastrar) e estado vazio específico para filtros sem resultado.
- Puxar para atualizar (pull to refresh) e botão flutuante para nova tarefa.

### Consumo de API
- A Home busca uma frase motivacional em `https://dummyjson.com/quotes/random`.
- Resposta tipada (`QuoteResponse`) e validada antes do uso.
- `ActivityIndicator` durante o carregamento, mensagem de erro e botão **Tentar novamente** em caso de falha, e botão para buscar outra frase.

### Tema e configurações
- Alternância entre tema claro e escuro, persistida no AsyncStorage.
- Todas as cores centralizadas no `ThemeContext` (incluindo as cores de status e prioridade).
- Exibição de nome, usuário e perfil.
- Preferência de tratamento (`Sr.`, `Sra.` ou `Srta.`) persistida por usuário e exibida no Header e na Home.

### Interface e acessibilidade
- `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` e `accessibilityState` nos elementos interativos; botões só com ícone possuem descrição acessível.
- Feedback de toque em todos os botões (`Pressable` com opacidade/escala).
- Animações de entrada nos cards da lista e na frase do dia (`Animated`).

## Estrutura do projeto

```text
App.tsx                      # Providers (SafeArea, Theme, Auth, Task) + rotas
src/
  components/                # Componentes reutilizáveis
    CustomButton.tsx
    CustomInput.tsx
    EmptyState.tsx
    FilterBar.tsx
    Header.tsx
    OptionSelector.tsx
    StatusBadge.tsx          # StatusBadge e PriorityBadge
    TaskCard.tsx
  constants/
    taskOptions.ts           # Status, prioridades, categorias e rótulos
  context/
    AuthContext.tsx          # Sessão, login/logout e preferência de tratamento
    TaskContext.tsx          # Tarefas e operações de CRUD
    ThemeContext.tsx         # Tema claro/escuro e paleta de cores
  data/
    users.ts                 # Usuários didáticos
  hooks/
    useAuth.ts
    useQuote.ts              # Consumo da API com loading/erro/retry
    useTasks.ts
    useTheme.ts
  routes/
    AppRoutes.tsx            # NavigationContainer + troca Login/Fluxo principal
    TabRoutes.tsx            # Bottom Tabs
    TaskStackRoutes.tsx      # Stack de tarefas
  screens/
    auth/LoginScreen.tsx
    home/HomeScreen.tsx
    tasks/TaskListScreen.tsx
    tasks/TaskFormScreen.tsx # Cadastro e edição
    tasks/TaskDetailScreen.tsx
    settings/SettingsScreen.tsx
  services/
    api.ts                   # Fetch para a DummyJSON
    authStorage.ts           # Sessão e tratamento no AsyncStorage
    storageKeys.ts
    taskStorage.ts           # Tarefas no AsyncStorage
    themeStorage.ts          # Tema no AsyncStorage
  types/
    api.ts
    navigation.ts
    task.ts
    theme.ts
    user.ts
  utils/
    formatDate.ts
    generateId.ts
    validation.ts
```

## Instalação e execução

Requisitos:

- Node.js em versão LTS;
- npm;
- aplicativo **Expo Go** no celular ou um emulador Android/iOS.

```bash
npm install
npx expo start
```

Depois, leia o QR Code com o Expo Go (Android) ou com a câmera (iOS), ou pressione `a` / `i` no terminal para abrir no emulador.

Verificação de tipos:

```bash
npx tsc --noEmit
```

## Credenciais de teste

| Usuário | Senha | Perfil | Tela inicial |
| --- | --- | --- | --- |
| `admin` | `123` | Administrador | Configurações |
| `user` | `123` | Usuário comum | Home |

> A autenticação é apenas didática: usuários e senhas ficam no código e não representam uma implementação adequada para produção.

## API consumida

- **DummyJSON — Quotes**: `GET https://dummyjson.com/quotes/random`
  Resposta: `{ id: number; quote: string; author: string }`

## Dados salvos no AsyncStorage

| Chave | Conteúdo |
| --- | --- |
| `@taskflow:session` | Usuário autenticado (sem a senha) |
| `@taskflow:tasks` | Lista de tarefas de todos os usuários (filtradas por `userId` no app) |
| `@taskflow:theme` | `light` ou `dark` |
| `@taskflow:treatment:<userId>` | `Sr.`, `Sra.` ou `Srta.` |
