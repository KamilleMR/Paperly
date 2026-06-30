import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Image, Animated, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { ProductCard, CategoryPill, SectionHeader } from '../components';
import { products, categories, banners } from '../data';
import { produtosWeb } from '../database/databaseInit'; 

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const horaAtual = new Date().getHours();
  let saudacao = 'Boa noite';
  if (horaAtual >= 5 && horaAtual < 12) saudacao = 'Bom dia';
  else if (horaAtual >= 12 && horaAtual < 18) saudacao = 'Boa tarde';

  // ─── Lógica do Read (Ler do Banco de Dados) ───────────────────────────
  const [meusProdutos, setMeusProdutos] = useState([]);

  // O useFocusEffect faz a tela recarregar a lista toda vez que você volta para ela
  useFocusEffect(
    useCallback(() => {
      async function carregarBanco() {
        let dadosBrutos = [];
        
        if (Platform.OS === 'web') {
          dadosBrutos = [...produtosWeb];
        } else {
          const SQLite = require('expo-sqlite');
          const db = await SQLite.openDatabaseAsync('paperly.db');
          // Busca todos os produtos ordenando do mais novo para o mais antigo
          dadosBrutos = await db.getAllAsync('SELECT * FROM produtos ORDER BY id DESC');
        }

        const produtosFormatados = dadosBrutos.map(item => {
          const nomeLower = item.nome ? item.nome.toLowerCase() : itemBanco.nome.toLowerCase();
          let catDinamica = 'Cadernos';
          
          if (nomeLower.includes('caneta') || nomeLower.includes('lápis') || nomeLower.includes('grafite')) {
            catDinamica = 'Canetas';
          } else if (nomeLower.includes('plan') || nomeLower.includes('agenda')) {
            catDinamica = 'Planejadores';
          } else if (nomeLower.includes('adesivo') || nomeLower.includes('sticker')) {
            catDinamica = 'Adesivos';
          } else if (nomeLower.includes('marcador') || nomeLower.includes('marca texto')) {
            catDinamica = 'Marcadores';
          } else if (nomeLower.includes('pasta') || nomeLower.includes('fichário') || nomeLower.includes('arquivo')) {
            catDinamica = 'Pastas'; 
          }
          
          return {
            id: item.id.toString(),
            title: item.nome, 
            name: item.nome, 
            price: item.preco,
            description: item.descricao,
            image: item.imagem,
            stock: 10,
            inStock: true,
            countInStock: 10,
            category: catDinamica
          };
        });

        setMeusProdutos(produtosFormatados);
      }
      
      carregarBanco();
    }, [])
  );
  // ──────────────────────────────────────────────────────────────────────

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const onSale = products.filter((p) => p.originalPrice);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={[Typography.h4, { color: Colors.ink }]}>paperly</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ─── Top Bar ─────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View>
            <Text style={[Typography.caption, { color: Colors.slate }]}>{saudacao} 👋</Text>
            <Text style={[Typography.h2, { marginTop: 2 }]}>Olá, Kamille!</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.notifBtn, { marginRight: 10, backgroundColor: Colors.coral }]}
              onPress={() => navigation.navigate('CadastroProduto')}
            >
              <Text style={{ fontSize: 24, color: Colors.white, marginTop: -2 }}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Wishlist')}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Search ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.searchBox, searchFocus && styles.searchFocused]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <Text style={[Typography.body, { color: Colors.slate }]}>
            Buscar cadernos, canetas...
          </Text>
        </TouchableOpacity>

        {/* ─── Banner Carousel ─────────────────────────────────── */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setActiveBanner(Math.round(e.nativeEvent.contentOffset.x / (width - 48)));
          }}
          style={styles.bannerScroll}
        >
          {banners.map((b) => (
            <TouchableOpacity
              key={b.id}
              activeOpacity={0.92}
              style={[styles.banner, { backgroundColor: b.bg }]}
            >
              <View style={styles.bannerText}>
                <Text style={[Typography.h2, { color: b.accent, lineHeight: 32 }]}>{b.title}</Text>
                <Text style={[Typography.bodyS, { color: b.accent, opacity: 0.7, marginTop: 4 }]}>
                  {b.subtitle}
                </Text>
                <View style={[styles.bannerCta, { backgroundColor: b.accent }]}>
                  <Text style={[Typography.caption, { color: b.bg, fontWeight: '800' }]}>
                    {b.cta} →
                  </Text>
                </View>
              </View>
              <Image source={{ uri: b.image }} style={styles.bannerImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeBanner ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* ─── Categorias ──────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Categorias" actionLabel="Ver todas" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {/* Adicionamos o botão Todos para você poder limpar o filtro na Home */}
            <TouchableOpacity
              style={[styles.notifBtn, { marginRight: 8, width: 'auto', paddingHorizontal: 15, backgroundColor: activeCategory === null ? Colors.ink : Colors.white }]}
              onPress={() => setActiveCategory(null)}
            >
               <Text style={{ color: activeCategory === null ? Colors.white : Colors.ink, fontWeight: 'bold' }}>Todos</Text>
            </TouchableOpacity>
            
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                selected={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ─── Destaques (Agora lê do Banco de Dados) ──────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Meus Produtos Cadastrados"
            actionLabel="Ver todos"
            onAction={() => navigation.navigate('Shop')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {meusProdutos.length > 0 ? (
              // Aqui aplicamos o filtro antes de desenhar os cards
              meusProdutos
                .filter(p => activeCategory ? p.category === categories.find(c => c.id === activeCategory)?.name : true)
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    style={{ marginRight: Spacing.md }}
                    onPress={() => navigation.navigate('ProductDetail', { product: p })}
                  />
              ))
            ) : (
              <Text style={{ color: Colors.slate, fontStyle: 'italic', paddingVertical: 20 }}>
                Nenhum produto cadastrado no banco ainda. Clique no + acima!
              </Text>
            )}
          </ScrollView>
        </View>

        {/* ─── Promo Banner ────────────────────────────────────── */}
        <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
          <View>
            <Text style={[Typography.caption, { color: Colors.coralLight }]}>OFERTA ESPECIAL</Text>
            <Text style={[Typography.h3, { color: Colors.white, marginTop: 4 }]}>
              Kits completos{'\n'}com até 40% OFF
            </Text>
            <Text style={[Typography.bodyS, { color: Colors.silver, marginTop: 6 }]}>
              Só esta semana ⚡
            </Text>
          </View>
          <Text style={{ fontSize: 64 }}>🎨</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: Colors.cream },
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 52, paddingBottom: 12, paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.cream, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.silver,
    alignItems: 'center',
  },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  notifDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.coral,
    position: 'absolute', top: 8, right: 8,
    borderWidth: 2, borderColor: Colors.white,
  },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    ...Shadow.card,
  },
  searchFocused: { borderWidth: 2, borderColor: Colors.coral },

  bannerScroll: { paddingLeft: Spacing.lg },
  banner: {
    width: width - 48, height: 170, borderRadius: Radius.lg,
    overflow: 'hidden', flexDirection: 'row',
    alignItems: 'center', padding: Spacing.lg, marginRight: Spacing.md,
  },
  bannerText: { flex: 1 },
  bannerCta: {
    alignSelf: 'flex-start', marginTop: 12,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radius.full,
  },
  bannerImage: { width: 90, height: 90, borderRadius: Radius.md, opacity: 0.9 },

  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: Spacing.md, marginBottom: Spacing.sm,
  },
  dot:        { width: 6, height: 6, borderRadius: 3, marginHorizontal: 3 },
  dotActive:  { backgroundColor: Colors.coral, width: 20 },
  dotInactive: { backgroundColor: Colors.silver },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  categoryScroll: { marginHorizontal: -Spacing.lg, paddingHorizontal: Spacing.lg },

  promoBanner: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.ink,
    borderRadius: Radius.lg, padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
});