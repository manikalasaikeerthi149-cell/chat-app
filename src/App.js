import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      user: "You",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("chat message", msgData);
    setMessage("");
  };

  return (
    <div className="container">
      <h2>WhatsApp Chat Clone</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.user === "You" ? "msg right" : "msg left"}
          >
            <strong>{msg.user}</strong>: {msg.text}
            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;