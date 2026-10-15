import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@trampotaxa/shared';

interface EarningItem {
  id: string;
  venueName: string;
  role: string;
  date: string;
  amount: number;
  status: 'Concluído' | 'Em Processamento';
  pixKey: string;
}

interface EarningsData {
  today: number;
  week: number;
  month: number;
  completedCount: number;
  history: EarningItem[];
}

export const EarningsScreen: React.FC = () => {
  // Consumo assíncrono via TanStack React Query com cache de 5 minutos
  const {
    data: earnings,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<EarningsData>({
    queryKey: ['mobile-earnings'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        today: 250,
        week: 1120,
        month: 3840,
        completedCount: 14,
        history: [
          {
            id: '1',
            venueName: 'Boteco São Jorge',
            role: 'Bartender',
            date: 'Hoje, 02:30',
            amount: 250,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: '2',
            venueName: 'Taj Bar Curitiba',
            role: 'Bartender',
            date: 'Ontem, 03:00',
            amount: 260,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: '3',
            venueName: 'Quintal do Monge',
            role: 'Garçom',
            date: '11 Out, 00:30',
            amount: 195,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: '4',
            venueName: 'Bistrô do Batel',
            role: 'Garçom',
            date: '09 Out, 23:45',
            amount: 180,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: '5',
            venueName: 'Bar do Alemão',
            role: 'Bartender',
            date: '07 Out, 02:00',
            amount: 230,
            status: 'Concluído',
            pixKey: '41999990000',
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Extrato de Ganhos</Text>
      <Text style={styles.subtitle}>Repasses automáticos via PIX pós-turno</Text>

      {/* Cards de Resumo Financeiro */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Hoje</Text>
          <Text style={styles.kpiValueHighlight}>
            {formatCurrency(earnings?.today ?? 250)}
          </Text>
          <Text style={styles.kpiSub}>1 turno</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Esta Semana</Text>
          <Text style={styles.kpiValue}>
            {formatCurrency(earnings?.week ?? 1120)}
          </Text>
          <Text style={styles.kpiSub}>4 turnos</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Este Mês</Text>
          <Text style={styles.kpiValue}>
            {formatCurrency(earnings?.month ?? 3840)}
          </Text>
          <Text style={styles.kpiSub}>14 turnos</Text>
        </View>
      </View>

      {/* Faixa de Informação do PIX */}
      <View style={styles.pixInfoBanner}>
        <View style={styles.pixIndicator} />
        <View style={styles.pixTextContainer}>
          <Text style={styles.pixTitle}>Chave PIX Cadastrada</Text>
          <Text style={styles.pixKey}>gabriel.silva@curitiba.com • Banco Inter</Text>
        </View>
        <TouchableOpacity style={styles.pixChangeButton}>
          <Text style={styles.pixChangeText}>Alterar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Histórico de Fechamentos</Text>
    </View>
  );

  const renderItem = ({ item }: { item: EarningItem }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyLeft}>
        <View style={styles.venueBadge}>
          <Text style={styles.venueInitial}>{item.venueName.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.historyVenue}>{item.venueName}</Text>
          <Text style={styles.historyMeta}>
            {item.role} • {item.date}
          </Text>
        </View>
      </View>

      <View style={styles.historyRight}>
        <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00E676" />
        <Text style={styles.loadingText}>Carregando demonstrativo financeiro...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={earnings?.history || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#00E676"
            colors={['#00E676']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0B0E',
  },
  loadingText: {
    color: '#00E676',
    marginTop: 12,
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#8E95A5',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#141722',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  kpiLabel: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: '700',
  },
  kpiValueHighlight: {
    color: '#00E676',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  kpiValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  kpiSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  pixInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  pixIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 10,
  },
  pixTextContainer: {
    flex: 1,
  },
  pixTitle: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pixKey: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  pixChangeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pixChangeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141722',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueInitial: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
  },
  historyVenue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyMeta: {
    color: '#8E95A5',
    fontSize: 11,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    color: '#00E676',
    fontSize: 15,
    fontWeight: '900',
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '700',
  },
});
