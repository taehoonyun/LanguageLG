export const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
  },
  button: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
  },
  characterList: {
    display: "flex",
    gap: "1rem",
  },
  characterCard: {
    width: "150px",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  characterImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "15px",
  },
  characterName: {
    color: "white",
    fontSize: "1.5rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  characterDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1rem",
    lineHeight: "1.6",
  },
  chatContainer: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    minHeight: "300px",
    maxHeight: "500px",
    overflowY: "auto",
  },
  message: {
    marginBottom: "15px",
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  characterMessage: {
    background: "rgba(255, 255, 255, 0.1)",
    marginRight: "auto",
  },
  errorMessage: {
    background: "rgba(255, 0, 0, 0.1)",
    border: "1px solid rgba(255, 0, 0, 0.2)",
    marginLeft: "auto",
  },
  inputContainer: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  input: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    "&:focus": {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "none",
    },
  },
  error: {
    color: "#ff6b6b",
    marginTop: "10px",
    textAlign: "center",
  },
} as const; 