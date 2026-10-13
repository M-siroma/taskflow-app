import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '../constants/taskOptions';
import { useTheme } from '../hooks/useTheme';

export interface SelectorOption<T extends string> {
  value: T;
  label: string;
  icon?: IoniconName;
  color?: string;
}

interface OptionSelectorProps<T extends string> {
  label: string;
  options: SelectorOption<T>[];
  selected: T | null;
  onSelect: (value: T) => void;
  error?: string;
  required?: boolean;
}

/** Grupo de opções exclusivas (como um radio group) usado nos formulários. */
export function OptionSelector<T extends string>({ label, options, selected, onSelect, error, required = false }: OptionSelectorProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>
      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          const accent = option.color ?? colors.primary;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={`${label}: ${option.label}`}
              accessibilityState={{ checked: isSelected }}
              style={({ pressed }) => [
                styles.option,
                {
                  borderColor: isSelected ? accent : colors.border,
                  backgroundColor: isSelected ? colors.overlay : colors.surface,
                },
                pressed && styles.pressed,
              ]}
            >
              {option.icon && <Ionicons name={option.icon} size={16} color={isSelected ? accent : colors.textMuted} />}
              <Text style={[styles.optionLabel, { color: isSelected ? accent : colors.text }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
  },
});
