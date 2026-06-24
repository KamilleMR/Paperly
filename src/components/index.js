import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, Animated,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

// ─── Product Card ─────────────────────────────────────────────────────────────
export function ProductCard({ product, onPress, style }) {
  const [liked, setLiked] = useState(false);
  const scale = new Animated.Value(1);

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();
    setLiked(!liked);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, Shadow.card, style]}
      onPress={onPress}
      activeOpacity={0.93}
    >
      {/* Image */}
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: product.image }} style={styles.cardImage} resizeMode="cover" />
        
        {/* Badge */}
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: Colors.coral }]}>
            <Text style={[Typography.tag, { color: Colors.white, fontSize: 9 }]}>
              {product.badge}
            </Text>
          </View>
        )}

        {/* Wishlist */}
        <TouchableOpacity style={styles.heartBtn} onPress={handleLike} activeOpacity={0.8}>
          <Animated.Text style={[{ transform: [{ scale }] }, styles.heartIcon]}>
            {liked ? '❤️' : '🤍'}
          </Animated.Text>
        </TouchableOpacity>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <View style={styles.outOfStock}>
            <Text style={[Typography.caption, { color: Colors.white }]}>Esgotado</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={[Typography.caption, { color: Colors.slate }]}>{product.category}</Text>
        <Text style={[Typography.h4, { marginTop: 2, marginBottom: 4 }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.starText}>★</Text>
          <Text style={[Typography.bodyS, { color: Colors.ink, fontWeight: '600', marginLeft: 2 }]}>
            {product.rating}
          </Text>
          <Text style={[Typography.bodyS, { marginLeft: 4 }]}>({product.reviews})</Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={Typography.price}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
          {discount && (
            <View style={styles.discountChip}>
              <Text style={[Typography.tag, { color: Colors.coral, fontSize: 10 }]}>-{discount}%</Text>
            </View>
          )}
        </View>
        {product.originalPrice && (
          <Text style={styles.strikePrice}>
            R$ {product.originalPrice.toFixed(2).replace('.', ',')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Category Pill ────────────────────────────────────────────────────────────
export function CategoryPill({ category, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        selected
          ? { backgroundColor: Colors.ink, ...Shadow.card }
          : { backgroundColor: category.color || Colors.creamDark },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16 }}>{category.icon}</Text>
      <Text
        style={[
          Typography.caption,
          { marginLeft: 6, color: selected ? Colors.white : Colors.ink, fontWeight: '700' },
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, icon, disabled, fullWidth }) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryBtn,
        Shadow.button,
        disabled && { opacity: 0.5 },
        fullWidth && { width: '100%' },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {icon && <Text style={{ marginRight: 8, fontSize: 16 }}>{icon}</Text>}
      <Text style={[Typography.button, { color: Colors.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={Typography.h3}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[Typography.caption, { color: Colors.coral, fontWeight: '700' }]}>
            {actionLabel} →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Rating Stars ─────────────────────────────────────────────────────────────
export function RatingStars({ rating, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#F59E0B' : Colors.silver }}>
          ★
        </Text>
      ))}
    </View>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
export function ColorSwatch({ color, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.swatch, { backgroundColor: color }, selected && styles.swatchSelected]}
      onPress={onPress}
    />
  );
}

// ─── Cart Item ────────────────────────────────────────────────────────────────
export function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <View style={[styles.cartItem, Shadow.card]}>
      <Image source={{ uri: item.image }} style={styles.cartImage} resizeMode="cover" />
      <View style={styles.cartInfo}>
        <Text style={[Typography.caption, { color: Colors.slate }]}>{item.brand}</Text>
        <Text style={Typography.h4} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.swatchSmall, { backgroundColor: item.selectedColor }]} />
        <Text style={[Typography.price, { fontSize: 16, marginTop: 4 }]}>
          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
        </Text>
      </View>
      <View style={styles.qtyControl}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onQtyChange(item.id, item.quantity - 1)}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={[Typography.h4, { marginHorizontal: 12 }]}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: Colors.ink }]}
          onPress={() => onQtyChange(item.id, item.quantity + 1)}
        >
          <Text style={[styles.qtyBtnText, { color: Colors.white }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    width: 170,
  },
  cardImageWrap: {
    width: '100%',
    height: 190,
    backgroundColor: Colors.creamDark,
  },
  cardImage:   { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 10, left: 10,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full,
  },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  heartIcon: { fontSize: 14 },
  outOfStock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,46,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: Spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  starText:  { color: '#F59E0B', fontSize: 13 },
  priceRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  discountChip: {
    backgroundColor: Colors.coralLight,
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  strikePrice: {
    ...Typography.bodyS,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },

  // Pill
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: Radius.full, marginRight: 8,
  },

  // Button
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.coral,
    paddingVertical: 16, paddingHorizontal: 28,
    borderRadius: Radius.md,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },

  // Swatch
  swatch: {
    width: 28, height: 28, borderRadius: 14, marginRight: 8,
  },
  swatchSelected: {
    borderWidth: 2.5, borderColor: Colors.ink,
    transform: [{ scale: 1.15 }],
  },

  // Cart
  cartItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cartImage:  { width: 72, height: 72, borderRadius: Radius.md, marginRight: Spacing.md },
  cartInfo:   { flex: 1 },
  swatchSmall: { width: 16, height: 16, borderRadius: 8, marginTop: 4 },
  qtyControl: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.creamDark,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: Colors.ink },
});
