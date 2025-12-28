export type Medication = {
  id: string;
  name: string;
  dosage?: string;
  times: string[];              // e.g. ["08:00", "20:00"]
  totalStock: number;
  remainingStock: number;
  lowStockThreshold: number;    // default = 3
};
