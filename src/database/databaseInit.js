import { Platform } from 'react-native';

// Array temporário para simular o banco na Web
export let produtosWeb = [];

// Nossa memória virtual para o carrinho de compras
export let carrinhoVirtual = [];

export async function iniciarBancoDeDados() {
  if (Platform.OS === 'web') {
    console.log("Modo Web ativado: Usando banco virtual para evitar travamento.");
    return;
  }

  // O "require" aqui dentro esconde o SQLite do navegador, evitando o erro vermelho
  const SQLite = require('expo-sqlite');
  const db = await SQLite.openDatabaseAsync('paperly.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      descricao TEXT NOT NULL,
      imagem TEXT NOT NULL
    );
  `);
  console.log("Banco de dados SQLite inicializado com sucesso no Mobile!");
}