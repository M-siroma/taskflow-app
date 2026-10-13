import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge';
import { getCategoryIcon, getCategoryLabel, STATUS_OPTIONS } from '../../constants/taskOptions';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { TaskStatus } from '../../types/task';
import { formatDate } from '../../utils/formatDate';
import { confirmAction, showMessage } from '../../utils/dialog';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({ navigation, route }: Props) {
  const { taskId } = route.params;
  const { getTaskById, updateTaskStatus, deleteTask } = useTasks();
  const { colors } = useTheme();
  const task = getTaskById(taskId);

  const [updatingStatus, setUpdatingStatus] = useState<TaskStatus | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!task) {
    // Logo após a exclusão a tarefa some do contexto; não exibimos o aviso de "não encontrada".
    if (isDeleting) {
      return null;
    }
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Tarefa não encontrada"
          message="Ela pode ter sido excluída ou pertencer a outro usuário."
          actionLabel="Voltar para a lista"
          onAction={() => navigation.popToTop()}
        />
      </View>
    );
  }

  async function handleStatusChange(status: TaskStatus): Promise<void> {
    if (!task || status === task.status) {
      return;
    }
    setUpdatingStatus(status);
    try {
      await updateTaskStatus(task.id, status);
    } catch (error) {
      showMessage('Erro', error instanceof Error ? error.message : 'Não foi possível alterar o status.');
    } finally {
      setUpdatingStatus(null);
    }
  }

  function confirmDelete(): void {
    if (!task) {
      return;
    }
    const { id, title } = task;
    confirmAction({
      title: 'Excluir tarefa',
      message: `Tem certeza que deseja excluir "${title}"? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteTask(id);
          navigation.popToTop();
          showMessage('Tarefa excluída', 'A tarefa foi removida com sucesso.');
        } catch (error) {
          setIsDeleting(false);
          showMessage('Erro ao excluir', error instanceof Error ? error.message : 'Tente novamente.');
        }
      },
    });
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.overlay }]}>
            <Ionicons name={getCategoryIcon(task.categoryIcon)} size={28} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              {task.title}
            </Text>
            <Text style={[styles.muted, { color: colors.textMuted }]}>{getCategoryLabel(task.category)}</Text>
          </View>
        </View>

        <View style={styles.badges}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Descrição</Text>
        <Text style={[styles.description, { color: colors.text }]}>{task.description}</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.muted, { color: colors.textMuted }]}>Criada em {formatDate(task.createdAt)}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="create-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.muted, { color: colors.textMuted }]}>Atualizada em {formatDate(task.updatedAt)}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Alterar status</Text>
        <View style={styles.statusRow} accessibilityRole="radiogroup">
          {STATUS_OPTIONS.map((option) => {
            const isCurrent = option.value === task.status;
            const color = colors.status[option.value];
            return (
              <Pressable
                key={option.value}
                onPress={() => handleStatusChange(option.value)}
                disabled={updatingStatus !== null}
                accessibilityRole="radio"
                accessibilityLabel={`Marcar como ${option.label}`}
                accessibilityState={{ checked: isCurrent, busy: updatingStatus === option.value }}
                style={({ pressed }) => [
                  styles.statusOption,
                  { borderColor: isCurrent ? color : colors.border, backgroundColor: isCurrent ? colors.overlay : 'transparent' },
                  pressed && styles.pressed,
                ]}
              >
                {updatingStatus === option.value ? (
                  <ActivityIndicator size="small" color={color} />
                ) : (
                  <Text style={[styles.statusLabel, { color: isCurrent ? color : colors.text }]}>{option.label}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Editar tarefa"
          icon="create-outline"
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          disabled={isDeleting}
          accessibilityHint="Abre o formulário de edição"
        />
        <CustomButton
          title="Excluir tarefa"
          icon="trash-outline"
          variant="danger"
          onPress={confirmDelete}
          loading={isDeleting}
          accessibilityHint="Solicita confirmação antes de excluir"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  muted: {
    fontSize: 14,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  actions: {
    gap: 10,
  },
});
