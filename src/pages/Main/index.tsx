import { useState, useEffect } from "react";
import { Container, Button, Form, Card, Toast, Dropdown } from "react-bootstrap";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { aiService } from "@/services/ai";
import { styles } from "./styles";

interface Character {
  name: string;
  description: string;
  personality?: string;
  promptPrefix?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const LOCATIONS = [
  "Cafe",
  "Restaurant",
  "Gym",
  "Park",
  "Shopping Mall",
  "Library",
  "Movie Theater",
  "Beach",
  "Museum",
  "Coffee Shop"
];

const Main = () => {
  const [message, setMessage] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const { logout, token, user } = useAuth();
  const { response, isLoading, error, sendMessage, resetHistory, talkToFriend, quitChat } = useChat(user?.id || '');
  
  
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!token) {
        setIsLoadingCharacters(false);
        return;
      }
      
      try {
        const { result, data: names } = await aiService.getCharacterNames();
        
        if (!result || !names) {
          setToastMessage("Failed to fetch characters");
          setShowToast(true);
          return;
        }

        const characterList = names.map((name: string) => ({
          name,
          description: `Chat with ${name}`
        }));
        
        setCharacters(characterList);
        if (characterList.length > 0) {
          const randomIndex = Math.floor(Math.random() * characterList.length);
          setSelectedCharacter(characterList[randomIndex]);
        }
      } catch (error) {
        setToastMessage("Failed to fetch characters. Please try again.");
        setShowToast(true);
      } finally {
        setIsLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, [token]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setMessageHistory([]); // Clear message history when location changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedCharacter || !selectedLocation) return;

    try {
      // Add user message to history with location context
      setMessageHistory(prev => [...prev, { 
        role: 'user', 
        content: `${message}` 
      }]);
      
      const result = await sendMessage(message);
      
      // Add assistant response to history
      if (result.result && result.data) {
        setMessageHistory(prev => [...prev, { 
          role: 'assistant', 
          content: result.data.Response 
        }]);
      }
      
      setMessage("");
    } catch (error) {
      setToastMessage("Failed to send message. Please try again.");
      setShowToast(true);
    }
  };

  const handleReset = async () => {
    try {
      await resetHistory();
      setMessage("");
      setMessageHistory([]); // Clear message history
    } catch (error) {
      setToastMessage("Failed to reset chat. Please try again.");
      setShowToast(true);
    }
  };

  const handleCharacterSelect = async (character: Character) => {
    try {
      setMessageHistory([]); // Clear previous message history
      setSelectedCharacter(character); // Set the selected character
      if (selectedLocation) {
        const result = await talkToFriend(character.name, [], selectedLocation);
           // Add assistant response to history
      if (result.result && result.data) {
        setMessageHistory(prev => [...prev, { 
          role: 'assistant', 
          content: result.data.Response 
        }]);
      }
      }
    } catch (error) {
      console.log(error);
      setToastMessage("Failed to select character. Please try again.");
      setShowToast(true);
    }
  };

  const handleQuit = async () => {
    if (!selectedCharacter) return;
    
    try {
      await quitChat();
      setSelectedCharacter(null);
      setMessage("");
      setToastMessage("Chat ended successfully");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Failed to end chat. Please try again.");
      setShowToast(true);
    }
  };

  if (isLoadingCharacters) {
    return (
      <Container className="py-5" style={styles.container}>
        <div className="text-center text-white">
          <h2>Loading characters...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={styles.container}>
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        delay={3000} 
        autohide
        className="position-fixed top-0 end-0 m-3"
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">Character Chat</h1>
        <div>
          {selectedCharacter && (
            <Button 
              variant="outline-danger" 
              onClick={handleQuit} 
              className="me-2"
              style={styles.button}
            >
              Quit Chat
            </Button>
          )}
          <Button 
            variant="outline-light" 
            onClick={handleReset} 
            className="me-2"
            style={styles.button}
          >
            Reset Chat
          </Button>
          <Button 
            variant="outline-light" 
            onClick={logout}
            style={styles.button}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        <div className="w-100 mb-4">
          <h3 className="text-white mb-3">Select a Character</h3>
          <div className="d-flex gap-3 overflow-auto pb-3 custom-scrollbar" style={styles.characterList}>
            {characters.map((character) => (
              <Card
                key={character.name}
                className={`flex-shrink-0 ${selectedCharacter?.name === character.name ? 'border-light' : ''}`}
                style={styles.characterCard}
                onClick={() => handleCharacterSelect(character)}
              >
                <Card.Body className="p-2">
                  <Card.Title className="text-center mb-0 text-white">
                    {character.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        {selectedCharacter && (
          <div className="text-center mb-4 p-4 rounded bg-dark bg-opacity-25 border border-light">
            <h2 className="text-white">{selectedCharacter.name}</h2>
            <p className="text-white-50 mb-0">
              {selectedCharacter.description}
            </p>
          </div>
        )}

        <div className="w-100 mb-4">
          <h3 className="text-white mb-3">Select a Location</h3>
          <div className="d-flex gap-3 overflow-auto pb-3 custom-scrollbar" style={styles.characterList}>
            {LOCATIONS.map((location) => (
              <Card
                key={location}
                className={`flex-shrink-0 ${selectedLocation === location ? 'border-light' : ''}`}
                style={styles.characterCard}
                onClick={() => handleLocationSelect(location)}
              >
                <Card.Body className="p-2">
                  <Card.Title className="text-center mb-0 text-white">
                    {location}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-100 mb-4 p-3 rounded bg-dark bg-opacity-25 border border-light overflow-auto custom-scrollbar" 
             style={{ minHeight: "300px", maxHeight: "500px" }}>
          {messageHistory.map((msg, index) => (
            <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-3 rounded-3 ${msg.role === 'user' ? 'bg-primary bg-opacity-25 text-white' : 'bg-dark bg-opacity-25 text-white'}`} 
                   style={{ maxWidth: "80%" }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="d-flex mb-3 justify-content-start">
              <div className="bg-dark bg-opacity-25 text-white p-3 rounded-3" style={{ maxWidth: "80%" }}>
                ...
              </div>
            </div>
          )}
          {error && (
            <div className="d-flex mb-3 justify-content-end">
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3" style={{ maxWidth: "80%" }}>
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="w-100 p-3 rounded bg-dark bg-opacity-25 border border-light">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedCharacter && selectedLocation 
                  ? `Chat with ${selectedCharacter.name} at ${selectedLocation}...` 
                  : "Select a character and location to start chatting"}
                disabled={isLoading || !selectedCharacter || !selectedLocation}
                className="bg-dark bg-opacity-25 text-white border-light"
              />
              <Button 
                type="submit" 
                variant="outline-light"
                disabled={isLoading || !message.trim() || !selectedCharacter || !selectedLocation}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default Main;
