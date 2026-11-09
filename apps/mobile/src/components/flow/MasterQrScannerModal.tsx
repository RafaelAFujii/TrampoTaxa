import React, { useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

interface MasterQrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (qrCodePayload: string) => void;
  title?: string;
  subtitle?: string;
}

const { width } = Dimensions.get('window');
const SCAN_BOX_SIZE = Math.min(width * 0.72, 280);

export const MasterQrScannerModal: React.FC<MasterQrScannerModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
  title = 'Escanear QR Code Mestre',
  subtitle = 'Aponte para o visor do gerente para registrar o ponto',
}) => {
  const laserAnim = useRef(new Animated.Value(0)).current;

  // Animação contínua do feixe de laser da câmera (ida e volta)
  useEffect(() => {
    if (visible) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: SCAN_BOX_SIZE - 4,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();

      return () => {
        loop.stop();
        laserAnim.setValue(0);
      };
    } else {
      laserAnim.setValue(0);
    }
  }, [visible, laserAnim]);

  const handleSimulateScan = () => {
    onScanSuccess('QR_MESTRE_123');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Barra superior de navegação */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>{subtitle}</Text>

        {/* Viewport da Câmera Mockada com Mira e Retículo */}
        <View style={styles.cameraViewport}>
          <View style={styles.scanTarget}>
            {/* 4 Cantoneiras da Mira */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Feixe Laser Neon Verde */}
            <Animated.View
              style={[
                styles.laserLine,
                { transform: [{ translateY: laserAnim }] },
              ]}
            />
          </View>
        </View>

        {/* Botão de Debug / Simulação Rápida */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.debugButton}
            activeOpacity={0.8}
            onPress={handleSimulateScan}
          >
            <View style={styles.debugDot} />
            <Text style={styles.debugButtonText}>
              [DEBUG MOCK] Simular Leitura do QR Code Mestre
            </Text>
          </TouchableOpacity>

          <Text style={styles.debugHint}>
            Injeta automaticamente o payload fixo: "QR_MESTRE_123"
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 11, 14, 0.96)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 290,
    marginTop: 8,
  },
  cameraViewport: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    backgroundColor: '#0F1117',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#00E676',
  },
  topLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 12,
    right: 12,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  laserLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  debugButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1.5,
    borderColor: '#00E676',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 10,
  },
  debugDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  debugButtonText: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  debugHint: {
    color: '#64748B',
    fontSize: 11,
  },
});
