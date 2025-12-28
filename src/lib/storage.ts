import { Medication } from "./types";

const STORAGE_KEY = "healta_medications";

export function loadMedications(): Medication[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMedications(medications: Medication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
}
