import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../../components/CustomButton';
import { ROLE_LABELS, TREATMENT_OPTIONS } from '../../constants/taskOptions';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { Treatment } from '../../types/user';
import { confirmAction, showMessage } from '../../utils/dialog';

export function SettingsScreen() {
  const { user, treatment, updateTreatment, logout } = useAuth();
  const { tasks } = useTasks();
  const { colors, isDark, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  if (!user) {
    return null;
  }

  async function handleToggleTheme(): Promise<void> {
    try {
      await toggleTheme();
    } catch (error) {
      showMessage('Aviso', error instanceof Error ? error.message : 'Não foi possível salvar o tema.');
    }
  }

  async function handleTreatment(option: Treatment): Promise<void> {
    try {
      // Tocar novamente na opção selecionada remove a preferência.
      await updateTreatment(option === treatment ? null : option);
    } catch (error) {
      showMessage('Erro', error instanceof Error ? error.message : 'Não foi possível salvar a preferência.');
    }
  }

  function confirmLogout(): void {
    confirmAction({
      title: 'Sair',
      message: 'Deseja realmente encerrar a sessão?',
      confirmText: 'Sair',
      destructive: true,
      onConfirm: async () => {
        setIsLoggingOut(true);
        try {
          await logout();
        } catch {
          setIsLoggingOut(false);
          showMessage('Erro', 'Não foi possível encerrar a sessão.');
        }
      },
    });
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Perfil</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryText }]}>{user.name.charAt(0)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[styles.name, { color: colors.text }]}>
              {treatment ? `${treatment} ${user.name}` : user.name}
            </Text>
            <Text style={[styles.muted, { color: colors.textMuted }]}>@{user.username}</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <InfoRow label="Perfil" value={ROLE_LABELS[user.role]} icon="shield-checkmark-outline" />
        <InfoRow label="Tarefas cadastradas" value={String(tasks.length)} icon="list-outline" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Aparência</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.switchRow}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={[styles.label, { color: colors.text }]}>Tema escuro</Text>
            <Text style={[styles.muted, { color: colors.textMuted }]}>
              {isDark ? 'Ativado' : 'Desativado'} · salvo no dispositivo
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
            accessibilityRole="switch"
            accessibilityLabel="Tema escuro"
            accessibilityHint="Alterna entre o tema claro e o escuro"
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Tratamento</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.muted, { color: colors.textMuted }]}>
          Como prefere ser chamado? Toque novamente para remover.
        </Text>
        <View style={styles.treatmentRow} accessibilityRole="radiogroup" accessibilityLabel="Preferência de tratamento">
          {TREATMENT_OPTIONS.map((option) => {
            const isSelected = option === treatment;
            return (
              <Pressable
                key={option}
                onPress={() => handleTreatment(option)}
                accessibilityRole="radio"
                accessibilityLabel={`Tratamento ${option}`}
                accessibilityState={{ checked: isSelected }}
                style={({ pressed }) => [
                  styles.treatment,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.treatmentLabel, { color: isSelected ? colors.primaryText : colors.text }]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <CustomButton
        title="Sair da conta"
        icon="log-out-outline"
        variant="danger"
        onPress={confirmLogout}
        loading={isLoggingOut}
        accessibilityHint="Encerra a sessão e volta para a tela de login"
        style={styles.logout}
      />
      <Text style={[styles.version, { color: colors.textMuted }]}>TaskFlow · versão 1.0.0</Text>
    </ScrollView>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={[styles.flex, styles.label, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.textMuted }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  muted: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  treatmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  treatment: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treatmentLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  logout: {
    marginTop: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
});
