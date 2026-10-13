import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName, PRIORITY_LABELS, STATUS_LABELS } from '../constants/taskOptions';
import { useTheme } from '../hooks/useTheme';
import { TaskPriority, TaskStatus } from '../types/task';

interface BadgeProps {
  label: string;
  color: string;
  icon: IoniconName;
  accessibilityLabel: string;
}

function Badge({ label, color, icon, accessibilityLabel }: BadgeProps) {
  return (
    <View
      style={[styles.badge, { borderColor: color }]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const STATUS_ICONS: Record<TaskStatus, IoniconName> = {
  pendente: 'time-outline',
  em_andamento: 'play-circle-outline',
  concluida: 'checkmark-circle-outline',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { colors } = useTheme();
  return (
    <Badge
      label={STATUS_LABELS[status]}
      color={colors.status[status]}
      icon={STATUS_ICONS[status]}
      accessibilityLabel={`Status: ${STATUS_LABELS[status]}`}
    />
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { colors } = useTheme();
  return (
    <Badge
      label={PRIORITY_LABELS[priority]}
      color={colors.priority[priority]}
      icon="flag-outline"
      accessibilityLabel={`Prioridade: ${PRIORITY_LABELS[priority]}`}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
