export const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    padding: "2rem",
  },
  title: {
    color: "#1a1a2e",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center" as const,
  },
  input: {
    background: "#ffffff",
    border: "2px solid #e1e1e1",
    borderRadius: "10px",
    padding: "0.8rem",
    fontSize: "1rem",
    color: "#1a1a2e",
    "&:focus": {
      border: "2px solid #4a90e2",
      boxShadow: "none",
    },
  },
  label: {
    color: "#1a1a2e",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  button: {
    background: "#4a90e2",
    border: "none",
    borderRadius: "10px",
    padding: "0.8rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    width: "100%",
    marginTop: "1rem",
    "&:hover": {
      background: "#357abd",
    },
    "&:disabled": {
      background: "#cccccc",
    },
  },
  error: {
    color: "#dc3545",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
} as const; 