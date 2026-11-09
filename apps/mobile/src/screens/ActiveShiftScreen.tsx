import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFreelancerGigFlow } from '../hooks/useFreelancerGigFlow';
import { MasterQrScannerModal } from '../components/flow/MasterQrScannerModal';
import { VenueReviewModal } from '../components/flow/VenueReviewModal';
import { HighDopamineEarningsScreen } from './HighDopamineEarningsScreen';

interface ActiveShiftScreenProps {
  onBackToRadar?: () => void;
}

export const ActiveShiftScreen: React.FC<ActiveShiftScreenProps> = ({ onBackToRadar }) => {
  const {
    activeShift,
    performCheckIn,
    requestCheckOut,
    submitVenueReview,
  } = useFreelancerGigFlow();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showEarningsReport, setShowEarningsReport] = useState(false);

  if (!activeShift) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📍</Text>
        <Text style={styles.emptyTitle}>Nenhum Turno Ativo no Momento</Text>
        <Text style={styles.emptySubtitle}>
          Candidate-se a vagas no Radar de Taxas. Você pode se candidatar a até 3 vagas simultâneas.
        </Text>
        {onBackToRadar && (
          <TouchableOpacity style={styles.backButton} onPress={onBackToRadar}>
            <Text style={styles.backButtonText}>Ir para o Radar de Taxas</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Se já foi avaliado e está no extrato final de dopamina
  if (showEarningsReport) {
    return (
      <HighDopamineEarningsScreen
        onBackToRadar={() => {
          setShowEarningsReport(false);
          if (onBackToRadar) onBackToRadar();
        }}
      />
    );
  }

  const handleScanSuccess = (payload: string) => {
    performCheckIn(payload);
  };

  const handleReviewCompleted = (rating: number, tags: string[]) => {
    submitVenueReview({
      gigId: activeShift.gigId,
      rating,
      tags,
    });
    setIsReviewOpen(false);
    setShowEarningsReport(true);
  };

  const isCheckInPending = activeShift.status === 'aguardando_checkin';
  const isInShift = activeShift.status === 'em_turno';
  const isAwaitingAutoCheckout = activeShift.status === 'checkout_pendente_aprovacao';
  const isPixScheduled = activeShift.status === 'pix_agendado';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Header Badge */}
        <View style={styles.statusHeader}>
          <View style={styles.pulseIndicatorWrapper}>
            <View
              style={[
                styles.pulseIndicator,
                isPixScheduled && styles.pulseIndicatorPix,
                isAwaitingAutoCheckout && styles.pulseIndicatorWarning,
              ]}
            />
          </View>
          <Text style={styles.statusHeaderText}>
            {isCheckInPending && 'AGUARDANDO CHECK-IN NO LOCAL'}
            {isInShift && 'TURNO EM ANDAMENTO'}
            {isAwaitingAutoCheckout && 'AUTO-CHECKOUT: JANELA DE 2H INICIADA'}
            {isPixScheduled && 'APROVADA - PIX AGENDADO'}
          </Text>
        </View>

        {/* Card do Estabelecimento */}
        <View style={styles.shiftCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.roleTag}>{activeShift.role}</Text>
              <Text style={styles.venueName}>{activeShift.venueName}</Text>
              <Text style={styles.venueLocation}>Curitiba, PR • Presença Confirmada</Text>
            </View>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>VALOR DA TAXA</Text>
              <Text style={styles.rateValue}>{activeShift.rateFormatted}</Text>
            </View>
          </View>

          {/* Timeline de Etapas */}
          <View style={styles.stepsTimeline}>
            <View style={styles.stepItem}>
              <Text style={[styles.stepDot, !isCheckInPending && styles.stepDotCompleted]}>
                {!isCheckInPending ? '✓' : '1'}
              </Text>
              <Text style={styles.stepText}>Check-in QR Code Mestre</Text>
            </View>
            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <Text style={[styles.stepDot, (isAwaitingAutoCheckout || isPixScheduled) && styles.stepDotCompleted]}>
                {isAwaitingAutoCheckout || isPixScheduled ? '✓' : '2'}
              </Text>
              <Text style={styles.stepText}>Execução do Turno</Text>
            </View>
            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <Text style={[styles.stepDot, isPixScheduled && styles.stepDotCompleted]}>
                {isPixScheduled ? '✓' : '3'}
              </Text>
              <Text style={styles.stepText}>Auto-Checkout / PIX</Text>
            </View>
          </View>
        </View>

        {/* Bloco Dinâmico de Ação baseado no Status */}
        {isCheckInPending && (
          <View style={styles.actionSection}>
            <View style={styles.instructionBanner}>
              <Text style={styles.instructionTitle}>Chegou ao local?</Text>
              <Text style={styles.instructionBody}>
                Solicite o QR Code Mestre ao gerente ou encarregado de salão e aponte a câmera para liberar seu turno.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              activeOpacity={0.85}
              onPress={() => setIsScannerOpen(true)}
            >
              <Text style={styles.primaryActionText}>ESCANEAR QR CODE MESTRE</Text>
            </TouchableOpacity>
          </View>
        )}

        {isInShift && (
          <View style={styles.actionSection}>
            <View style={styles.activeShiftBanner}>
              <View style={styles.livePulse} />
              <View>
                <Text style={styles.activeShiftTitle}>Turno Ativo</Text>
                <Text style={styles.activeShiftSub}>Seu ponto presencial foi registrado às 19:00.</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.85}
              onPress={requestCheckOut}
            >
              <Text style={styles.checkoutButtonText}>SOLICITAR CHECK-OUT (FINALIZAR TAXA)</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAwaitingAutoCheckout && (
          <View style={styles.actionSection}>
            <View style={styles.autoCheckoutBox}>
              <ActivityIndicator color="#00E676" style={{ marginBottom: 12 }} />
              <Text style={styles.autoCheckoutTitle}>Janela de Contestação em Andamento (2 Horas)</Text>
              <Text style={styles.autoCheckoutDesc}>
                O encerramento do turno foi registrado. Se a gerência não contestar no prazo de 2 horas (simulada em segundos neste teste), o sistema aprovará automaticamente e agendará seu PIX.
              </Text>
              <View style={styles.timerBadge}>
                <Text style={styles.timerBadgeText}>Janela de 2h Ativa • Simulação Acelerada</Text>
              </View>
            </View>
          </View>
        )}

        {isPixScheduled && (
          <View style={styles.actionSection}>
            <View style={styles.pixScheduledBox}>
              <Text style={styles.pixScheduledTitle}>Taxa Aprovada com Sucesso! 🚀</Text>
              <Text style={styles.pixScheduledDesc}>
                A janela de contestação encerrou sem restrições. Avalie o estabelecimento para ver o relatório completo de ganhos.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.reviewLaunchButton}
              activeOpacity={0.88}
              onPress={() => setIsReviewOpen(true)}
            >
              <Text style={styles.reviewLaunchText}>AVALIAR LOCAL E LIBERAR EXTRATO ★★★★★</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal Scanner de QR Code */}
      <MasterQrScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Modal de Avaliação 5 Estrelas Obrigatório */}
      <VenueReviewModal
        visible={isReviewOpen}
        venueName={activeShift.venueName}
        onCompleteReview={handleReviewCompleted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0A0B0E',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#8E95A5',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 1,
    borderColor: '#00E676',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backButtonText: {
    color: '#00E676',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141C',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
    marginBottom: 16,
  },
  pulseIndicatorWrapper: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  pulseIndicatorWarning: {
    backgroundColor: '#F59E0B',
  },
  pulseIndicatorPix: {
    backgroundColor: '#00E676',
  },
  statusHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  shiftCard: {
    backgroundColor: '#141722',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roleTag: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  venueLocation: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 2,
  },
  rateBox: {
    alignItems: 'flex-end',
  },
  rateLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
  },
  rateValue: {
    color: '#00E676',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  stepsTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E232E',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
  },
  stepDotCompleted: {
    backgroundColor: '#00E676',
    color: '#0A0B0E',
  },
  stepText: {
    color: '#8E95A5',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  stepConnector: {
    height: 1,
    width: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  actionSection: {
    gap: 14,
  },
  instructionBanner: {
    backgroundColor: '#12141C',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  instructionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  instructionBody: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  primaryActionButton: {
    backgroundColor: '#00E676',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryActionText: {
    color: '#0A0B0E',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeShiftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  livePulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00E676',
  },
  activeShiftTitle: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '800',
  },
  activeShiftSub: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: '#181D2A',
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  autoCheckoutBox: {
    backgroundColor: '#12141C',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
  },
  autoCheckoutTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  autoCheckoutDesc: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  timerBadge: {
    marginTop: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  timerBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  pixScheduledBox: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00E676',
    alignItems: 'center',
  },
  pixScheduledTitle: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
  },
  pixScheduledDesc: {
    color: '#E2E8F0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  reviewLaunchButton: {
    backgroundColor: '#00E676',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  reviewLaunchText: {
    color: '#0A0B0E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
