import { MeterReading, TariffConfig } from '../types';
import { INITIAL_READINGS } from '../data/mockData';

const READINGS_KEY = 'ecohome_readings';
const TARIFF_KEY = 'ecohome_tariff';

// Fallback-Tarif direkt hinterlegt
const FALLBACK_TARIFF: TariffConfig = {
  gridImportPrice: 0.35,
  pvFeedInPrice: 0.08,
  waterPrice: 2.50,
  heatPumpPrice: 0.28,
  monthlyBaseFee: 10.00
};

export function loadReadings(): MeterReading[] {
  try {
    const data = localStorage.getItem(READINGS_KEY);
    if (!data) return INITIAL_READINGS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_READINGS;
  } catch (e) {
    return INITIAL_READINGS;
  }
}

export function saveReadings(readings: MeterReading[]): void {
  try {
    localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
  } catch (e) {
    console.error('Fehler beim Speichern:', e);
  }
}

export function loadTariff(): TariffConfig {
  try {
    const data = localStorage.getItem(TARIFF_KEY);
    if (!data) return FALLBACK_TARIFF;
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' ? parsed : FALLBACK_TARIFF;
  } catch (e) {
    return FALLBACK_TARIFF;
  }
}

export function saveTariff(tariff: TariffConfig): void {
  try {
    localStorage.setItem(TARIFF_KEY, JSON.stringify(tariff));
  } catch (e) {
    console.error('Fehler beim Speichern:', e);
  }
}
