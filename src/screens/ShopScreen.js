import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Modal, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { ProductCard, CategoryPill } from '../components';
import { categories } from '../data';
import { produtosWeb } from '../database/databaseInit';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevância'    },
  { id: 'price_asc', label: 'Menor preço'   },
  { id: 'price_desc', label: 'Maior preço'  },
  { id: 'rating',    label: 'Melhor avaliados' },
];

export default function ShopScreen({ navigation }) {
  const [query, setQuery]           = useState('');
  const [activeCategory, setActive] = useState(null);
  const [sort, setSort]             = useState('relevance');
  const [sortModal, setSortModal]   = useState(false);

  const [dbProducts, setDbProducts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarBanco() {
        let dadosBrutos = [];
        if (Platform.OS === 'web') {
          dadosBrutos = [...produtosWeb];
        } else {
          const SQLite = require('expo-sqlite');
          const db = await SQLite.openDatabaseAsync('paperly.db');
          dadosBrutos = await db.getAllAsync('SELECT * FROM produtos ORDER BY id DESC');
        }

        const produtosFormatados = dadosBrutos.map(item => {
          const nomeLower = item.nome ? item.nome.toLowerCase() : itemBanco.nome.toLowerCase();
          let catDinamica = 'Cadernos'; // Categoria padrão
          
          if (nomeLower.includes('caneta') || nomeLower.includes('lápis') || nomeLower.includes('grafite')) {
            catDinamica = 'Canetas';
          } else if (nomeLower.includes('plan') || nomeLower.includes('agenda')) {
            catDinamica = 'Planejadores';
          } else if (nomeLower.includes('adesivo') || nomeLower.includes('sticker')) {
            catDinamica = 'Adesivos';
          } else if (nomeLower.includes('marcador') || nomeLower.includes('marca texto')) {
            catDinamica = 'Marcadores'; // <-- Nova categoria independente!
          } else if (nomeLower.includes('pasta') || nomeLower.includes('fichário') || nomeLower.includes('arquivo')) {
            catDinamica = 'Pastas'; // <-- Nova categoria independente!
          }

          return {
            id: item.id.toString(),
            name: item.nome,
            title: item.nome,
            price: item.preco,
            description: item.descricao,
            image: item.imagem,
            inStock: true,
            rating: 5.0, 
            category: catDinamica, 
          };
        });

        setDbProducts(produtosFormatados);
      }
      
      carregarBanco();
    }, [])
  );

  const filtered = useMemo(() => {
    let list = [...dbProducts];
    if (query)          list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (activeCategory) list = list.filter((p) => p.category === categories.find((c) => c.id === activeCategory)?.name);
    if (sort === 'price_asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [query, activeCategory, sort, dbProducts]);

  const currentSort = SORT_OPTIONS.find((o) => o.id === sort)?.label;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={Typography.h2}>Catálogo</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortModal(true)}>
          <Text style={{ fontSize: 14 }}>⇅ </Text>
          <Text style={[Typography.caption, { fontWeight: '700', color: Colors.ink }]}>{currentSort}</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={[Typography.body, { flex: 1 }]}
            placeholder="Buscar produtos..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ fontSize: 16, color: Colors.slate }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        <TouchableOpacity
          style={[styles.pill, !activeCategory && styles.pillActive]}
          onPress={() => setActive(null)}
        >
          <Text style={[Typography.caption, { fontWeight: '700', color: !activeCategory ? Colors.white : Colors.ink }]}>
            Todos
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            category={cat}
            selected={activeCategory === cat.id}
            onPress={() => setActive(activeCategory === cat.id ? null : cat.id)}
          />
        ))}
      </ScrollView>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48 }}>📝</Text>
            <Text style={[Typography.h3, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Lista Vazia</Text>
            <Text style={[Typography.body, { color: Colors.slate, textAlign: 'center' }]}>
              Nenhum produto cadastrado nessa categoria ainda!
            </Text>
          </View>
        )}
      />

      {/* Sort Modal */}
      <Modal visible={sortModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSortModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.sheetHandle} />
          <Text style={[Typography.h3, { marginBottom: Spacing.lg }]}>Ordenar por</Text>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.sortOption}
              onPress={() => { setSort(opt.id); setSortModal(false); }}
            >
              <Text style={[Typography.body, sort === opt.id && { fontWeight: '700', color: Colors.coral }]}>{opt.label}</Text>
              {sort === opt.id && <Text style={{ color: Colors.coral }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  sortBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.white, borderRadius: Radius.full, ...Shadow.card },
  searchWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, ...Shadow.card },
  
  // Consertando o "ovo": Adicionamos alignItems flex-start e travamos a altura da pill
  catRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, alignItems: 'flex-start' },
  pill: { paddingHorizontal: 16, height: 38, justifyContent: 'center', borderRadius: 19, marginRight: 8, backgroundColor: Colors.creamDark },
  pillActive: { backgroundColor: Colors.ink },
  
  grid: { paddingHorizontal: Spacing.lg, paddingBottom: 100, paddingTop: 10 },
  row:  { gap: Spacing.md, marginBottom: Spacing.md },
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.silver, alignSelf: 'center', marginBottom: Spacing.lg },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
});