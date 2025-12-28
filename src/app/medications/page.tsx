"use client";

import { useEffect, useState } from "react";
import { Medication } from "@/lib/types";
import { loadMedications } from "@/lib/storage";
import Link from "next/link";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const data = loadMedications();
    setMedications(data);
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Medications</h1>

      <Link href="/medications/edit">
        <button style={{ marginTop: "1rem" }}>
          + Add Medication
        </button>
      </Link>

      {medications.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>
          No medications added yet.
        </p>
      ) : (
        <ul style={{ marginTop: "2rem" }}>
          {medications.map((med) => (
            <li key={med.id} style={{ marginBottom: "1rem" }}>
              <strong>{med.name}</strong>
              {med.dosage && ` — ${med.dosage}`}
              <div>
                Stock: {med.remainingStock}/{med.totalStock}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
