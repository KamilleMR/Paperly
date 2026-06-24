import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

export default function ProfileScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.root}>
      {/* ─── Header Escuro ────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={{ fontSize: 40 }}>👩‍💻</Text>
        </View>
        <Text style={[Typography.h2, { color: Colors.white, marginTop: Spacing.md }]}>
          Kamille
        </Text>
        <Text style={[Typography.bodyS, { color: Colors.silver, marginTop: 2 }]}>
          Perfil Administrador
        </Text>

        {/* Status da Aplicação (Substituindo os números falsos) */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[Typography.h3, { color: Colors.white }]}>1.0.0</Text>
            <Text style={[Typography.caption, { color: Colors.slate }]}>Versão</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[Typography.h3, { color: Colors.white }]}>Admin</Text>
            <Text style={[Typography.caption, { color: Colors.slate }]}>Acesso</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[Typography.h3, { color: Colors.white }]}>Online</Text>
            <Text style={[Typography.caption, { color: Colors.slate }]}>Status</Text>
          </View>
        </View>
      </View>

      {/* ─── Corpo do Perfil ──────────────────────────────────────── */}
      <View style={styles.body}>
        <View style={styles.menuCard}>
          <MenuItem icon="⚙️" title="Definições da Conta" subtitle="Dados e privacidade" />
          <MenuItem icon="🛡️" title="Segurança" subtitle="Palavra-passe e autenticação" />
          <MenuItem icon="💬" title="Ajuda e Suporte" subtitle="FAQ e atendimento" />
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={{ fontSize: 20, marginRight: Spacing.md }}>🔔</Text>
              <View>
                <Text style={[Typography.h4, { color: Colors.ink }]}>Notificações push</Text>
                <Text style={[Typography.caption, { color: Colors.slate }]}>Ativadas</Text>
              </View>
            </View>
            <Switch value={true} trackColor={{ true: Colors.coral }} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 Encerrar sessão</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Paperly v1.0.0 - Projeto CRUD ❤️</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Text style={{ fontSize: 20, marginRight: Spacing.md }}>{icon}</Text>
        <View>
          <Text style={[Typography.h4, { color: Colors.ink }]}>{title}</Text>
          {subtitle && <Text style={[Typography.caption, { color: Colors.slate }]}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={{ color: Colors.slate, fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  header: {
    backgroundColor: Colors.ink,
    paddingTop: 80, paddingBottom: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  avatarWrap: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: Colors.coral,
    backgroundColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: Spacing.xl,
  },
  statItem: { alignItems: 'center', paddingHorizontal: Spacing.lg },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.slate, opacity: 0.3 },

  body: {
    paddingHorizontal: Spacing.lg,
    marginTop: -30, 
    paddingBottom: 100,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.creamDark,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },

  logoutBtn: {
    backgroundColor: 'rgba(229, 89, 79, 0.1)', 
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
    borderWidth: 1, borderColor: 'rgba(229, 89, 79, 0.3)'
  },
  logoutText: {
    color: Colors.coral,
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.slate,
    marginTop: Spacing.lg,
    ...Typography.caption,
  }
});