import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/EmptyState';
import { FilterBar } from '../../components/FilterBar';
import { TaskCard } from '../../components/TaskCard';
import { CustomButton } from '../../components/CustomButton';
import { FILTER_OPTIONS, STATUS_LABELS } from '../../constants/taskOptions';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { Task, TaskFilter } from '../../types/task';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskList'>;

export function TaskListScreen({ navigation }: Props) {
  const { tasks, isLoading, loadError, reloadTasks } = useTasks();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const filteredTasks = useMemo<Task[]>(
    () => (filter === 'todas' ? tasks : tasks.filter((task) => task.status === filter)),
    [tasks, filter],
  );

  const counts = useMemo<Record<TaskFilter, number>>(
    () => ({
      todas: tasks.length,
      pendente: tasks.filter((task) => task.status === 'pendente').length,
      em_andamento: tasks.filter((task) => task.status === 'em_andamento').length,
      concluida: tasks.filter((task) => task.status === 'concluida').length,
    }),
    [tasks],
  );

  async function handleRefresh(): Promise<void> {
    setIsRefreshing(true);
    await reloadTasks();
    setIsRefreshing(false);
  }

  function openForm(): void {
    navigation.navigate('TaskForm', {});
  }

  function openDetail(task: Task): void {
    navigation.navigate('TaskDetail', { taskId: task.id });
  }

  function renderEmpty() {
    if (loadError) {
      return (
        <View style={styles.center}>
          <EmptyState icon="warning-outline" title="Algo deu errado" message={loadError} />
          <CustomButton title="Tentar novamente" icon="refresh" variant="outline" onPress={reloadTasks} />
        </View>
      );
    }
    if (filter !== 'todas') {
      return (
        <EmptyState
          icon="funnel-outline"
          title="Nenhuma tarefa encontrada"
          message={`Você não tem tarefas com status "${STATUS_LABELS[filter]}".`}
        />
      );
    }
    return (
      <EmptyState
        title="Nenhuma tarefa por aqui"
        message="Cadastre sua primeira tarefa para começar a se organizar."
        actionLabel="Cadastrar tarefa"
        onAction={openForm}
      />
    );
  }

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted }}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <FilterBar options={FILTER_OPTIONS} selected={filter} onChange={setFilter} counts={counts} />
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <TaskCard task={item} index={index} onPress={openDetail} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      <Pressable
        onPress={openForm}
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        accessibilityHint="Abre o formulário de cadastro de tarefa"
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, shadowColor: colors.shadow }, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={30} color={colors.primaryText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
