import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useFreelancerGigFlow } from '../hooks/useFreelancerGigFlow';

interface HighDopamineEarningsScreenProps {
  onBackToRadar?: () => void;
}

export const HighDopamineEarningsScreen: React.FC<HighDopamineEarningsScreenProps> = ({
  onBackToRadar,
}) => {
  const { activeShift, finishAndReceive } = useFreelancerGigFlow();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada animada dos cards
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso contínuo do status PIX em verde neon
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulseAnim, slideAnim, opacityAnim]);

  const handleFinish = () => {
    finishAndReceive();
    if (onBackToRadar) {
      onBackToRadar();
    }
  };

  const earnedAmount = activeShift?.rateFormatted ?? 'R$ 260,00';
  const venue = activeShift?.venueName ?? 'Taj Bar Curitiba';
  const role = activeShift?.role ?? 'Bartender';

  return (
    <View style={styles.container}>
      {/* Efeito Glow de Fundo Radial Verde Neon */}
      <View style={styles.neonGlowBackground} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedWrapper,
            { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Top Header Comemorativo */}
          <View style={styles.header}>
            <Text style={styles.fireEmoji}>⚡️</Text>
            <Text style={styles.congratsTitle}>Turno Concluído com Sucesso!</Text>
            <Text style={styles.venueSubtitle}>
              {role} • {venue}
            </Text>
          </View>

          {/* Card Principal: Pico de Dopamina */}
          <View style={styles.heroEarningsCard}>
            <Text style={styles.heroLabel}>TAXA LÍQUIDA GANHA HOJE</Text>

            <Text style={styles.heroAmount}>{earnedAmount}</Text>

            <Animated.View style={[styles.pixStatusBanner, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.pulsingDot} />
              <Text style={styles.pixStatusText}>PIX AGENDADO / LIBERADO</Text>
            </Animated.View>

            <Text style={styles.pixTimelineText}>
              Aprovado tacitamente sem contestação. Repasse integral direto na sua chave PIX.
            </Text>
          </View>

          {/* Detalhes de Fechamento Operacional */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo da Operação</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Turno</Text>
              <Text style={styles.summaryValue}>6 horas de serviço</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Check-in Presencial</Text>
              <Text style={styles.summaryValue}>Validado via QR Mestre ✓</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Check-out e Contestação</Text>
              <Text style={styles.summaryValue}>Janela 2h Encerrada ✓</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Chave PIX do Repasse</Text>
              <Text style={styles.summaryValueHighlight}>gabriel.silva@curitiba.com</Text>
            </View>
          </View>

          {/* Botão de Fechar e Voltar ao Radar */}
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.88} onPress={handleFinish}>
            <Text style={styles.primaryButtonText}>VOLTAR AO RADAR DE TAXAS ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080B',
  },
  neonGlowBackground: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  animatedWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fireEmoji: {
    fontSize: 38,
    marginBottom: 6,
  },
  congratsTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  venueSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  heroEarningsCard: {
    width: '100%',
    backgroundColor: '#0F121A',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#00E676',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
  },
  heroLabel: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroAmount: {
    color: '#00E676',
    fontSize: 44,
    fontWeight: '900',
    marginVertical: 10,
    letterSpacing: -0.5,
  },
  pixStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.18)',
    borderWidth: 1,
    borderColor: '#00E676',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 12,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  pixStatusText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pixTimelineText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 260,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#12141C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    color: '#8E95A5',
    fontSize: 12,
  },
  summaryValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryValueHighlight: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#00E676',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#0A0B0E',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
