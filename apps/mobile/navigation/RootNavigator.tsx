import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { EarningsScreen } from '../src/screens/EarningsScreen';
import { MapScreen } from '../src/screens/MapScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import type { AuthState } from '../src/context/session';
import { getRootNavigationState } from './authNavigation';
import type { MobileTabParamList } from './types';

const Tab = createBottomTabNavigator<MobileTabParamList>();

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

function TabIcon({ name, focused }: { name: 'map' | 'earnings' | 'profile'; focused: boolean }) {
  const symbol = name === 'map' ? '⌖' : name === 'earnings' ? '$' : '👤';
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>{symbol}</Text>
    </View>
  );
}

function SessionGate({ restoring }: { restoring: boolean }) {
  return (
    <View style={styles.gate}>
      {restoring && <ActivityIndicator color="#00E676" />}
      <Text style={styles.gateText}>
        {restoring
          ? 'Restaurando sessão segura...'
          : 'Faça login para acessar as funcionalidades do aplicativo.'}
      </Text>
    </View>
  );
}

export function RootNavigator({ authState }: { authState: AuthState }) {
  const navigationState = getRootNavigationState(authState);

  return (
    <NavigationContainer theme={DarkNavTheme}>
      {navigationState === 'authenticated' ? (
        <Tab.Navigator
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
      ) : (
        <SessionGate restoring={navigationState === 'restoring'} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: '#0A0B0E',
  },
  gateText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
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
