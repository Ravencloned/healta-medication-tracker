"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Medication } from "@/lib/types";
import { loadMedications, saveMedications } from "@/lib/storage";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EditMedicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("08:00");
  const [days, setDays] = useState<string[]>([]);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (!editId) return;

    const meds = loadMedications();
    const med = meds.find((m) => m.id === editId);
    if (!med) return;

    setName(med.name);
    setDosage(med.dosage || "");
    setTimes(med.times.join(", "));
    setDays(med.days || []);
    setStock(med.remainingStock);
  }, [editId]);

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  function handleSave() {
    if (!name || stock <= 0) return;

    const medications = loadMedications();

    if (editId) {
      const updated = medications.map((m) =>
        m.id === editId
          ? {
              ...m,
              name,
              dosage: dosage || undefined,
              times: times.split(",").map((t) => t.trim()),
              days: days.length > 0 ? days : undefined,
              remainingStock: stock,
              totalStock: Math.max(m.totalStock, stock),
            }
          : m
      );

      saveMedications(updated);
    } else {
      const newMedication: Medication = {
        id: crypto.randomUUID(),
        name,
        dosage: dosage || undefined,
        times: times.split(",").map((t) => t.trim()),
        days: days.length > 0 ? days : undefined,
        totalStock: stock,
        remainingStock: stock,
        lowStockThreshold: 3,
      };

      saveMedications([...medications, newMedication]);
    }

    router.push("/medications");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{editId ? "Edit Medication" : "Add Medication"}</h1>

      <div>
        <label>Name *</label><br />
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label>Dosage</label><br />
        <input value={dosage} onChange={(e) => setDosage(e.target.value)} />
      </div>

      <div>
        <label>Times per day</label><br />
        <input
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          placeholder="08:00, 20:00"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Days (optional)</label>
        <div>
          {WEEKDAYS.map((day) => (
            <label key={day} style={{ marginRight: "0.75rem" }}>
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
              />{" "}
              {day}
            </label>
          ))}
        </div>
        <small>If no days are selected, medication is treated as daily.</small>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Stock *</label><br />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>

      <button style={{ marginTop: "1.5rem" }} onClick={handleSave}>
        {editId ? "Update Medication" : "Save Medication"}
      </button>
    </main>
  );
}
