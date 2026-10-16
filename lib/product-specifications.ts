export const SOLAR_FIELDS = [
  { key: 'panelPowerW', label: 'Puissance du panneau (W)', placeholder: 'Ex. 595', types: ['panel'] },
  { key: 'solarPowerKw', label: 'Puissance des panneaux du kit (kWc)', placeholder: 'Ex. 5.95', types: ['kit'] },
  { key: 'batteryCapacityKwh', label: 'Capacité de stockage batterie (kWh)', placeholder: 'Ex. 15', types: ['battery', 'kit'] },
  { key: 'inverterPowerKw', label: 'Puissance nominale onduleur (kW)', placeholder: 'Ex. 5', types: ['inverter', 'kit'] },
  { key: 'inverterSurgePowerKw', label: 'Puissance maximale au démarrage (kW)', placeholder: 'Ex. 10', types: ['inverter', 'kit'] },
] as const;

export function solarCategoryType(name?: string | null): string {
  const n = (name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/kit|systeme solaire|installation solaire|solution solaire/.test(n)) return 'kit';
  if (/panneau|photovoltaique|module solaire/.test(n)) return 'panel';
  if (/batterie|accumulateur|stockage/.test(n)) return 'battery';
  if (/onduleur|convertisseur|inverter/.test(n)) return 'inverter';
  return 'other';
}

export function readableSpecifications(input: Record<string, unknown> | null | undefined) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return [];
  return Object.entries(input).flatMap(([key, raw]) => {
    if (raw === null || raw === undefined || raw === '' || typeof raw === 'object') return [];
    const field = SOLAR_FIELDS.find((entry) => entry.key === key);
    const fallback = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').trim();
    const label = field ? field.label.replace(/ \([^)]*\)$/, '') : fallback.charAt(0).toUpperCase() + fallback.slice(1);
    const unit = field?.label.match(/\(([^)]+)\)$/)?.[1];
    const value = typeof raw === 'boolean' ? (raw ? 'Oui' : 'Non') : typeof raw === 'number' ? raw.toLocaleString('fr-FR', { maximumFractionDigits: 3 }) : String(raw).trim();
    return value ? [{ key, label, value: unit ? `${value} ${unit}` : value }] : [];
  });
}
