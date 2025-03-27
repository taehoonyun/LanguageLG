import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { LocationInput } from "@/components/LocationInput";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { LOCATIONS } from "@/constants/locations";
import { styles } from "./styles";

const Main = () => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const { response, isLoading, error, sendMessage } = useChat();
  const { logout } = useAuth();

  const handleInputChange = (location: string, value: string) => {
    setInputs((prev) => ({ ...prev, [location]: value }));
  };

  const handleSubmit = async (location: string) => {
    const value = inputs[location];
    if (!value) return;

    const prompt = `Location: ${location}\nValue: ${value}`;
    await sendMessage(prompt);
    setInputs((prev) => ({ ...prev, [location]: "" }));
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">Location Generator</h1>
        <Button variant="outline-light" onClick={logout}>
          Logout
        </Button>
      </div>
      <div className="row g-4">
        {LOCATIONS.map((location) => (
          <div key={location} className="col-md-6">
            <LocationInput
              location={location}
              value={inputs[location] || ""}
              onChange={(value) => handleInputChange(location, value)}
              onSubmit={() => handleSubmit(location)}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
      {response && (
        <div className="mt-4">
          <h3 className="text-white mb-3">Response:</h3>
          <div className="bg-dark text-white p-4 rounded" style={styles.response}>
            {response}
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <div className="font-semibold text-white mt-4">{error}</div>
        </div>
      )}
    </Container>
  );
};

export default Main;
