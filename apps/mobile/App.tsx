import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FreelancerFlowProvider } from './src/context/FreelancerFlowContext';
import { RootNavigator } from './navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function MobileNavigation() {
  const { state } = useAuth();

  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0B0E" />
      <RootNavigator authState={state} />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FreelancerFlowProvider>
          <MobileNavigation />
        </FreelancerFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
