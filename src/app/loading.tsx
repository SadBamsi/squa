import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <Loader2
        size={48}
        color="#6a11cb"
        style={{ animation: "spin 1s linear infinite" }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
