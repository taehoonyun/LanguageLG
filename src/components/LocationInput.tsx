import { Form, Button } from "react-bootstrap";

interface LocationInputProps {
  location: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const LocationInput = ({
  location,
  value,
  onChange,
  onSubmit,
  isLoading,
}: LocationInputProps) => {
  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-white mb-3">{location}</h3>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${location.toLowerCase()}`}
          disabled={isLoading}
        />
      </Form.Group>
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={!value || isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}; 