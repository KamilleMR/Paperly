import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Colors } from '../theme';
import { produtosWeb } from '../database/databaseInit';

export default function CadastroProduto({ route, navigation }) {
  const produtoParaEditar = route.params?.produtoParaEditar;

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.name || produtoParaEditar.title || '');
      setPreco(produtoParaEditar.price ? produtoParaEditar.price.toString() : '');
      setDescricao(produtoParaEditar.description || '');
      setImagem(produtoParaEditar.image || '');
    }
  }, [produtoParaEditar]);

  // ─── FUNÇÃO INTELIGENTE: TRATAMENTO DE LINKS DO GOOGLE ────────────────
  const tratarUrlImagem = (url) => {
    if (!url) return '';
    let urlLimpa = url.trim();
    
    // Se o usuário colou o link da página de resultados do Google Imagens
    if (urlLimpa.includes('imgurl=')) {
      const match = urlLimpa.match(/[?&]imgurl=([^&]+)/);
      if (match && match[1]) {
        // Extrai a URL real da foto e decodifica os caracteres especiais (ex: %2F vira /)
        return decodeURIComponent(match[1]);
      }
    }
    return urlLimpa;
  };
  // ──────────────────────────────────────────────────────────────────────

  const salvarProduto = async () => {
    if (!nome || !preco || !descricao || !imagem) {
      alert('Atenção: Por favor, preencha todos os campos.');
      return;
    }

    // Processa a imagem para garantir que pegamos a URL pública real
    const urlProcessada = tratarUrlImagem(imagem);

    try {
      if (Platform.OS === 'web') {
        if (produtoParaEditar) {
          const index = produtosWeb.findIndex((p) => p.id.toString() === produtoParaEditar.id.toString());
          if (index > -1) {
            produtosWeb[index] = {
              ...produtosWeb[index],
              nome,
              preco: parseFloat(preco),
              descricao,
              imagem: urlProcessada
            };
          }
          alert('Sucesso! Produto atualizado no banco virtual.');
        } else {
          produtosWeb.push({
            id: Date.now(),
            nome,
            preco: parseFloat(preco),
            descricao,
            imagem: urlProcessada
          });
          alert('Sucesso! Produto cadastrado no banco virtual.');
        }
      } else {
        const SQLite = require('expo-sqlite');
        const db = await SQLite.openDatabaseAsync('paperly.db');

        if (produtoParaEditar) {
          await db.runAsync(
            'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, imagem = ? WHERE id = ?',
            [nome, parseFloat(preco), descricao, urlProcessada, parseInt(produtoParaEditar.id)]
          );
          Alert.alert('Sucesso!', 'Produto atualizado no banco SQLite.');
        } else {
          await db.runAsync(
            'INSERT INTO produtos (nome, preco, descricao, imagem) VALUES (?, ?, ?, ?)',
            [nome, parseFloat(preco), descricao, urlProcessada]
          );
          Alert.alert('Sucesso!', 'Produto cadastrado no banco SQLite.');
        }
      }
      
      setNome('');
      setPreco('');
      setDescricao('');
      setImagem('');
      navigation.goBack();
      
    } catch (error) {
      console.error(error);
      alert('Erro: Não foi possível salvar as alterações.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoFechar}>
          <Text style={styles.textoFechar}>X</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço (Ex: 49.90)" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Descrição do produto" value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} />
      <TextInput style={styles.input} placeholder="URL da imagem (Google ou link direto)" value={imagem} onChangeText={setImagem} />

      <TouchableOpacity style={styles.botao} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>{produtoParaEditar ? 'Salvar Alterações' : 'Salvar Produto'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  botaoFechar: { backgroundColor: '#EEE', width: 35, height: 35, borderRadius: 17.5, alignItems: 'center', justifyContent: 'center' },
  textoFechar: { fontSize: 16, fontWeight: 'bold', color: '#666' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  botao: { backgroundColor: '#E5594F', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});