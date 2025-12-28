"use client";

import { useEffect, useState } from "react";
import { Medication } from "@/lib/types";
import { loadMedications, saveMedications } from "@/lib/storage";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TodayPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLog, setDoseLog] = useState<Record<string, string>>({});

  const now = new Date();
  const todayDate = now.toISOString().split("T")[0];
  const todayDay = WEEKDAYS[now.getDay()];

  useEffect(() => {
    setMedications(loadMedications());

    const raw = localStorage.getItem("healta_dose_log");
    setDoseLog(raw ? JSON.parse(raw) : {});
  }, []);

  function isScheduledToday(med: Medication) {
    // Baseline: daily meds
    if (!med.days || med.days.length === 0) return true;

    // Optional enhancement
    return med.days.includes(todayDay);
  }

  function handleAction(medId: string, time: string, action: string) {
    const key = `${todayDate}_${medId}_${time}`;

    const updatedLog = { ...doseLog, [key]: action };
    setDoseLog(updatedLog);
    localStorage.setItem("healta_dose_log", JSON.stringify(updatedLog));

    if (action === "taken") {
      const updatedMeds = medications.map((m) =>
        m.id === medId && m.remainingStock > 0
          ? { ...m, remainingStock: m.remainingStock - 1 }
          : m
      );
      setMedications(updatedMeds);
      saveMedications(updatedMeds);
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Today&apos;s Schedule ({todayDay})</h1>

      <ul style={{ marginTop: "1.5rem" }}>
        {medications
          .filter(isScheduledToday)
          .flatMap((med) =>
            med.times.map((time) => {
              const key = `${todayDate}_${med.id}_${time}`;
              const status = doseLog[key];

              return (
                <li key={key} style={{ marginBottom: "1.25rem" }}>
                  <strong>{med.name}</strong> — {time}

                  <div>
                    Stock: {med.remainingStock}/{med.totalStock}
                    {med.remainingStock <= med.lowStockThreshold && (
                      <span style={{ color: "red", marginLeft: "0.5rem" }}>
                        Low stock
                      </span>
                    )}
                  </div>

                  {!status && (
                    <div>
                      <button onClick={() => handleAction(med.id, time, "taken")}>
                        Taken
                      </button>
                      <button
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => handleAction(med.id, time, "skipped")}
                      >
                        Skipped
                      </button>
                    </div>
                  )}

                  {status && <div>Marked as {status}</div>}
                </li>
              );
            })
          )}
      </ul>
    </main>
  );
}
