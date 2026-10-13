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
import { mockGigs, GigOffer, filterGigsByProfession } from '@trampotaxa/shared';

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
  const [selectedGig, setSelectedGig] = useState<GigOffer | null>(mockGigs[0]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [appliedGigs, setAppliedGigs] = useState<string[]>([]);

  // Consumo reativo via TanStack React Query com cache de 5 minutos
  const {
    data: gigs = mockGigs,
    isLoading,
    isError,
    refetch,
  } = useQuery<GigOffer[]>({
    queryKey: ['mobile-gigs'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockGigs;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const filteredGigs = useMemo(() => {
    return filterGigsByProfession(gigs, selectedProfession);
  }, [gigs, selectedProfession]);

  const handleApply = (gigId: string) => {
    setAppliedGigs((prev) => (prev.includes(gigId) ? prev : [...prev, gigId]));
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00E676" />
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
            <Text style={styles.radarTitle}>Oportunidades em Curitiba</Text>
            <Text style={styles.radarSubtitle}>{filteredGigs.length} vagas encontradas no Batel e Centro</Text>
          </View>

          {filteredGigs.map((gig) => {
            const isSelected = selectedGig?.id === gig.id;
            const isApplied = appliedGigs.includes(gig.id);
            return (
              <TouchableOpacity
                key={gig.id}
                style={[styles.gigCard, isSelected && styles.gigCardSelected]}
                onPress={() => setSelectedGig(gig)}
              >
                <View style={styles.gigCardHeader}>
                  <View>
                    <View style={styles.tagContainer}>
                      <Text style={styles.professionTag}>{gig.profession}</Text>
                      <Text style={styles.distanceText}>{gig.distance}</Text>
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
                    style={[styles.actionButton, isApplied && styles.actionButtonSuccess]}
                    onPress={() => handleApply(gig.id)}
                  >
                    <Text style={[styles.actionButtonText, isApplied && styles.actionButtonTextSuccess]}>
                      {isApplied ? 'Inscrito ✓' : 'Candidatar'}
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
            <View>
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
            <TouchableOpacity
              style={[
                styles.floatingApplyButton,
                appliedGigs.includes(selectedGig.id) && styles.actionButtonSuccess,
              ]}
              onPress={() => handleApply(selectedGig.id)}
            >
              <Text
                style={[
                  styles.floatingApplyText,
                  appliedGigs.includes(selectedGig.id) && styles.actionButtonTextSuccess,
                ]}
              >
                {appliedGigs.includes(selectedGig.id) ? 'Candidatura Enviada ✓' : 'Aceitar Turno'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    padding: 24,
  },
  loadingText: {
    color: '#00E676',
    marginTop: 14,
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorSubtitle: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 6,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#00E676',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#0A0B0E',
    fontWeight: 'bold',
    fontSize: 13,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F1117',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#00E676',
  },
  filterChipText: {
    color: '#8E95A5',
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#0A0B0E',
  },
  toggleViewButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  toggleViewText: {
    color: '#00E676',
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
    backgroundColor: '#12141C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  customMarkerSelected: {
    backgroundColor: '#00E676',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  markerRateText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '900',
  },
  markerRateTextSelected: {
    color: '#0A0B0E',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#0A0B0E',
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
    backgroundColor: '#141722',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gigCardSelected: {
    borderColor: '#00E676',
    backgroundColor: '#181D2A',
  },
  gigCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  professionTag: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  distanceText: {
    color: '#8E95A5',
    fontSize: 11,
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  neighborhoodText: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rateFormatted: {
    color: '#00E676',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  shiftTimeText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
  },
  actionButtonSuccess: {
    backgroundColor: '#00E676',
    borderColor: '#00E676',
  },
  actionButtonText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtonTextSuccess: {
    color: '#0A0B0E',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#141722',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
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
  },
  floatingVenue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  floatingNeighborhood: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
  },
  floatingRate: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: '900',
  },
  floatingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingApplyButton: {
    backgroundColor: '#00E676',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  floatingApplyText: {
    color: '#0A0B0E',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
