# 💅 ManiFodase - Consultoria IA para Manicure

Uma aplicação moderna que oferece consultoria especializada em manicure através de Inteligência Artificial, sugerindo esmaltações baseadas no humor e compromissos da usuária.

## ✨ Funcionalidades

- 🤖 **Consultoria com IA**: Sugestões personalizadas baseadas em humor e agenda
- 💬 **Chat Inteligente**: Interface de conversa fluida com efeito typewriter
- 🎨 **Sugestões Visuais**: Apresentação organizada das recomendações
- 💾 **Histórico Local**: Persistência da conversa no navegador
- 📱 **Responsivo**: Interface adaptada para mobile e desktop
- 🌙 **Tema Dark**: Design moderno com tema escuro

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e escalável:

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos (Button, Input, Avatar)
│   └── chat/           # Componentes específicos do chat
├── hooks/              # Custom hooks (useChat, useTypewriter)
├── services/           # Serviços (AIService, StorageService)
├── utils/              # Utilitários (messageParser)
├── types/              # Definições TypeScript
├── constants/          # Constantes da aplicação
└── pages/              # Páginas da aplicação
```

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Groq SDK** - Integração com IA
- **ESLint** - Linting

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/vxfontes/maniq.git
cd maniq

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Adicione sua VITE_GROQ_API_KEY

# Execute em desenvolvimento
npm run dev
```

## ⚙️ Configuração

1. **API Key**: Obtenha uma chave da [Groq](https://console.groq.com)
2. **Variáveis de Ambiente**: Configure `VITE_GROQ_API_KEY` no arquivo `.env`

## 🎯 Como Usar

1. **Inicie uma conversa**: Descreva seu humor da semana
2. **Conte seus compromissos**: Informe eventos e atividades planejadas  
3. **Receba sugestões**: A IA analisará e sugerirá esmaltações personalizadas
4. **Continue a conversa**: Refine as sugestões com perguntas de follow-up

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run lint     # Executar linter
npm run preview  # Preview do build
```

## 📋 Padrões de Desenvolvimento

### Estrutura de Componentes
- Um componente por arquivo
- Props tipadas com TypeScript
- Composição over inheritance

### Gerenciamento de Estado
- Custom hooks para lógica de negócio
- Services para operações externas
- Context quando necessário para estado global

### Estilo e UX
- Tailwind CSS para styling
- Componentes reutilizáveis
- Feedback visual consistente

## 👨‍💻 Desenvolvedor

**VX Fontes** - [@vxfontes](https://github.com/vxfontes)