import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { IoniconName } from '../constants/taskOptions';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { TabParamList } from '../types/navigation';
import { TaskStackRoutes } from './TaskStackRoutes';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG: Record<keyof TabParamList, { title: string; icon: IoniconName; activeIcon: IoniconName }> = {
  Home: { title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  Tasks: { title: 'Tarefas', icon: 'checkbox-outline', activeIcon: 'checkbox' },
  Settings: { title: 'Configurações', icon: 'settings-outline', activeIcon: 'settings' },
};

export function TabRoutes() {
  const { user } = useAuth();
  const { colors } = useTheme();

  // Após o login, o administrador começa em Configurações e o usuário comum na Home.
  const initialRouteName: keyof TabParamList = user?.role === 'admin' ? 'Settings' : 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name];
        return {
          title: config.title,
          header: () => <Header title={config.title} />,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarAccessibilityLabel: `Aba ${config.title}`,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? config.activeIcon : config.icon} size={size} color={color} />
          ),
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskStackRoutes} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
