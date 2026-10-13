import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  showCounter?: boolean;
}

export function CustomInput({ label, error, required = false, showCounter = false, style, onFocus, onBlur, ...rest }: CustomInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;
  const length = typeof rest.value === 'string' ? rest.value.length : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        accessibilityLabel={required ? `${label}, obrigatório` : label}
        accessibilityHint={error}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          { backgroundColor: colors.inputBackground, color: colors.text, borderColor },
          rest.multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      <View style={styles.footer}>
        {error ? (
          <Text style={[styles.error, { color: colors.danger }]} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : (
          <View />
        )}
        {showCounter && rest.maxLength !== undefined && (
          <Text style={[styles.counter, { color: colors.textMuted }]}>
            {length}/{rest.maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    minHeight: 18,
  },
  error: {
    fontSize: 13,
    flex: 1,
  },
  counter: {
    fontSize: 12,
    marginLeft: 8,
  },
});
