export interface CarData {
  plate: string;
  vin: string;
  brand: string;
  model: string;
  color: string;
  firstRegisteredNorway: string;
  isImported: boolean;
  importCountry: string | null;
  mileageAtImport: number;
  usageType: string;
  status: string;
  deregisteredDate: string | null;
  axleConfiguration: any[];
  cachedAt: string;
}
