# Arquitetura do Projeto ManiFodase

## Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos de UI
│   ├── chat/            # Componentes específicos do chat
│   └── common/          # Componentes comuns
├── pages/               # Páginas da aplicação
├── hooks/               # Custom hooks
├── services/            # Serviços externos (APIs, storage)
├── utils/               # Funções utilitárias
├── types/               # Definições de tipos TypeScript
├── constants/           # Constantes da aplicação
├── contexts/            # React Contexts
└── assets/              # Recursos estáticos
```

## Camadas da Aplicação

### 1. Apresentação (UI Layer)
- **Componentes React**: Interface do usuário
- **Hooks customizados**: Lógica de estado e efeitos
- **Contextos**: Gerenciamento de estado global

### 2. Lógica de Negócio (Business Layer)
- **Services**: Integração com APIs externas
- **Utils**: Funções de processamento e validação
- **Constants**: Configurações e constantes

### 3. Dados (Data Layer)
- **LocalStorage**: Persistência local do histórico
- **API Groq**: Integração com IA
- **Types**: Tipagem de dados

## Princípios Arquiteturais

### 1. Separação de Responsabilidades
- Componentes focados apenas na apresentação
- Lógica de negócio isolada em services e hooks
- Estado gerenciado de forma centralizada

### 2. Reutilização
- Componentes modulares e reutilizáveis
- Hooks customizados para lógica compartilhada
- Tipos TypeScript bem definidos

### 3. Escalabilidade
- Estrutura que permite fácil adição de novas funcionalidades
- Componentes desacoplados
- Configuração centralizada

### 4. Manutenibilidade
- Código bem organizado e documentado
- Nomenclatura consistente
- Testes unitários (a implementar)

## Fluxo de Dados

1. **Input do Usuário** → Chat Input Component
2. **Processamento** → Chat Service → Groq API
3. **Resposta** → Message Processing → UI Update
4. **Persistência** → LocalStorage Service
