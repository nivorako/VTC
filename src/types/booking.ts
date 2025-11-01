export type BookingInfo = {
  date: string;
  heure: string;
  depart: string;
  arrivee: string;
  typeTrajet: string;
  passagersAdultes: number;
  passagersEnfants: number;
  vehicule: string | null;
};