export interface OrtoolsPostData {
  index: number;
  placeId: number;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  durationTime?: string;
}
