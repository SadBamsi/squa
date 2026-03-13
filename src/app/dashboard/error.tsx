"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "1rem", textAlign: "center" }}>
      <h2>Произошла ошибка</h2>
      <p style={{ color: "#888" }}>{error.message}</p>
      <button onClick={reset} style={{ padding: "0.5rem 1.5rem", cursor: "pointer", borderRadius: "6px" }}>
        Попробовать снова
      </button>
    </div>
  );
}
