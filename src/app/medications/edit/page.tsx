"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Medication } from "@/lib/types";
import { loadMedications, saveMedications } from "@/lib/storage";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.25rem",
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#111",
  color: "#fff",
};

export default function EditMedicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("08:00");
  const [days, setDays] = useState<string[]>([]);
  const [stock, setStock] = useState<string>(""); // 👈 FIXED

  useEffect(() => {
    if (!editId) return;

    const meds = loadMedications();
    const med = meds.find((m) => m.id === editId);
    if (!med) return;

    setName(med.name);
    setDosage(med.dosage || "");
    setTimes(med.times.join(", "));
    setDays(med.days || []);
    setStock(String(med.remainingStock)); // 👈 preload
  }, [editId]);

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  function handleSave() {
    const stockNumber = Number(stock);
    if (!name || isNaN(stockNumber) || stockNumber <= 0) return;

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
              remainingStock: stockNumber,
              totalStock: Math.max(m.totalStock, stockNumber),
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
        totalStock: stockNumber,
        remainingStock: stockNumber,
        lowStockThreshold: 3,
      };
      saveMedications([...medications, newMedication]);
    }

    router.push("/medications");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>{editId ? "Edit Medication" : "Add Medication"}</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Name *</label>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Dosage</label>
        <input style={inputStyle} value={dosage} onChange={(e) => setDosage(e.target.value)} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Times per day</label>
        <input
          style={inputStyle}
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          placeholder="08:00, 20:00"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Days (optional)</label>
        <div style={{ marginTop: "0.5rem" }}>
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
        <label>Stock *</label>
        <input
          type="number"
          style={inputStyle}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter total stock"
        />
      </div>

      <button style={{ marginTop: "1.5rem" }} onClick={handleSave}>
        {editId ? "Update Medication" : "Save Medication"}
      </button>
    </main>
  );
}
