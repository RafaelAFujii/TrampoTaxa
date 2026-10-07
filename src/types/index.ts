export type Profession = 'Bartender' | 'Garçom';

export interface GigOffer {
  id: string;
  profession: Profession;
  venueName: string;
  rating: number;
  neighborhood: string;
  distance: string;
  rate: number; // e.g. 220
  rateFormatted: string; // "R$ 220,00"
  shiftTime: string; // "19:00 - 01:00"
  shiftDuration: string; // "6 horas de turno"
  microtraining: {
    title: string;
    rulesTitle: string;
    description: string;
  };
  coords: {
    x: number; // percentage fallback
    y: number;
  };
  latLng: {
    lat: number;
    lng: number;
  };
  active: boolean;
}

export type ScreenType = 
  | 'login-screen' 
  | 'cadastro-screen' 
  | 'map-dashboard' 
  | 'gig-offer-bottom-sheet'
  | 'earnings-screen'
  | 'profile-screen'
  | 'settings-screen'
  | 'active-gig-screen';

export type NavTab = 'map' | 'earnings' | 'profile';
