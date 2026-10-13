import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { hasErrors, LoginErrors, validateLogin } from '../../utils/validation';

export function LoginScreen() {
  const { login } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleLogin(): Promise<void> {
    setAuthError(null);
    const errors = validateLogin(username, password);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await login(username, password);
      // Em caso de sucesso, o AppRoutes troca automaticamente para o fluxo principal.
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível entrar.');
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            style={({ pressed }) => [styles.themeToggle, { backgroundColor: colors.surface }, pressed && styles.pressed]}
          >
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.text} />
          </Pressable>

          <View style={styles.brand}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logo}
              accessibilityRole="image"
              accessibilityLabel="Logotipo do TaskFlow"
            />
            <Text style={[styles.appName, { color: colors.text }]} accessibilityRole="header">
              TaskFlow
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Organize suas tarefas do dia a dia</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <CustomInput
              label="Usuário"
              placeholder="Digite seu usuário"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setAuthError(null);
              }}
              error={fieldErrors.username}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <View>
              <CustomInput
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setAuthError(null);
                }}
                error={fieldErrors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                style={styles.passwordInput}
              />
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                hitSlop={8}
                style={styles.eye}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textMuted} />
              </Pressable>
            </View>

            {authError && (
              <View
                style={[styles.errorBox, { borderColor: colors.danger }]}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{authError}</Text>
              </View>
            )}

            <CustomButton
              title="Entrar"
              icon="log-in-outline"
              onPress={handleLogin}
              loading={isSubmitting}
              accessibilityHint="Valida as credenciais e acessa o aplicativo"
            />
          </View>

          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Contas de teste: admin / 123 ou user / 123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
    marginBottom: 14,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eye: {
    position: 'absolute',
    right: 14,
    top: 38,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
  },
});
