import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { useQuote } from '../../hooks/useQuote';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TabParamList } from '../../types/navigation';
import { TaskStatus } from '../../types/task';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

interface SummaryItem {
  key: 'total' | TaskStatus;
  label: string;
  value: number;
  color: string;
}

export function HomeScreen({ navigation }: Props) {
  const { user, treatment } = useAuth();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { colors } = useTheme();
  const { quote, isLoading: quoteLoading, error: quoteError, refresh } = useQuote();
  const quoteOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (quote && !quoteLoading) {
      quoteOpacity.setValue(0);
      Animated.timing(quoteOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [quote, quoteLoading, quoteOpacity]);

  const summary = useMemo<SummaryItem[]>(() => {
    const count = (status: TaskStatus): number => tasks.filter((task) => task.status === status).length;
    return [
      { key: 'total', label: 'Total', value: tasks.length, color: colors.primary },
      { key: 'pendente', label: 'Pendentes', value: count('pendente'), color: colors.status.pendente },
      { key: 'em_andamento', label: 'Em andamento', value: count('em_andamento'), color: colors.status.em_andamento },
      { key: 'concluida', label: 'Concluídas', value: count('concluida'), color: colors.status.concluida },
    ];
  }, [tasks, colors]);

  const greetingName = user ? (treatment ? `${treatment} ${user.name}` : user.name) : '';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  function renderQuote() {
    if (quoteLoading) {
      return (
        <View style={styles.quoteState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.muted, { color: colors.textMuted }]}>Buscando inspiração...</Text>
        </View>
      );
    }
    if (quoteError || !quote) {
      return (
        <View style={styles.quoteState}>
          <Ionicons name="cloud-offline-outline" size={28} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]} accessibilityRole="alert">
            {quoteError ?? 'Nenhuma frase disponível.'}
          </Text>
          <CustomButton
            title="Tentar novamente"
            icon="refresh"
            variant="outline"
            onPress={refresh}
            accessibilityHint="Faz uma nova tentativa de carregar a frase"
          />
        </View>
      );
    }
    return (
      <Animated.View style={{ opacity: quoteOpacity }}>
        <Text style={[styles.quoteText, { color: colors.text }]}>“{quote.quote}”</Text>
        <Text style={[styles.quoteAuthor, { color: colors.textMuted }]}>— {quote.author}</Text>
      </Animated.View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.greeting, { color: colors.text }]} accessibilityRole="header">
        {greeting}, {greetingName}!
      </Text>
      <Text style={[styles.muted, { color: colors.textMuted }]}>Veja um resumo das suas tarefas.</Text>

      <View style={styles.summaryGrid}>
        {summary.map((item) => (
          <View
            key={item.key}
            style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            accessible
            accessibilityLabel={`${item.label}: ${item.value}`}
          >
            {tasksLoading ? (
              <ActivityIndicator color={item.color} />
            ) : (
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
            )}
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.quoteHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frase do dia</Text>
          {!quoteLoading && !quoteError && (
            <Pressable
              onPress={refresh}
              accessibilityRole="button"
              accessibilityLabel="Carregar outra frase"
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Ionicons name="refresh" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>
        {renderQuote()}
        <Text style={[styles.source, { color: colors.textMuted }]}>Fonte: DummyJSON</Text>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Ver minhas tarefas"
          icon="list-outline"
          onPress={() => navigation.navigate('Tasks', { screen: 'TaskList' })}
          accessibilityHint="Abre a lista de tarefas"
        />
        <CustomButton
          title="Nova tarefa"
          icon="add-circle-outline"
          variant="outline"
          onPress={() => navigation.navigate('Tasks', { screen: 'TaskForm', params: {}, initial: false })}
          accessibilityHint="Abre o formulário de cadastro de tarefa"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
  },
  muted: {
    fontSize: 14,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 80,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 10,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  quoteState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 23,
  },
  quoteAuthor: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  source: {
    fontSize: 11,
  },
  pressed: {
    opacity: 0.6,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
});
