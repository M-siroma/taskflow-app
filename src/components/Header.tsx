import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ROLE_LABELS } from '../constants/taskOptions';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { confirmAction, showMessage } from '../utils/dialog';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, treatment, logout } = useAuth();
  const { colors } = useTheme();

  if (!user) {
    return null;
  }

  const displayName = treatment ? `${treatment} ${user.name}` : user.name;

  function confirmLogout(): void {
    confirmAction({
      title: 'Sair',
      message: 'Deseja realmente encerrar a sessão?',
      confirmText: 'Sair',
      destructive: true,
      onConfirm: async () => {
        try {
          await logout();
        } catch {
          showMessage('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
        }
      },
    });
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          accessibilityIgnoresInvertColors
          accessible={false}
        />
        <View style={styles.info}>
          <Text style={[styles.screenTitle, { color: colors.text }]} accessibilityRole="header">
            {title}
          </Text>
          <Text style={[styles.user, { color: colors.textMuted }]} numberOfLines={1}>
            {displayName} · {ROLE_LABELS[user.role]}
          </Text>
        </View>
        <Pressable
          onPress={confirmLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          accessibilityHint="Encerra a sessão e volta para a tela de login"
          hitSlop={8}
          style={({ pressed }) => [styles.logout, { backgroundColor: colors.surfaceAlt }, pressed && styles.pressed]}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  user: {
    fontSize: 13,
    marginTop: 1,
  },
  logout: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
