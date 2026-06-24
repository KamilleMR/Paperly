# 📚 Paperly — E-commerce App (React Native / Expo)

App de e-commerce de papelaria desenvolvido em React Native com Expo.

## 🎨 Design System
| Token   | Valor       | Uso                          |
|---------|-------------|------------------------------|
| ink     | #1A1A2E     | Fundo escuro, texto primário |
| cream   | #FAF7F2     | Fundo principal (quente)     |
| coral   | #E8614D     | Destaque, CTAs, badges       |
| slate   | #6B7280     | Texto secundário             |

Tipografia: Georgia (display serif) + sistema (corpo/UI)

## Estrutura
paperly/
├── App.js
├── package.json
└── src/
    ├── theme/           -- Design tokens
    ├── data/            -- Mock data
    ├── components/      -- Componentes reutilizáveis
    ├── navigation/      -- Bottom tabs + Stack
    ├── database/        -- Lógica de persistência (SQLite)
    └── screens/         -- Telas do aplicativo
        ├── HomeScreen.js
        ├── ShopScreen.js
        ├── ProductDetailScreen.js
        ├── CartScreen.js
        └── ProfileScreen.js

## Como rodar
1- Instalar dependências:
npm install

2- Executar:
npx expo start

## 🛠️ Notas Técnicas (Persistência)
Para garantir a compatibilidade entre dispositivos mobile e web, o projeto utiliza uma arquitetura de banco de dados híbrida:
- Mobile: Utiliza expo-sqlite para persistência física dos dados.
- Web: Utiliza uma abstração em memória (databaseInit.js) para simular o comportamento de CRUD sem dependências nativas, permitindo que o professor teste a lógica de navegação e edição diretamente no navegador.
