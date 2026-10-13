import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from './src/screens/MapScreen';
import { EarningsScreen } from './src/screens/EarningsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// 1. Configuração do React Query seguindo exatamente as diretrizes do ecossistema web
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de cache fresco
      retry: 1, // 1 tentativa automática em caso de oscilação
      refetchOnWindowFocus: false,
    },
  },
});

const Tab = createBottomTabNavigator();

// Tema escuro nativo para o React Navigation
const DarkNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0A0B0E',
    card: '#0F1117',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.08)',
    primary: '#00E676',
  },
};

// Componente simples e resiliente de ícone de aba sem dependências pesadas
function TabIcon({ name, focused }: { name: 'map' | 'earnings' | 'profile'; focused: boolean }) {
  const getSymbol = () => {
    switch (name) {
      case 'map':
        return '⌖';
      case 'earnings':
        return '$';
      case 'profile':
        return '👤';
      default:
        return '•';
    }
  };

  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
        {getSymbol()}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={DarkNavTheme}>
        <StatusBar style="light" backgroundColor="#0A0B0E" />
        <Tab.Navigator
          id="mobile-tabs"
          initialRouteName="Mapa"
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#00E676',
            tabBarInactiveTintColor: '#8E95A5',
            tabBarLabelStyle: styles.tabLabel,
            headerStyle: styles.header,
            headerTintColor: '#FFFFFF',
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: 'center',
          }}
        >
          <Tab.Screen
            name="Mapa"
            component={MapScreen}
            options={{
              title: 'Radar de Taxas',
              tabBarLabel: 'Radar',
              tabBarIcon: ({ focused }) => <TabIcon name="map" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Relatorios"
            component={EarningsScreen}
            options={{
              title: 'Extrato de Ganhos',
              tabBarLabel: 'Ganhos',
              tabBarIcon: ({ focused }) => <TabIcon name="earnings" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Perfil"
            component={ProfileScreen}
            options={{
              title: 'Meu Perfil',
              tabBarLabel: 'Perfil',
              tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F1117',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabIconWrapperFocused: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  tabIconText: {
    fontSize: 16,
    color: '#8E95A5',
    fontWeight: '900',
  },
  tabIconTextFocused: {
    color: '#00E676',
  },
  header: {
    backgroundColor: '#0F1117',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
