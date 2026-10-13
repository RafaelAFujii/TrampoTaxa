import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { formatPhone, formatCNPJ } from '@trampotaxa/shared';

export const ProfileScreen: React.FC = () => {
  // Alternador de visão de perfil para validação dinâmica (Freelancer vs Contratante)
  const [role, setRole] = useState<'Freelancer' | 'Contratante'>('Freelancer');
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header do Perfil com Avatar e Alternador */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {role === 'Freelancer' ? 'GS' : 'BB'}
            </Text>
          </View>
          <View style={[styles.statusDot, isAvailable ? styles.statusOnline : styles.statusOffline]} />
        </View>

        <Text style={styles.userName}>
          {role === 'Freelancer' ? 'Gabriel Silva' : 'Bistrô do Batel'}
        </Text>
        <Text style={styles.userRole}>
          {role === 'Freelancer' ? 'Bartender Pro • Curitiba, PR' : 'Gastronomia & Coquetelaria LTDA'}
        </Text>

        {/* Toggle de Perfil (Freelancer / Contratante) */}
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleToggleButton, role === 'Freelancer' && styles.roleToggleButtonActive]}
            onPress={() => setRole('Freelancer')}
          >
            <Text style={[styles.roleToggleText, role === 'Freelancer' && styles.roleToggleTextActive]}>
              Modo Freelancer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleToggleButton, role === 'Contratante' && styles.roleToggleButtonActive]}
            onPress={() => setRole('Contratante')}
          >
            <Text style={[styles.roleToggleText, role === 'Contratante' && styles.roleToggleTextActive]}>
              Modo Contratante
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo específico para Freelancer */}
      {role === 'Freelancer' ? (
        <View style={styles.sectionContainer}>
          {/* Métricas Operacionais */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4.9 ★</Text>
              <Text style={styles.statLabel}>Avaliação Geral</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Turnos Feitos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>99%</Text>
              <Text style={styles.statLabel}>Pontualidade</Text>
            </View>
          </View>

          {/* Toggle de Disponibilidade no Radar */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>Status no Radar</Text>
                <Text style={styles.cardSubtitle}>
                  {isAvailable ? 'Visível para vagas imediatas' : 'Radar pausado'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.switchButton, isAvailable && styles.switchButtonActive]}
                onPress={() => setIsAvailable(!isAvailable)}
              >
                <Text style={[styles.switchButtonText, isAvailable && styles.switchButtonTextActive]}>
                  {isAvailable ? 'DISPONÍVEL' : 'PAUSADO'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Especialidades do Profissional */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Habilidades & Especialidades</Text>
            <View style={styles.specialtiesWrap}>
              {[
                'Mixologia Clássica',
                'Velocidade de Balcão',
                'Drinks Autorais',
                'Abridor Próprio',
                'Uniforme Preto Completo',
              ].map((item) => (
                <View key={item} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Dados Fiscais e Bancários */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados Cadastrais & PIX</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone WhatsApp</Text>
              <Text style={styles.infoValue}>{formatPhone('41991234567')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chave PIX</Text>
              <Text style={styles.infoValue}>gabriel.silva@curitiba.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Banco Cadastrado</Text>
              <Text style={styles.infoValue}>Banco Inter (077)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Identificação</Text>
              <Text style={styles.infoValueVerified}>CPF Verificado ✓</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Conteúdo específico para Contratante */
        <View style={styles.sectionContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4.9 ★</Text>
              <Text style={styles.statLabel}>Reputação Bar</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Vagas Abertas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Pagamentos PIX</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados do Estabelecimento</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CNPJ Regular</Text>
              <Text style={styles.infoValue}>{formatCNPJ('12345678000190')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Segmento</Text>
              <Text style={styles.infoValue}>Bistrô & Alta Coquetelaria</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>Av. do Batel, 1540 - Curitiba/PR</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gerência Operacional</Text>
              <Text style={styles.infoValue}>{formatPhone('41998871234')}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#141722',
    borderWidth: 2,
    borderColor: '#00E676',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    color: '#00E676',
    fontSize: 22,
    fontWeight: '900',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0A0B0E',
  },
  statusOnline: {
    backgroundColor: '#00E676',
  },
  statusOffline: {
    backgroundColor: '#64748B',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  userRole: {
    color: '#8E95A5',
    fontSize: 12,
    marginTop: 4,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#141722',
    borderRadius: 14,
    padding: 3,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  roleToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 11,
  },
  roleToggleButtonActive: {
    backgroundColor: '#00E676',
  },
  roleToggleText: {
    color: '#8E95A5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roleToggleTextActive: {
    color: '#0A0B0E',
  },
  sectionContainer: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#141722',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statValue: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    color: '#8E95A5',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  card: {
    backgroundColor: '#141722',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#8E95A5',
    fontSize: 11,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  switchButtonActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    borderWidth: 1,
    borderColor: '#00E676',
  },
  switchButtonText: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: 'bold',
  },
  switchButtonTextActive: {
    color: '#00E676',
  },
  specialtiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  specialtyChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  specialtyText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  infoLabel: {
    color: '#8E95A5',
    fontSize: 12,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValueVerified: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '700',
  },
});
