import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';
import { TaskFormScreen } from '../screens/tasks/TaskFormScreen';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { TaskStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export function TaskStackRoutes() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false, title: 'Tarefas' }} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={({ route }) => ({ title: route.params?.taskId ? 'Editar tarefa' : 'Nova tarefa' })} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalhes da tarefa' }} />
    </Stack.Navigator>
  );
}
