import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { INITIAL_CONTRACTOR_GIGS } from '@trampotaxa/shared/mocks';
import type { ContractorGig, FreelancerApplicant } from '@trampotaxa/shared';

export const ContractorGigsScreen: React.FC = () => {
  const [gigs, setGigs] = useState<ContractorGig[]>(INITIAL_CONTRACTOR_GIGS);
  const [selectedFilter, setSelectedFilter] = useState<'Todas' | 'Aberta' | 'Preenchida' | 'Finalizada'>('Todas');
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [activeQrGig, setActiveQrGig] = useState<ContractorGig | null>(null);

  const filteredGigs = gigs.filter((gig) => {
    if (selectedFilter === 'Todas') return true;
    return gig.status === selectedFilter;
  });

  const handleOpenQrModal = (gig: ContractorGig) => {
    setActiveQrGig(gig);
    setIsQrModalVisible(true);
  };

  const handleApproveApplicant = (gigId: string, applicant: FreelancerApplicant) => {
    setGigs((prev) =>
      prev.map((gig) => {
        if (gig.id !== gigId) return gig;
        return {
          ...gig,
          status: 'Preenchida',
          approvedFreelancerId: applicant.id,
          applicants: gig.applicants.map((a) =>
            a.id === applicant.id ? { ...a, status: 'Aprovado' as const } : a
          ),
        };
      })
    );

    const overbookingNotice = applicant.isOverbooking
      ? '\n\n⚡ Regra de Overbooking: As candidaturas concorrentes deste profissional em outros locais foram canceladas automaticamente pelo sistema.'
      : '';

    Alert.alert(
      'Candidato Aprovado!',
      `${applicant.name} foi confirmado para a vaga de ${applicant.profession}.${overbookingNotice}`
    );
  };

  const handleApprovePixNow = (gigId: string) => {
    setGigs((prev) =>
      prev.map((gig) => {
        if (gig.id !== gigId) return gig;
        return {
          ...gig,
          status: 'Finalizada',
          shiftPhase: 'pix_aprovado',
        };
      })
    );

    Alert.alert(
      'PIX Aprovado com Sucesso! 💸',
      'O repasse foi liberado e agendado sem precisar aguardar a janela de 2 horas. O freelancer já recebeu a notificação.'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header com Filtros de Status */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['Todas', 'Aberta', 'Preenchida', 'Finalizada'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Banner de Sincronização da Jornada Mútua */}
      <View style={styles.syncBanner}>
        <Text style={styles.syncBannerTitle}>⚡ Central de Operação & Check-in</Text>
        <Text style={styles.syncBannerText}>
          Apresente o QR Code Mestre aos freelancers na chegada para registrar o início do turno.
        </Text>
      </View>

      {/* Lista de Vagas */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredGigs.map((gig) => {
          const isPreenchida = gig.status === 'Preenchida';
          const isAberta = gig.status === 'Aberta';

          return (
            <View key={gig.id} style={styles.gigCard}>
              {/* Header do Card */}
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={[styles.statusBadge, isPreenchida ? styles.statusBadgeFilled : styles.statusBadgeOpen]}>
                    <Text style={[styles.statusText, isPreenchida ? styles.statusTextFilled : styles.statusTextOpen]}>
                      {gig.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.roleText}>{gig.role}</Text>
                </View>
                <Text style={styles.rateText}>{gig.rateFormatted}</Text>
              </View>

              <Text style={styles.gigTitle}>{gig.title}</Text>
              <Text style={styles.gigDetails}>
                {gig.dateFormatted} • {gig.startTime} - {gig.endTime}
              </Text>

              {/* Botões de Ação Operacional do Contratante */}
              <View style={styles.actionButtonsRow}>
                {/* Botão de Exibir QR Code Mestre */}
                {(isPreenchida || isAberta) && (
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => handleOpenQrModal(gig)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.qrButtonText}>⌖ Exibir QR Mestre</Text>
                  </TouchableOpacity>
                )}

                {/* Botão de Liberar PIX no Fechamento */}
                {isPreenchida && (
                  <TouchableOpacity
                    style={styles.pixApproveButton}
                    onPress={() => handleApprovePixNow(gig.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.pixApproveButtonText}>✓ Liberar PIX Agora</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Lista de Candidatos da Vaga */}
              {gig.applicants.length > 0 && (
                <View style={styles.applicantsSection}>
                  <Text style={styles.applicantsTitle}>
                    Candidatos ({gig.applicants.length}):
                  </Text>

                  {gig.applicants.map((app) => (
                    <View key={app.id} style={styles.applicantItem}>
                      <View style={styles.applicantInfo}>
                        <View style={styles.applicantNameRow}>
                          <Text style={styles.applicantName}>{app.name}</Text>
                          {app.isOverbooking && (
                            <View style={styles.overbookingBadge}>
                              <Text style={styles.overbookingBadgeText}>⚡ Overbooking</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.applicantMeta}>
                          {app.profession} • {app.rating.toFixed(1)} ★ • {app.punctualityRate} pontual
                        </Text>
                      </View>

                      {app.status === 'Pendente' && gig.status === 'Aberta' ? (
                        <TouchableOpacity
                          style={styles.approveButton}
                          onPress={() => handleApproveApplicant(gig.id, app)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.approveButtonText}>Aprovar</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.approvedPill}>
                          <Text style={styles.approvedPillText}>{app.status}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Modal Mobile do QR Code Mestre do Estabelecimento */}
      <Modal visible={isQrModalVisible} transparent animationType="slide" onRequestClose={() => setIsQrModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>QR Code Mestre do Salão</Text>
              <TouchableOpacity onPress={() => setIsQrModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {activeQrGig?.venueName || 'Estabelecimento'} • Ponto de Entrada
            </Text>

            {/* QR Mock Visual */}
            <View style={styles.qrDisplayBox}>
              <View style={styles.qrMockFrame}>
                <View style={[styles.qrCorner, styles.qrTopLeft]} />
                <View style={[styles.qrCorner, styles.qrTopRight]} />
                <View style={[styles.qrCorner, styles.qrBottomLeft]} />
                <View style={[styles.qrCorner, styles.qrBottomRight]} />
                <Text style={styles.qrMockCodeText}>QR_MESTRE_123</Text>
              </View>
            </View>

            <View style={styles.modalSecretBox}>
              <Text style={styles.modalSecretLabel}>Código de Contingência:</Text>
              <Text style={styles.modalSecretValue}>QR_MESTRE_123</Text>
            </View>

            <Text style={styles.modalInstructions}>
              Apresente este código para o freelancer na entrada do turno para validar a presença.
            </Text>

            <TouchableOpacity
              style={styles.modalDismissBtn}
              onPress={() => setIsQrModalVisible(false)}
            >
              <Text style={styles.modalDismissText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  filterBar: {
    backgroundColor: '#0F1117',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
  syncBanner: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    borderRadius: 16,
    padding: 14,
  },
  syncBannerTitle: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
  },
  syncBannerText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 3,
    lineHeight: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 14,
  },
  gigCard: {
    backgroundColor: '#141722',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeOpen: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  statusBadgeFilled: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  statusTextOpen: {
    color: '#00E676',
  },
  statusTextFilled: {
    color: '#60A5FA',
  },
  roleText: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: '700',
  },
  rateText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
  },
  gigTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  gigDetails: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  qrButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  qrButtonText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '900',
  },
  pixApproveButton: {
    flex: 1,
    backgroundColor: '#00E676',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pixApproveButtonText: {
    color: '#0A0B0E',
    fontSize: 12,
    fontWeight: '900',
  },
  applicantsSection: {
    backgroundColor: '#0F1117',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  applicantsTitle: {
    color: '#8E95A5',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  applicantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  applicantInfo: {
    flex: 1,
  },
  applicantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  overbookingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  overbookingBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
  },
  applicantMeta: {
    color: '#8E95A5',
    fontSize: 11,
    marginTop: 2,
  },
  approveButton: {
    backgroundColor: '#00E676',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveButtonText: {
    color: '#0A0B0E',
    fontSize: 11,
    fontWeight: '900',
  },
  approvedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  approvedPillText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 11, 14, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#12141C',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#00E676',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  qrDisplayBox: {
    width: 180,
    height: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrMockFrame: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: '#0A0B0E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrCorner: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#0A0B0E',
  },
  qrTopLeft: { top: 6, left: 6 },
  qrTopRight: { top: 6, right: 6 },
  qrBottomLeft: { bottom: 6, left: 6 },
  qrBottomRight: { bottom: 6, right: 6 },
  qrMockCodeText: {
    color: '#0A0B0E',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  modalSecretBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  modalSecretLabel: {
    color: '#8E95A5',
    fontSize: 11,
  },
  modalSecretValue: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  modalInstructions: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  modalDismissBtn: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalDismissText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
