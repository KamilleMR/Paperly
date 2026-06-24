import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { carrinhoVirtual } from '../database/databaseInit';

export default function CartScreen({ navigation }) {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [total, setTotal] = useState(0);

  // Recarrega o carrinho toda vez que a tela é aberta
  useFocusEffect(
    useCallback(() => {
      setItensCarrinho([...carrinhoVirtual]);
      
      // Calcula o valor total
      const soma = carrinhoVirtual.reduce((acc, item) => acc + (item.price * item.quantidadeSelecionada), 0);
      setTotal(soma);
    }, [])
  );

  const limparCarrinho = () => {
    carrinhoVirtual.length = 0; // Esvazia o array global
    setItensCarrinho([]);
    setTotal(0);
    alert('Carrinho esvaziado com sucesso!');
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[Typography.caption, { color: Colors.coral }]}>{item.category || 'Paperly'}</Text>
        <Text style={[Typography.h4, { marginVertical: 4 }]} numberOfLines={1}>{item.name || item.title}</Text>
        <Text style={Typography.h3}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
      </View>
      <View style={styles.itemQtyBox}>
        <Text style={[Typography.caption, { color: Colors.slate }]}>Qtd.</Text>
        <Text style={Typography.h3}>{item.quantidadeSelecionada}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={Typography.h2}>Meu Carrinho</Text>
        <Text style={[Typography.caption, { color: Colors.slate }]}>{itensCarrinho.length} itens</Text>
      </View>

      {itensCarrinho.length === 0 ? (
        /* Tela de Carrinho Vazio */
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 64 }}>🛒</Text>
          <Text style={[Typography.h3, { marginTop: Spacing.lg }]}>Seu carrinho está vazio</Text>
          <Text style={[Typography.body, { color: Colors.slate, textAlign: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.xl }]}>
            Explore nosso catálogo e adicione produtos para vê-los aqui!
          </Text>
          <TouchableOpacity style={styles.btnExplorar} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.btnTexto}>Explorar Produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Lista de Produtos no Carrinho */
        <>
          <FlatList
            data={itensCarrinho}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Resumo e Botões de Ação */}
          <View style={styles.bottomBar}>
            <View style={styles.totalRow}>
              <Text style={Typography.h3}>Total:</Text>
              <Text style={[Typography.h2, { color: Colors.ink }]}>R$ {total.toFixed(2).replace('.', ',')}</Text>
            </View>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.btnLimpar} onPress={limparCarrinho}>
                <Text style={[styles.btnTexto, { color: Colors.coral }]}>Limpar Tudo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnFinalizar} 
                onPress={() => alert(`Compra de R$ ${total.toFixed(2)} simulada com sucesso para a apresentação!`)}
              >
                <Text style={styles.btnTexto}>Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  
  // Estilos do Vazio
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  btnExplorar: { backgroundColor: Colors.coral, paddingVertical: 14, paddingHorizontal: 32, borderRadius: Radius.full, marginTop: Spacing.xl },
  
  // Estilos da Lista com Itens
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: 150 },
  cartItem: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center', ...Shadow.card
  },
  itemImage: { width: 70, height: 70, borderRadius: Radius.md, backgroundColor: Colors.creamDark, marginRight: Spacing.md },
  itemInfo: { flex: 1 },
  itemQtyBox: { alignItems: 'center', justifyContent: 'center', paddingLeft: Spacing.md, borderLeftWidth: 1, borderLeftColor: Colors.silver },
  
  // Estilos da Barra Inferior
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.silver, paddingBottom: 32, ...Shadow.card
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btnLimpar: {
    flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.coral
  },
  btnFinalizar: {
    flex: 1, backgroundColor: Colors.coral, paddingVertical: 14, alignItems: 'center',
    justifyContent: 'center', borderRadius: Radius.full
  },
  btnTexto: { fontWeight: 'bold', fontSize: 16, color: Colors.white }
});