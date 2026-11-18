import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
} from 'react-native';

interface VenueReviewModalProps {
  visible: boolean;
  venueName: string;
  onCompleteReview: (rating: number, tags: string[]) => void;
}

const AVAILABLE_TAGS = [
  'Ambiente Seguro',
  'Equipe Ágil',
  'Alimentação Inclusa',
  'Bar Organizado',
  'Gorjeta Justa',
];

export const VenueReviewModal: React.FC<VenueReviewModalProps> = ({
  visible,
  venueName,
  onCompleteReview,
}) => {
  const [rating, setRating] = useState<number>(5); // Inicia com 5 estrelas como sugestão
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Ambiente Seguro',
    'Bar Organizado',
  ]);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Animação de celebração instantânea (Scale & Fade comemorativo)
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const celebrationOpacity = useRef(new Animated.Value(1)).current;

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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;

    const completeReview = () => {
      onCompleteReview(rating, selectedTags);
      celebrationScale.setValue(1);
      celebrationOpacity.setValue(1);
    };

    if (reduceMotion) {
      completeReview();
      return;
    }

    // Transição comemorativa direta: micro-feedback de impacto sem loader chato
    Animated.parallel([
      Animated.sequence([
        Animated.timing(celebrationScale, {
          toValue: 1.12,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationScale, {
          toValue: 0.85,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(completeReview);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: celebrationScale }],
              opacity: celebrationOpacity,
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AVALIAÇÃO OBRIGATÓRIA DO TURNO</Text>
          </View>

          <Text style={styles.title}>Avalie o Estabelecimento</Text>
          <Text style={styles.subtitle}>Como foi trabalhar hoje no {venueName}?</Text>

          {/* Seletor de 5 Estrelas */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Text style={[styles.starIcon, star <= rating ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags de Experiência Rápida */}
          <View style={styles.tagsContainer}>
            {AVAILABLE_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[styles.tagPill, active && styles.tagPillActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botão de Envio Imediato */}
          <TouchableOpacity
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            disabled={rating === 0}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>ENVIAR E VER MEU PIX ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 11, 14, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#202421',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 24,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(95,167,128, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    color: '#5FA780',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 18,
    gap: 8,
  },
  starTouch: {
    padding: 6,
  },
  starIcon: {
    fontSize: 34,
  },
  starFilled: {
    color: '#5FA780',
  },
  starEmpty: {
    color: '#334155',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  tagPill: {
    backgroundColor: '#202421',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagPillActive: {
    backgroundColor: 'rgba(95,167,128, 0.15)',
    borderColor: '#5FA780',
  },
  tagText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  tagTextActive: {
    color: '#5FA780',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#5FA780',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#334155',
  },
  submitButtonText: {
    color: '#171B1A',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
