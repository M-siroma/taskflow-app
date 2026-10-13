import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryIcon, getCategoryLabel, STATUS_LABELS } from '../constants/taskOptions';
import { useTheme } from '../hooks/useTheme';
import { Task } from '../types/task';
import { formatDate } from '../utils/formatDate';
import { PriorityBadge, StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  index: number;
  onPress: (task: Task) => void;
}

export function TaskCard({ task, index, onPress }: TaskCardProps) {
  const { colors } = useTheme();
  const appear = useRef(new Animated.Value(0)).current;

  // Entrada suave: cada cartão aparece com um pequeno atraso em relação ao anterior.
  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 300,
      delay: Math.min(index, 8) * 50,
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  const categoryLabel = getCategoryLabel(task.category);
  const isDone = task.status === 'concluida';

  return (
    <Animated.View
      style={{
        opacity: appear,
        transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
      }}
    >
      <Pressable
        onPress={() => onPress(task)}
        accessibilityRole="button"
        accessibilityLabel={`Tarefa ${task.title}, ${STATUS_LABELS[task.status]}, categoria ${categoryLabel}`}
        accessibilityHint="Abre os detalhes da tarefa"
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: colors.status[task.status] },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.overlay }]}>
            <Ionicons name={getCategoryIcon(task.categoryIcon)} size={22} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text
              style={[styles.title, { color: colors.text }, isDone && styles.done]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <Text style={[styles.category, { color: colors.textMuted }]}>{categoryLabel}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        <View style={styles.badges}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </View>

        <View style={styles.dates}>
          <Text style={[styles.date, { color: colors.textMuted }]}>Criada: {formatDate(task.createdAt)}</Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>Atualizada: {formatDate(task.updatedAt)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  done: {
    textDecorationLine: 'line-through',
  },
  category: {
    fontSize: 13,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  date: {
    fontSize: 12,
  },
});
