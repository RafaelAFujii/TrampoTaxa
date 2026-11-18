import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { filterGigsByProfession } from '@trampotaxa/shared';
import type { GigOffer } from '@trampotaxa/shared';
import { useFreelancerGigFlow } from '../hooks/useFreelancerGigFlow';

// Import resiliente de react-native-maps para suportar Expo Go, Web e simuladores
let MapView: any = null;
let Marker: any = null;

try {
  const Maps = require('react-native-maps');
  MapView = Maps.default || Maps;
  Marker = Maps.Marker;
} catch (e) {
  // Graceful fallback se módulo nativo de mapas não estiver disponível
  MapView = null;
  Marker = null;
}

const { width } = Dimensions.get('window');

// Coordenadas centrais de Curitiba (Batel / Centro)
const CURITIBA_REGION = {
  latitude: -25.4385,
  longitude: -49.282,
  latitudeDelta: 0.065,
  longitudeDelta: 0.065,
};

export const MapScreen: React.FC = () => {
  const [selectedProfession, setSelectedProfession] = useState<string>('Todos');
  const [selectedGig, setSelectedGig] = useState<GigOffer | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const {
    applyToGig,
    gigs: flowGigs,
    activeApplicationsCount,
    maxApplicationsReached,
    activeShift,
  } = useFreelancerGigFlow();

  // Consumo reativo via TanStack React Query com cache de 5 minutos
  const {
    data: gigs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<GigOffer[]>({
    queryKey: ['mobile-gigs'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (__DEV__) {
        const { mockGigs } = await import('@trampotaxa/shared/mocks');
        return mockGigs;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const filteredGigs = useMemo(() => {
    return filterGigsByProfession(gigs, selectedProfession);
  }, [gigs, selectedProfession]);

  const getGigStatus = (gig: GigOffer) => {
    const flowGig = flowGigs.find((g) => g.venueName.toLowerCase() === gig.venueName.toLowerCase() || g.id === gig.id);
    return flowGig?.status ?? 'disponivel';
  };

  const handleApply = (gig: GigOffer) => {
    // Busca id do flow ou cria mapeamento
    const flowGig = flowGigs.find((g) => g.venueName.toLowerCase() === gig.venueName.toLowerCase() || g.id === gig.id);
    const targetId = flowGig?.id ?? flowGigs[0]?.id;
    if (targetId) {
      applyToGig(targetId);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5FA780" />
        <Text style={styles.loadingText}>Sincronizando radar de taxas...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Falha ao conectar com o Radar</Text>
        <Text style={styles.errorSubtitle}>Verifique sua conexão móvel</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de Filtro de Profissão Superior */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['Todos', 'Bartender', 'Garçom'].map((prof) => {
            const isSelected = selectedProfession === prof;
            return (
              <TouchableOpacity
                key={prof}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedProfession(prof)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {prof}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.toggleViewButton}
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          <Text style={styles.toggleViewText}>
            {viewMode === 'map' ? 'Ver Lista' : 'Ver Mapa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderização do Mapa ou Fallback de Lista */}
      {viewMode === 'map' && MapView ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={CURITIBA_REGION}
            showsUserLocation={true}
            showsCompass={true}
          >
            {filteredGigs.map((gig) => {
              const isSelected = selectedGig?.id === gig.id;
              return (
                <Marker
                  key={gig.id}
                  coordinate={{
                    latitude: gig.latLng.lat,
                    longitude: gig.latLng.lng,
                  }}
                  title={gig.venueName}
                  description={`${gig.profession} • ${gig.rateFormatted}`}
                  onPress={() => setSelectedGig(gig)}
                >
                  <View style={[styles.customMarker, isSelected && styles.customMarkerSelected]}>
                    <Text style={[styles.markerRateText, isSelected && styles.markerRateTextSelected]}>
                      {gig.rateFormatted}
                    </Text>
                  </View>
                </Marker>
              );
            })}
          </MapView>
        </View>
      ) : (
        /* Fallback elegante com Lista de Taxas e Radar de Oportunidades */
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listScrollContent}>
          <View style={styles.radarHeader}>
            <View style={styles.overbookingRow}>
              <View style={styles.overbookingPill}>
                <View style={[styles.overbookingDot, activeApplicationsCount > 0 && styles.overbookingDotActive]} />
                <Text style={styles.overbookingPillText}>
                  OVERBOOKING: {activeApplicationsCount}/3 CANDIDATURAS ATIVAS
                </Text>
              </View>
              {activeShift && (
                <View style={styles.activeShiftPill}>
                  <Text style={styles.activeShiftPillText}>TURNO ATIVO ⚡</Text>
                </View>
              )}
            </View>

            <Text style={styles.radarTitle}>Oportunidades em Curitiba</Text>
            <Text style={styles.radarSubtitle}>
              {maxApplicationsReached
                ? 'Limite de 3 vagas atingido. Aguardando aceite de um contratante...'
                : `${filteredGigs.length} vagas encontradas no Batel e Centro`}
            </Text>
          </View>

          {filteredGigs.map((gig) => {
            const isSelected = selectedGig?.id === gig.id;
            const status = getGigStatus(gig);
            const isApplied = status === 'candidatado';
            const isConfirmed = status === 'confirmado';
            const isCancelled = status === 'cancelado';

            return (
              <TouchableOpacity
                key={gig.id}
                style={[
                  styles.gigCard,
                  isSelected && styles.gigCardSelected,
                  isConfirmed && styles.gigCardConfirmed,
                ]}
                onPress={() => setSelectedGig(gig)}
              >
                <View style={styles.gigCardHeader}>
                  <View style={styles.gigDetails}>
                    <View style={styles.tagContainer}>
                      <Text style={styles.professionTag}>{gig.profession}</Text>
                      <Text style={styles.distanceText}>{gig.distance}</Text>
                      {isConfirmed && (
                        <View style={styles.hiredBadge}>
                          <Text style={styles.hiredBadgeText}>CONTRATADO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.venueName}>{gig.venueName}</Text>
                    <Text style={styles.neighborhoodText}>{gig.neighborhood}, Curitiba</Text>
                  </View>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateFormatted}>{gig.rateFormatted}</Text>
                    <Text style={styles.shiftDuration}>{gig.shiftDuration}</Text>
                  </View>
                </View>

                <View style={styles.gigCardFooter}>
                  <Text style={styles.shiftTimeText}>Horário: {gig.shiftTime}</Text>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isApplied && styles.actionButtonApplied,
                      isConfirmed && styles.actionButtonSuccess,
                      isCancelled && styles.actionButtonCancelled,
                    ]}
                    disabled={isApplied || isConfirmed}
                    onPress={() => handleApply(gig)}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        (isApplied || isConfirmed) && styles.actionButtonTextSuccess,
                      ]}
                    >
                      {isConfirmed
                        ? 'Contratado! ✓'
                        : isApplied
                        ? 'Candidatado (Aguardando...)'
                        : isCancelled
                        ? 'Cancelado'
                        : 'Candidatar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Cartão Inferior Flutuante quando no modo Mapa */}
      {viewMode === 'map' && selectedGig && (
        <View style={styles.floatingCard}>
          <View style={styles.floatingHeader}>
            <View style={styles.floatingDetails}>
              <Text style={styles.professionTag}>{selectedGig.profession}</Text>
              <Text style={styles.floatingVenue}>{selectedGig.venueName}</Text>
              <Text style={styles.floatingNeighborhood}>{selectedGig.neighborhood} • {selectedGig.distance}</Text>
            </View>
            <View style={styles.rateContainer}>
              <Text style={styles.floatingRate}>{selectedGig.rateFormatted}</Text>
              <Text style={styles.shiftDuration}>{selectedGig.shiftDuration}</Text>
            </View>
          </View>

          <View style={styles.floatingFooter}>
            <Text style={styles.shiftTimeText}>{selectedGig.shiftTime}</Text>
            {(() => {
              const status = getGigStatus(selectedGig);
              const isApplied = status === 'candidatado';
              const isConfirmed = status === 'confirmado';
              return (
                <TouchableOpacity
                  style={[
                    styles.floatingApplyButton,
                    isApplied && styles.actionButtonApplied,
                    isConfirmed && styles.actionButtonSuccess,
                  ]}
                  disabled={isApplied || isConfirmed}
                  onPress={() => handleApply(selectedGig)}
                >
                  <Text
                    style={[
                      styles.floatingApplyText,
                      (isApplied || isConfirmed) && styles.actionButtonTextSuccess,
                    ]}
                  >
                    {isConfirmed
                      ? 'Contratado! ✓'
                      : isApplied
                      ? 'Candidatura Enviada ✓'
                      : 'Aceitar Turno'}
                  </Text>
                </TouchableOpacity>
              );
            })()}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171B1A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171B1A',
    padding: 24,
  },
  loadingText: {
    color: '#5FA780',
    marginTop: 14,
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 280,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: 280,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorSubtitle: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 6,
    maxWidth: 280,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 16,
    minHeight: 44,
    backgroundColor: '#5FA780',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#171B1A',
    fontWeight: 'bold',
    fontSize: 13,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#202421',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 6,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#5FA780',
  },
  filterChipText: {
    color: '#8E95A5',
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#171B1A',
  },
  toggleViewButton: {
    marginLeft: 'auto',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(95,167,128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(95,167,128, 0.3)',
    justifyContent: 'center',
  },
  toggleViewText: {
    color: '#5FA780',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: '#202421',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#5FA780',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  customMarkerSelected: {
    backgroundColor: '#5FA780',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  markerRateText: {
    color: '#5FA780',
    fontSize: 12,
    fontWeight: '900',
  },
  markerRateTextSelected: {
    color: '#171B1A',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#171B1A',
  },
  listScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  radarHeader: {
    marginBottom: 14,
  },
  radarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radarSubtitle: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
  },
  gigCard: {
    backgroundColor: '#202421',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gigCardSelected: {
    borderColor: '#5FA780',
    backgroundColor: '#292E2A',
  },
  gigCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  gigDetails: {
    flex: 1,
    minWidth: 0,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  professionTag: {
    color: '#5FA780',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  distanceText: {
    color: '#8E95A5',
    fontSize: 11,
  },
  venueName: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  neighborhoodText: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
    flexShrink: 1,
  },
  rateContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  rateFormatted: {
    color: '#5FA780',
    fontSize: 17,
    fontWeight: '900',
  },
  shiftDuration: {
    color: '#8E95A5',
    fontSize: 10,
    marginTop: 2,
  },
  gigCardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  shiftTimeText: {
    color: '#CBD5E1',
    fontSize: 12,
    flexShrink: 1,
  },
  actionButton: {
    backgroundColor: 'rgba(95,167,128, 0.15)',
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(95,167,128, 0.4)',
    justifyContent: 'center',
    flexShrink: 1,
    maxWidth: '100%',
  },
  actionButtonSuccess: {
    backgroundColor: '#5FA780',
    borderColor: '#5FA780',
  },
  actionButtonText: {
    color: '#5FA780',
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  actionButtonTextSuccess: {
    color: '#171B1A',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#202421',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(95,167,128, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  floatingDetails: {
    flex: 1,
    minWidth: 0,
  },
  floatingVenue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
    flexShrink: 1,
  },
  floatingNeighborhood: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
    flexShrink: 1,
  },
  floatingRate: {
    color: '#5FA780',
    fontSize: 18,
    fontWeight: '900',
  },
  floatingFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingApplyButton: {
    backgroundColor: '#5FA780',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    flexShrink: 1,
    maxWidth: '100%',
  },
  floatingApplyText: {
    color: '#171B1A',
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  overbookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  overbookingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(95,167,128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(95,167,128, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  overbookingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
  overbookingDotActive: {
    backgroundColor: '#5FA780',
  },
  overbookingPillText: {
    color: '#5FA780',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  activeShiftPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeShiftPillText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '900',
  },
  gigCardConfirmed: {
    borderColor: '#5FA780',
    backgroundColor: 'rgba(95,167,128, 0.05)',
  },
  hiredBadge: {
    backgroundColor: '#5FA780',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  hiredBadgeText: {
    color: '#171B1A',
    fontSize: 9,
    fontWeight: '900',
  },
  actionButtonApplied: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  actionButtonCancelled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
