"use client";

import { useEffect, useState } from "react";
import { Medication } from "@/lib/types";
import { loadMedications, saveMedications } from "@/lib/storage";
import Link from "next/link";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const data = loadMedications();
    setMedications(data);
  }, []);

  function handleDelete(id: string) {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    saveMedications(updated);
  }

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
            <li key={med.id} style={{ marginBottom: "1.25rem" }}>
              <strong>{med.name}</strong>
              {med.dosage && ` — ${med.dosage}`}

              <div>
                Stock: {med.remainingStock}/{med.totalStock}
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <Link href={`/medications/edit?id=${med.id}`}>
                  <button>Edit</button>
                </Link>

                <button
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => handleDelete(med.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
