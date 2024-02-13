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

export interface GooglePlaceDetail {
  result: {
    formatted_address: string;
    formatted_phone_number: string;
    opening_hours: {
      periods: GooglePlaceDetailPeriods[];
    };
    url: string;
  };
}

export interface GooglePlaceDetailPeriods {
  close: {
    day: number;
    time: string;
  };
  open: {
    day: number;
    time: string;
  };
}
