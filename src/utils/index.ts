// socketClient.ts
import { io, Socket } from "socket.io-client";
import config from '../config';

/**
 * Creates and returns a Socket.IO client instance.
 * @param namespace - The namespace URL to connect to (default is "ws://example.com/my-namespace")
 * @returns The Socket.IO client instance.
 */
export const createSocket = (
  namespace: string = config.api.baseURL
): Socket => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("Authentication required");
  }

  const socket = io(namespace, {
    reconnectionDelayMax: 10000,
    auth: {
      token,
    },
    query: {
      userId,
    },
  });

  // Handle chat-related events
  socket.on("chat:message", (data) => {
    console.log("Received chat message:", data);
  });

  socket.on("chat:error", (error) => {
    console.error("Chat error:", error);
  });

  return socket;
};

export class DeepSeekAPI {
  private apiUrl: string = "https://api.deepseek.com/v1/move"; // Replace with actual API endpoint
  private apiKey: string = process.env.REACT_APP_DEEPSEEKAPI || ""; // Replace with your API key

  async getMove(gameState: any): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ gameState }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch move from DeepSeek API");
    }

    return response.json();
  }
}
