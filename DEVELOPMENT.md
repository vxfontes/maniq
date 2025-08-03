# Guia de Desenvolvimento - ManiFodase

## Estrutura do Projeto

### Componentes (src/components/)

#### UI Components (src/components/ui/)
Componentes reutilizáveis de interface:
- **Button**: Botão com variantes (primary, secondary, danger)
- **Input**: Campo de entrada com suporte a erro
- **Avatar**: Avatar de usuário/IA
- **LoadingIndicator**: Indicador de carregamento

#### Chat Components (src/components/chat/)
Componentes específicos do chat:
- **TypewriterMessage**: Efeito de digitação para mensagens da IA
- **ChatMessage**: Wrapper para mensagens do chat
- **ChatInput**: Campo de entrada de mensagens
- **ChatLoading**: Estado de carregamento
- **ChatWelcome**: Tela de boas-vindas
- **ChatHeader**: Cabeçalho com título e controles

### Hooks (src/hooks/)
- **useChat**: Gerencia estado e lógica do chat
- **useTypewriter**: Efeito de digitação
- **useAutoScroll**: Auto-scroll para novas mensagens

### Services (src/services/)
- **AIService**: Integração com API da Groq
- **StorageService**: Persistência no localStorage

### Utils (src/utils/)
- **messageParser**: Parse de respostas da IA com tags XML

### Types (src/types/)
- **chat.ts**: Definições de tipos do chat

### Constants (src/constants/)
- **app.ts**: Constantes da aplicação

## Fluxo de Dados

1. **Input do usuário** → ChatInput
2. **useChat.sendMessage()** → AIService
3. **Resposta da IA** → messageParser
4. **Estado atualizado** → Re-render dos componentes
5. **StorageService** → Persistência local

## Como Adicionar Novas Funcionalidades

### 1. Novo Componente UI
```tsx
// src/components/ui/NovoComponente.tsx
export function NovoComponente() {
  return <div>Conteúdo</div>;
}

// Adicionar em src/components/ui/index.ts
export * from './NovoComponente';
```

### 2. Novo Hook
```tsx
// src/hooks/useNovoHook.ts
export function useNovoHook() {
  // lógica
  return { data };
}

// Adicionar em src/hooks/index.ts
export * from './useNovoHook';
```

### 3. Novo Service
```tsx
// src/services/novoService.ts
export class NovoService {
  // implementação
}

// Adicionar em src/services/index.ts
export * from './novoService';
```

## Padrões de Código

### Nomenclatura
- **Componentes**: PascalCase (ex: `ChatMessage`)
- **Hooks**: camelCase com prefixo "use" (ex: `useChat`)
- **Services**: PascalCase com sufixo "Service" (ex: `AIService`)
- **Tipos**: PascalCase (ex: `Message`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `CHAT_CONSTANTS`)

### Estrutura de Arquivos
- Um componente por arquivo
- Export nomeado para componentes
- Index.ts para re-exports
- Tipos próximos ao código que os usa

### Tratamento de Erros
- Try/catch em operações assíncronas
- Logs detalhados para debugging
- Fallbacks para estados de erro
- Mensagens de erro amigáveis ao usuário

## Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build
```
