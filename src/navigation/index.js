import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Shadow } from '../theme';

// Screens
import HomeScreen          from '../screens/HomeScreen';
import ShopScreen          from '../screens/ShopScreen';
import CartScreen          from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileScreen       from '../screens/ProfileScreen';
import CadastroProduto     from '../screens/CadastroProduto'; // <-- Nova importação aqui

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function TabBar({ state, descriptors, navigation }) {
  const tabs = [
    { name: 'Home',    icon: '🏠', iconActive: '🏠' },
    { name: 'Shop',    icon: '🛍',  iconActive: '🛍' },
    { name: 'Cart',    icon: '🛒',  iconActive: '🛒', badge: null },
    { name: 'Profile', icon: '👤', iconActive: '👤' },
  ];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = tabs[index];

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.tabIconWrap, isFocused && styles.tabIconActive]}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              {tab.badge && !isFocused && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.tabLabel,
              isFocused ? { color: Colors.coral, fontWeight: '700' } : { color: Colors.slate },
            ]}>
              {descriptors[route.key].options.tabBarLabel || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ tabBarLabel: 'Início'   }} />
      <Tab.Screen name="Shop"    component={ShopScreen}    options={{ tabBarLabel: 'Catálogo' }} />
      <Tab.Screen name="Cart"    component={CartScreen}    options={{ tabBarLabel: 'Carrinho' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil'   }} />
    </Tab.Navigator>
  );
}

// ─── Root Stack ───────────────────────────────────────────────────────────────
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main"          component={MainTabs}          />
        
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />

        {/* ─── Nova Tela de Cadastro Registrada Aqui ─── */}
        <Stack.Screen
          name="CadastroProduto"
          component={CadastroProduto}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal', 
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.silver,
    ...Shadow.card,
  },
  tabItem:       { flex: 1, alignItems: 'center' },
  tabIconWrap: {
    width: 40, height: 40, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  tabIconActive: { backgroundColor: Colors.coralLight },
  tabIcon:       { fontSize: 20 },
  tabLabel:      { ...Typography.caption, marginTop: 4 },
  tabBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.coral,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  tabBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.white },
});