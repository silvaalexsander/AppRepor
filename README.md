# Repor - App MVP

Um aplicativo simples para controle doméstico de estoque. Funciona como um "inventário da casa", permitindo o registro de itens e suas quantidades. 

## Visão do App
O Repor foca na praticidade do dia a dia:
- Controle de quantidade atual e mínimo ideal para cada produto.
- Geração automática de lista de compras quando os estoques abaixam.
- Histórico completo de movimentações (entradas, saídas, ajustes).
- Sem dependência de internet: 100% offline.
- Foco absoluto em usabilidade.

## Stack Utilizada
- **React Native** + **Expo**
- **TypeScript** para máxima segurança e consistência
- **Zustand** para o gerenciamento de estado global flexível e robusto
- **AsyncStorage** para persistência local de dados (offline)
- **React Navigation** (Bottom Tabs & Native Stack)
- **React Hook Form** para gestão e validação eficiente de formulários
- **Lucide React Native** para os ícones

## Estrutura de Pastas
```
src/
├── components/
│   ├── common/      # Botões, Badges e Inputs genéricos
│   └── item/        # Cartões de itens específicos do negócio
├── constants/       # Opções de categorias e unidades
├── navigation/      # Stack & Tab Navigators
├── screens/         # Telas da aplicação (Estoque, Comprar, Histórico, Detalhes, Form)
├── services/        # Lógica de integração e persistência de dados
├── store/           # Setup e actions do Zustand
├── theme/           # Cores e espaçamentos padronizados
├── types/           # Interfaces e definições de TypeScript
└── utils/           # Funções auxiliares (Data, ID, etc)
```

## Instruções para Rodar
Para executar este aplicativo localmente em seu dispositivo ou emulador Android:

1. Acesse o diretório do projeto:
\`\`\`bash
cd AppRepor
\`\`\`

2. Inicie o Metro Bundler do Expo:
\`\`\`bash
npx expo start
\`\`\`

3. Com o Metro rodando, pressione a tecla **\`a\`** no terminal para abrir no Android (caso tenha emulador ativo), ou escaneie o QRCode que aparece com o aplicativo **Expo Go** no seu dispositivo móvel Android físico.

## Decisões Técnicas
- **Offline-First:** Sendo um MVP para uso doméstico, o app é integralmente local utilizando persistência via \`AsyncStorage\`. Nenhuma conta ou internet é necessária.
- **Tipagem Segura:** Foram incluídos \`types\` robustos para todas as entidades e navegações do app com TypeScript.
- **Formulários Desacoplados:** Utilizando e reusando apenas componentes controlados (\`Controller\`) do lado do \`React Hook Form\` para ganho de performance, sem renders desnecessários de componentes nas telas.
- **Zustand Global Store:** Foi adotado um estado onde a própria lógica de gerar os históricos e movimentações (Movements) se dá isolada dentro da manipulação dos items (increase/decrease/update).

## Próximas Evoluções Possíveis (Post-MVP)
- Adoção de temas personalizáveis (Light / Dark Mode dinâmico).
- Sincronização em nuvem e login multi-usuário (Firebase/Supabase).
- Leitura de código de barras.
- Funcionalidade de controle financeiro ou cálculo do valor acumulado (Cesta básica).
