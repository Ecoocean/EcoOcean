import { GeoLoaction } from "./GeoLoactionType";

export interface PollutionReport {
  id: string;
  reporterImageUrl: string;
  reporter: string;
  createdAt: any;
  geom: GeoLoaction;
  type: string;
  address: string;
  photoUrls: string[];
}
