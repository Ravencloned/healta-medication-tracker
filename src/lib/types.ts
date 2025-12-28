export type Medication = {
  id: string;
  name: string;
  dosage?: string;

  times: string[];        // ["08:00", "20:00"]

  // OPTIONAL enhancement
  // If empty or undefined → daily
  days?: string[];        // ["Mon", "Tue"]

  totalStock: number;
  remainingStock: number;
  lowStockThreshold: number;
};
