export type Lang = 'ru' | 'en' | 'de' | 'fr';

export type Translations = {
  [key: string]: {
    title: string;
    geoBtn: string;
    searchPlaceholder: string;
    lightTheme: string;
    darkTheme: string;
    geoDenied: string;
    geoUnavailable: string;
    geoTimeout: string;
    geoError: string;
  };
};

export type WeatherTKeys = 'error' | 'loading' | 'currentTemp' | 'forecastByDay' | 'hot' | 'cold' | 'mild'; 