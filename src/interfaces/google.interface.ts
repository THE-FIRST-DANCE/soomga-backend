export interface GooglePlaceResponse {
  next_page_token: string;
  results: GooglePlace[];
}

export interface GooglePlace {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  photos: GooglePlacePhoto[];
  place_id: string;
  rating: number;
  vicinity: string;
}

export interface GooglePlacePhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}
