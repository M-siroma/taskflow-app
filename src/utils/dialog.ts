import { Alert, Platform } from 'react-native';

// No react-native-web o Alert.alert não exibe nada, então na web usamos os diálogos do navegador.

export function showMessage(title: string, message: string): void {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

/** Pede confirmação ao usuário e executa onConfirm somente se ele aceitar. */
export function confirmAction({ title, message, confirmText, destructive = false, onConfirm }: ConfirmOptions): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: () => onConfirm() },
  ]);
}
