import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { EmptyState } from '../../components/EmptyState';
import { OptionSelector, SelectorOption } from '../../components/OptionSelector';
import { CATEGORIES, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants/taskOptions';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { TaskInput, TaskPriority, TaskStatus } from '../../types/task';
import {
  DESCRIPTION_MAX_LENGTH,
  hasErrors,
  TaskFormErrors,
  TITLE_MAX_LENGTH,
  validateTaskForm,
} from '../../utils/validation';
import { showMessage } from '../../utils/dialog';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskForm'>;

const EMPTY_FORM: TaskInput = {
  title: '',
  description: '',
  status: 'pendente',
  priority: 'media',
  category: '',
};

export function TaskFormScreen({ navigation, route }: Props) {
  const taskId = route.params?.taskId;
  const isEditing = taskId !== undefined;
  const { getTaskById, addTask, updateTask } = useTasks();
  const { colors } = useTheme();
  const existingTask = taskId ? getTaskById(taskId) : undefined;

  const [values, setValues] = useState<TaskInput>(() =>
    existingTask
      ? {
          title: existingTask.title,
          description: existingTask.description,
          status: existingTask.status,
          priority: existingTask.priority,
          category: existingTask.category,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Após a primeira tentativa de envio, a validação acompanha cada alteração.
  useEffect(() => {
    if (submitted) {
      setErrors(validateTaskForm(values));
    }
  }, [values, submitted]);

  function setField<K extends keyof TaskInput>(field: K, value: TaskInput[K]): void {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(): Promise<void> {
    setSubmitted(true);
    const validation = validateTaskForm(values);
    setErrors(validation);
    if (hasErrors(validation)) {
      showMessage('Formulário inválido', 'Corrija os campos destacados antes de salvar.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, values);
        showMessage('Tarefa atualizada', 'As alterações foram salvas com sucesso.');
      } else {
        await addTask(values);
        showMessage('Tarefa cadastrada', 'Sua nova tarefa foi salva com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      showMessage('Erro ao salvar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing && !existingTask) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <EmptyState icon="alert-circle-outline" title="Tarefa não encontrada" message="Ela pode ter sido excluída." />
      </View>
    );
  }

  const statusOptions: SelectorOption<TaskStatus>[] = STATUS_OPTIONS.map((option) => ({
    ...option,
    color: colors.status[option.value],
  }));
  const priorityOptions: SelectorOption<TaskPriority>[] = PRIORITY_OPTIONS.map((option) => ({
    ...option,
    icon: 'flag-outline',
    color: colors.priority[option.value],
  }));
  const categoryOptions: SelectorOption<string>[] = CATEGORIES.map((category) => ({
    value: category.value,
    label: category.label,
    icon: category.icon,
  }));

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <CustomInput
            label="Título"
            required
            placeholder="Ex.: Estudar React Native"
            value={values.title}
            onChangeText={(text) => setField('title', text)}
            error={errors.title}
            maxLength={TITLE_MAX_LENGTH}
            showCounter
          />
          <CustomInput
            label="Descrição"
            required
            placeholder="Descreva o que precisa ser feito"
            value={values.description}
            onChangeText={(text) => setField('description', text)}
            error={errors.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            showCounter
            multiline
          />
          <OptionSelector
            label="Status"
            options={statusOptions}
            selected={values.status}
            onSelect={(value) => setField('status', value)}
            error={errors.status}
          />
          <OptionSelector
            label="Prioridade"
            options={priorityOptions}
            selected={values.priority}
            onSelect={(value) => setField('priority', value)}
            error={errors.priority}
          />
          <OptionSelector
            label="Categoria"
            required
            options={categoryOptions}
            selected={values.category || null}
            onSelect={(value) => setField('category', value)}
            error={errors.category}
          />
          <Text style={[styles.required, { color: colors.textMuted }]}>* Campos obrigatórios</Text>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title={isEditing ? 'Salvar alterações' : 'Cadastrar tarefa'}
            icon="checkmark"
            onPress={handleSubmit}
            loading={isSaving}
            accessibilityHint="Valida e salva a tarefa"
          />
          <CustomButton
            title="Cancelar"
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={isSaving}
            accessibilityHint="Descarta as alterações e volta para a tela anterior"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  required: {
    fontSize: 12,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
