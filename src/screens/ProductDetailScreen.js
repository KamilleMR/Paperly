import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, Dimensions, Animated, Share, Platform, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { PrimaryButton, RatingStars, ColorSwatch, SectionHeader, ProductCard } from '../components';
import { products } from '../data';
import { produtosWeb, carrinhoVirtual } from '../database/databaseInit';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product: initialProduct } = route.params;
  
  const [product, setProduct] = useState(initialProduct);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : '#000');
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Controle caso o link da imagem esteja quebrado
  const [imgError, setImgError] = useState(false);
  // Imagem padrão de papelaria caso o link falhe
  const fallbackImage = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop';

  const scrollY = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      async function buscarDadosAtualizados() {
        let itemBanco = null;
        
        if (Platform.OS === 'web') {
          itemBanco = produtosWeb.find((p) => p.id.toString() === initialProduct.id.toString());
        } else {
          const SQLite = require('expo-sqlite');
          const db = await SQLite.openDatabaseAsync('paperly.db');
          itemBanco = await db.getFirstAsync('SELECT * FROM produtos WHERE id = ?', [parseInt(initialProduct.id)]);
        }

        if (itemBanco) {
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

          setProduct({
            id: itemBanco.id.toString(),
            name: itemBanco.nome,
            title: itemBanco.nome,
            price: itemBanco.preco,
            description: itemBanco.descricao,
            image: itemBanco.imagem,
            inStock: true,
            rating: 5.0,
            category: catDinamica
          });
          setImgError(false); // Reseta o erro de imagem ao carregar novo produto
        }
      }

      buscarDadosAtualizados();
    }, [initialProduct])
  );

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  const handleAddToCart = () => {
    carrinhoVirtual.push({
      ...product,
      quantidadeSelecionada: qty
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Olha esse produto incrível no Paperly: ${product.name || product.title} por R$ ${product.price}`,
    });
  };

  const handleExcluir = async () => {
    try {
      if (Platform.OS === 'web') {
        const index = produtosWeb.findIndex((p) => p.id.toString() === product.id.toString());
        if (index > -1) {
          produtosWeb.splice(index, 1);
        }
        alert('Produto excluído com sucesso do banco virtual!');
      } else {
        const SQLite = require('expo-sqlite');
        const db = await SQLite.openDatabaseAsync('paperly.db');
        await db.runAsync('DELETE FROM produtos WHERE id = ?', [parseInt(product.id)]);
        Alert.alert('Sucesso', 'Produto excluído do SQLite!');
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao tentar excluir o produto.');
    }
  };

  const handleEditar = () => {
    navigation.navigate('CadastroProduto', { produtoParaEditar: product });
  };

  const ehProdutoCadastrado = product.id && (Platform.OS === 'web' 
    ? produtosWeb.some(p => p.id.toString() === product.id.toString())
    : !products.some(p => p.id.toString() === product.id.toString())
  );

  return (
    <View style={styles.root}>
      {/* ─── Floating Back + Share ──────────────────────────── */}
      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.floatBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.floatBtnIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
          <Text style={styles.floatBtnIcon}>⬆</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ─── Hero Image (Agora com fallback contra erros) ─────── */}
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: imgError || !product.image ? fallbackImage : product.image }}
            onError={() => setImgError(true)}
            style={[styles.heroImage, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
          />
          {product.badge && (
            <View style={styles.heroBadge}>
              <Text style={[Typography.tag, { color: Colors.white, fontSize: 10 }]}>
                {product.badge}
              </Text>
            </View>
          )}
        </View>

        {/* ─── Content Card ────────────────────────────────────── */}
        <View style={styles.contentCard}>
          {/* Header */}
          <View style={styles.productHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.caption, { color: Colors.coral }]}>{product.brand || 'Paperly'}</Text>
              <Text style={[Typography.h2, { marginTop: 4 }]}>{product.name || product.title}</Text>
            </View>
            <View style={styles.stockIndicator}>
              <View style={[styles.stockDot, {
                backgroundColor: product.inStock ? Colors.success : Colors.slate
              }]} />
              <Text style={[Typography.caption, { marginLeft: 4 }]}>
                {product.inStock ? 'Em estoque' : 'Esgotado'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[Typography.price, { fontSize: 28 }]}>
              R$ {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'}
            </Text>
          </View>

          {/* ─── PAINEL DO CRUD: EDITAR E EXCLUSÃO (UPDATE / DELETE) ─── */}
          {ehProdutoCadastrado && (
            <View style={styles.adminPanel}>
              <Text style={styles.adminTitle}>Gerenciar Produto</Text>
              <View style={styles.adminButtonsRow}>
                <TouchableOpacity style={styles.btnEditar} onPress={handleEditar}>
                  <Text style={styles.btnTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
                  <Text style={styles.btnTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={[Typography.h4, { marginBottom: Spacing.sm }]}>Sobre o produto</Text>
          <Text style={Typography.body}>{product.description}</Text>

          {/* Features */}
          <View style={styles.featureGrid}>
            {[
              { icon: '🚚', label: 'Frete grátis\nacima de R$150' },
              { icon: '↩️', label: 'Devolução\nem 30 dias' },
              { icon: '🔒', label: 'Pagamento\nseguro' },
              { icon: '⭐', label: 'Produto\ncertificado' },
            ].map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</Text>
                <Text style={[Typography.caption, { textAlign: 'center', lineHeight: 15 }]}>
                  {f.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* ─── Bottom Bar ──────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={[Typography.h3, { marginHorizontal: 16 }]}>{qty}</Text>
          <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: Colors.ink }]} onPress={() => setQty((q) => q + 1)}>
            <Text style={[styles.qtyBtnText, { color: Colors.white }]}>+</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          label={addedToCart ? '✓ Adicionado!' : 'Adicionar ao carrinho'}
          onPress={handleAddToCart}
          disabled={false}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  floatingBar: { position: 'absolute', top: 52, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, zIndex: 20 },
  floatBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  floatBtnIcon: { fontSize: 18, color: Colors.ink, fontWeight: '700' },
  imageContainer: { width, height: height * 0.45, overflow: 'hidden', backgroundColor: '#EFEFEF' },
  heroImage:      { width: '100%', height: '100%' },
  heroBadge: { position: 'absolute', bottom: 16, left: 16, backgroundColor: Colors.coral, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  contentCard: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: Spacing.lg, minHeight: height * 0.6 },
  productHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.sm },
  stockIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  priceSection: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: Spacing.md },
  
  // Botões Minimalistas
  adminPanel: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: Radius.md, padding: 12, marginTop: 10, ...Shadow.card },
  adminTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.slate, marginBottom: 8 },
  adminButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  btnEditar: { flex: 1, backgroundColor: '#4A90E2', paddingVertical: 12, borderRadius: Radius.sm, alignItems: 'center' },
  btnExcluir: { flex: 1, backgroundColor: Colors.coral, paddingVertical: 12, borderRadius: Radius.sm, alignItems: 'center' },
  btnTexto: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: Colors.silver, marginVertical: Spacing.lg },
  featureGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg, backgroundColor: Colors.creamDark, borderRadius: Radius.lg, padding: Spacing.md },
  featureItem: { alignItems: 'center', flex: 1 },
  
  // Barra inferior com espaçamento corrigido
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: 32, borderTopWidth: 1, borderTopColor: Colors.silver, ...Shadow.card },
  qtyRow:    { flexDirection: 'row', alignItems: 'center', marginRight: 24 }, // Aumentado o espaço aqui!
  qtyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.creamDark, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: Colors.ink },
});