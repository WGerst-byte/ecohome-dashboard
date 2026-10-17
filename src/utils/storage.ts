import { MeterReading, TariffConfig } from '../types';
import { INITIAL_READINGS } from '../data/mockData';
import { DEFAULT_TARIFF } from './calculations';

const READINGS_KEY = 'ecohome_readings';
const TARIFF_KEY = 'ecohome_tariff';

export function loadReadings(): MeterReading[] {
  try {
    const data = localStorage.getItem(READINGS_KEY);
    if (!data) return INITIAL_READINGS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_READINGS;
  } catch (e) {
    console.error('Fehler beim Laden der Zählerstände:', e);
    return INITIAL_READINGS;
  }
}

export function saveReadings(readings: MeterReading[]): void {
  try {
    localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
  } catch (e) {
    console.error('Fehler beim Speichern der Zählerstände:', e);
  }
}

export function loadTariff(): TariffConfig {
  try {
    const data = localStorage.getItem(TARIFF_KEY);
    if (!data) return DEFAULT_TARIFF;
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' ? parsed : DEFAULT_TARIFF;
  } catch (e) {
    console.error('Fehler beim Laden des Tarifs:', e);
    return DEFAULT_TARIFF;
  }
}

export function saveTariff(tariff: TariffConfig): void {
  try {
    localStorage.setItem(TARIFF_KEY, JSON.stringify(tariff));
  } catch (e) {
    console.error('Fehler beim Speichern des Tarifs:', e);
  }
}
