"use client";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
const ChatComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isSSEConnected, setIsSSEConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  



  useEffect(() => {
    

    setLoading(true);

    const url = `/messaging/stream`;
   

    const eventSource = new EventSource(url, {
      withCredentials: true,
    } as any);

    eventSource.addEventListener("connected", (event: MessageEvent) => {
    
      setIsSSEConnected(true);
      setLoading(false);
    });

    eventSource.addEventListener("message", (event: MessageEvent) => {
      const data = JSON.parse(event.data);
     
      setMessages((prev) => [...prev, data]);
    });

    eventSource.addEventListener("heartbeat", (event: MessageEvent) => {
      const data = JSON.parse(event.data);
   
    });

    eventSource.onerror = (error) => {
  
      setIsSSEConnected(false);
    };

    return () => {
     
      eventSource.close();
      setIsSSEConnected(false);
    };
  }, []);

  return (
    <div>
      <h3>Messages (SSE)</h3>
      {loading && <p>Loading...</p>}
      {!loading && messages.length === 0 && <p>No messages yet</p>}
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;