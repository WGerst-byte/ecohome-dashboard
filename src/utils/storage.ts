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

// --- Wiederhergestellte CSV Funktionen ---

export function exportToCsv(readings: MeterReading[]): void {
  if (!readings || readings.length === 0) return;
  
  const keys = Object.keys(readings[0]);
  const csvContent = [
    keys.join(','),
    ...readings.map(row => keys.map(k => (row as any)[k]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ecohome_export.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importFromCsv(csvText: string): MeterReading[] {
  try {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        const val = values[index];
        // Konvertiere Zahlenwerte, belasse Strings als Strings
        obj[header.trim()] = !isNaN(Number(val)) && val.trim() !== '' ? Number(val) : val;
      });
      return obj as MeterReading;
    });
  } catch (error) {
    console.error('Fehler beim CSV-Import:', error);
    return [];
  }
}
