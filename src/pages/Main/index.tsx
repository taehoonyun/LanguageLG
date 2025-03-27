import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { getAIResponse, postAIResponse, getCharacterNames } from "@/api";
const Main = () => {
  const labels = ["cafe", "gym", "restaurant"];
  const [userInputs, setUserInputs] = useState<string[]>(
    Array(labels.length).fill("")
  );
  const [nameList, setNameList] = useState<string[]>([""]);
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const loadNames = async () => {
      const names = await getCharacterNames();
      setNameList(names.data);
    };

    loadNames();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    setUserInputs(updatedInputs);
  };

  const handleSubmit = async (index: number) => {
    const label = labels[index];
    const value = userInputs[index];
    const cleared = [...userInputs];
    cleared[index] = "";
    setUserInputs(cleared);
    const prompt = `Tutor: Luna\nLocation: ${label}\nSentence: ${value}.`;

    try {
      const data = await getAIResponse(prompt);
      if (data.result) {
        setResponse(data.data);
      }
    } catch (err) {
      // console.error("Parsing error or unexpected format:", err);
      setResponse("Something went wrong.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #000000, #434343)" }}
    >
      {labels.map((label, index) => (
        <div key={label} className="mb-4">
          <label htmlFor={label} className="m-2 font-semibold text-white">
            {label}
          </label>
          <input
            id={label}
            type="text"
            onChange={(e) => handleInputChange(index, e.target.value)}
            value={userInputs[index]}
            className="form-control"
          />
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => handleSubmit(index)}
          >
            Send
          </Button>
          <Button variant="light" className="mt-2" onClick={postAIResponse}>
            quit
          </Button>
        </div>
      ))}

      <div className="font-semibold text-white mt-4">{response?.Response}</div>
      <div className="font-semibold text-danger mt-4">{response?.Error}</div>
    </Container>
  );
};

export default Main;
