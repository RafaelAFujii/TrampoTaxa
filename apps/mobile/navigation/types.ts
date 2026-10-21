export type FreelancerTabParamList = {
  Mapa: undefined;
  Relatorios: undefined;
  Perfil: undefined;
};

export type ContractorTabParamList = {
  Vagas: undefined;
  CriarVaga: undefined;
  RelatorioContratante: undefined;
  Chat: undefined;
};

export type MobileTabParamList = FreelancerTabParamList & ContractorTabParamList;
