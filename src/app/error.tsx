"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem", textAlign: "center" }}>
      <h2>Что-то пошло не так</h2>
      <p style={{ color: "#888" }}>{error.message}</p>
      <button onClick={reset} style={{ padding: "0.5rem 1.5rem", cursor: "pointer", borderRadius: "6px" }}>
        Попробовать снова
      </button>
    </div>
  );
}
