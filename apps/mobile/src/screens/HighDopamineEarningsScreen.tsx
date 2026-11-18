import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
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
  const [reduceMotion, setReduceMotion] = useState(false);

  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
      return;
    }

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

  }, [slideAnim, opacityAnim, reduceMotion]);

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedWrapper,
            { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Top Header Comemorativo */}
          <View style={styles.header}>
            <Text style={styles.congratsTitle}>Turno Concluído com Sucesso!</Text>
            <Text style={styles.venueSubtitle}>
              {role} • {venue}
            </Text>
          </View>

          {/* Card Principal: Pico de Dopamina */}
          <View style={styles.heroEarningsCard}>
            <Text style={styles.heroLabel}>TAXA LÍQUIDA GANHA HOJE</Text>

            <Text style={styles.heroAmount}>{earnedAmount}</Text>

            <View style={styles.pixStatusBanner}>
              <View style={styles.pulsingDot} />
              <Text style={styles.pixStatusText}>PIX AGENDADO / LIBERADO</Text>
            </View>

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
            <Text style={styles.primaryButtonText}>Voltar ao radar de taxas</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171B1A',
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
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  congratsTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'left',
  },
  venueSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  heroEarningsCard: {
    width: '100%',
    backgroundColor: '#202421',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(95,167,128,0.3)',
    padding: 24,
    alignItems: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  heroLabel: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: '600',
  },
  heroAmount: {
    color: '#5FA780',
    fontSize: 44,
    fontWeight: '700',
    marginVertical: 10,
    letterSpacing: -0.5,
  },
  pixStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(95,167,128, 0.18)',
    borderWidth: 1,
    borderColor: '#5FA780',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5FA780',
  },
  pixStatusText: {
    color: '#5FA780',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pixTimelineText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'left',
    maxWidth: '100%',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#202421',
    borderRadius: 12,
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
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
    color: '#5FA780',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#5FA780',
    borderRadius: 8,
    paddingVertical: 18,
    minHeight: 48,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#171B1A',
    fontSize: 14,
    fontWeight: '900',
  },
});
