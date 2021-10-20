import { GeoLoaction } from "./GeoLoactionType";

export interface PollutionReport {
  id: string;
  reporter: string;
  created_at: any;
  location: GeoLoaction;
  type: string;
  address: string;
  photoUrls: string[];
}
