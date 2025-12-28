"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Medication } from "@/lib/types";
import { loadMedications, saveMedications } from "@/lib/storage";

export default function EditMedicationPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("08:00");
  const [stock, setStock] = useState(0);

  function handleSave() {
    if (!name || stock <= 0) return;

    const medications = loadMedications();

    const newMedication: Medication = {
      id: crypto.randomUUID(),
      name,
      dosage: dosage || undefined,
      times: times.split(",").map(t => t.trim()),
      totalStock: stock,
      remainingStock: stock,
      lowStockThreshold: 3
    };

    saveMedications([...medications, newMedication]);
    router.push("/medications");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Add Medication</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Name *</label><br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Dosage</label><br />
        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Times per day (comma-separated)</label><br />
        <input
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          placeholder="08:00, 20:00"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Total Stock *</label><br />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleSave}
        style={{ marginTop: "1.5rem" }}
      >
        Save Medication
      </button>
    </main>
  );
}
