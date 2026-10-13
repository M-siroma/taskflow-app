import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Option } from '../constants/taskOptions';
import { useTheme } from '../hooks/useTheme';

interface FilterBarProps<T extends string> {
  options: Option<T>[];
  selected: T;
  onChange: (value: T) => void;
  counts?: Partial<Record<T, number>>;
}

export function FilterBar<T extends string>({ options, selected, onChange, counts }: FilterBarProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityRole="tablist"
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        const count = counts?.[option.value];
        const label = count !== undefined ? `${option.label} (${count})` : option.label;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={`Filtrar: ${label}`}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, { color: isSelected ? colors.primaryText : colors.text }]}>{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
