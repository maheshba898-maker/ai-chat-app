import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load files on startup with error handling
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]); // Set to empty array on error
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        sender: "ai",
        text: data.reply || "No response",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error: Could not get response",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Upload successful!");
        fetchFiles(); // Refresh file list
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload error");
    }
  };

  // Safe file size formatter
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Safe file icon getter
  const getFileIcon = (filename) => {
    if (!filename) return "📄";
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const icons = {
      pdf: "📕",
      doc: "📘",
      docx: "📘",
      txt: "📄",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      mp4: "🎥",
      mp3: "🎵",
      zip: "📦",
    };
    return icons[ext] || "📄";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // This centers everything horizontally
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "20px 0",
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center", // Center header content
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "5px",
            }}
          >
            🚀 CloudChat AI
          </h1>
          <p style={{ color: "#666" }}>MERN + Ollama • Modern • Fast</p>
        </div>
      </div>

      {/* Main Content - Perfectly Centered */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          padding: "0 20px 40px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "30px",
            maxWidth: "1200px",
            width: "100%",
            justifyContent: "center", // Center the cards horizontally
          }}
        >
          {/* Cloud Drive Card */}
          <div
            style={{
              flex: "1",
              maxWidth: "500px", // Limit card width
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#333",
                justifyContent: "center", // Center the title
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>☁️</span>
              CloudDrive
            </h2>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #667eea",
                borderRadius: "15px",
                padding: "30px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: "30px",
                background: "#f8f9fa",
                transition: "all 0.3s",
                width: "100%",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📤</div>
              <p
                style={{
                  color: "#667eea",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Click to upload
              </p>
              <small style={{ color: "#999" }}>
                {uploadStatus || "Any file up to 10MB"}
              </small>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>

            {/* Files Section */}
            <h3
              style={{
                fontSize: "1.3rem",
                marginBottom: "20px",
                color: "#555",
                textAlign: "center", // Center the subtitle
              }}
            >
              Recent Files
            </h3>

            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {Array.isArray(files) && files.length > 0 ? (
                files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "15px",
                      borderBottom: "1px solid #eee",
                      borderRadius: "10px",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>
                      {getFileIcon(file?.name)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {file?.name || "Unknown file"}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#999" }}>
                        {formatFileSize(file?.size)} •{" "}
                        {file?.uploadDate
                          ? new Date(file.uploadDate).toLocaleDateString()
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    background: "#f8f9fa",
                    borderRadius: "15px",
                    width: "100%",
                  }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "15px" }}>
                    📁
                  </div>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "5px",
                      fontSize: "1.1rem",
                    }}
                  >
                    No files uploaded
                  </p>
                  <small style={{ color: "#999" }}>
                    Upload your first file to get started
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Chat Card */}
          <div
            style={{
              flex: "1",
              maxWidth: "500px", // Limit card width
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              height: "650px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
                width: "100%",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#333",
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>💬</span>
                ChatAI
              </h2>
              <span
                style={{
                  background: "#e9ecef",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  color: "#667eea",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                🤖 phi3:mini
              </span>
            </div>

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 18px",
                      borderRadius:
                        msg.sender === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      background:
                        msg.sender === "user"
                          ? "linear-gradient(135deg, #667eea, #764ba2)"
                          : "white",
                      color: msg.sender === "user" ? "white" : "#333",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div>{msg.text}</div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "5px",
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "15px 20px",
                      borderRadius: "18px 18px 18px 4px",
                      background: "white",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "5px" }}>
                      <span style={{ animation: "pulse 1s infinite" }}>●</span>
                      <span style={{ animation: "pulse 1s infinite 0.2s" }}>
                        ●
                      </span>
                      <span style={{ animation: "pulse 1s infinite 0.4s" }}>
                        ●
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                width: "100%",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), sendMessage())
                }
                placeholder="Type your message..."
                rows="1"
                style={{
                  flex: 1,
                  padding: "15px",
                  borderRadius: "25px",
                  border: "2px solid #e0e0e0",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  resize: "none",
                  outline: "none",
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "0 30px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: "transform 0.2s",
                }}
              >
                Send 📤
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
