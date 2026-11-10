import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Send, User, MessageSquare, Radio, Sparkles, AlertCircle } from "lucide-react";

function Chat() {
  const { user } = useAuth();
  const { socket, onlineCount, isConnected } = useSocket();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial message history from MongoDB via REST
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get("/chat/messages");
        if (res.data?.success && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Chat history load error:", err);
        setError("Failed to load message history from database.");
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 200);
      }
    };

    fetchHistory();
  }, []);

  // Socket event listeners for real-time messages & typing
  useEffect(() => {
    if (!socket) return;

    // Receive new real-time message
    const handleNewMessage = (newMsg) => {
      setMessages((prev) => {
        // Prevent duplicate rendering
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);
    };

    // Receive history if socket reconnects
    const handleHistory = (history) => {
      if (Array.isArray(history)) {
        setMessages(history);
        setTimeout(scrollToBottom, 100);
      }
    };

    // Typing indicators
    const handleTypingStart = ({ userId, name }) => {
      if (userId !== user?._id) {
        setTypingUsers((prev) => new Set(prev).add(name));
      }
    };

    const handleTypingStop = ({ userId, name }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:history", handleHistory);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:history", handleHistory);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, user]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!socket || !user) return;

    // Emit typing start
    socket.emit("typing:start");

    // Clear previous timeout and set typing stop after 2s of inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop");
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket?.emit("typing:stop");
    }

    const payload = { text: inputText.trim() };

    // Send via Socket.IO if connected, else fallback to REST API
    if (socket && isConnected) {
      socket.emit("message:send", payload);
    } else {
      API.post("/chat/messages", payload).then((res) => {
        if (res.data?.success && res.data.message) {
          setMessages((prev) => [...prev, res.data.message]);
          setTimeout(scrollToBottom, 100);
        }
      });
    }

    setInputText("");
  };

  return (
    <div className="min-h-screen bg-[#131417] text-[#ECE8E1] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col">
        <BackToDashboard />

        {/* Lounge Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[rgba(236,232,225,0.12)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#79C043] font-bold">
              02 // REAL-TIME NETWORK
            </span>
            <h1 className="font-display text-3xl font-black text-[#ECE8E1] mt-1">
              CAMPUS COMMUNITY LOUNGE.
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-full bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-[#79C043] animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="text-[#8D9099]">
                <strong className="text-[#ECE8E1]">{onlineCount}</strong> ONLINE
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono p-3.5 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Chat Feed Card */}
        <div className="bg-[#1C1E22] border border-[rgba(236,232,225,0.12)] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl min-h-[500px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loading ? (
              <div className="text-center py-20 font-mono text-xs text-[#8D9099]">
                <span className="w-2 h-2 rounded-full bg-[#79C043] animate-ping inline-block mr-2" />
                Synchronizing chat messages from MongoDB...
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isYou =
                  user &&
                  (msg.sender === user._id ||
                    msg.sender?._id === user._id ||
                    msg.senderName === user.name);

                return (
                  <div
                    key={msg._id || msg.createdAt}
                    className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                        isYou
                          ? "bg-[#79C043] text-[#131417] rounded-tr-none font-medium"
                          : "bg-[#131417] text-[#ECE8E1] border border-[rgba(236,232,225,0.1)] rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 font-mono text-[11px]">
                        <span
                          className={`font-bold ${
                            isYou ? "text-[#131417]/80" : "text-[#79C043]"
                          }`}
                        >
                          {isYou ? "YOU" : msg.senderName}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isYou ? "text-[#131417]/60" : "text-[#8D9099]"
                          }`}
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-24 font-mono text-xs text-[#8D9099]">
                <MessageSquare size={32} className="mx-auto text-[#79C043] mb-3 opacity-60" />
                <p className="text-sm font-bold text-[#ECE8E1]">Campus Lounge Initialized</p>
                <p className="mt-1">Be the first to post a message in the community!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="px-6 py-2 bg-[#131417]/60 border-t border-[rgba(236,232,225,0.06)] font-mono text-[11px] text-[#79C043] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#79C043] animate-pulse" />
              <span>
                {Array.from(typingUsers).join(", ")} {typingUsers.size === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 bg-[#131417] border-t border-[rgba(236,232,225,0.12)] flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Broadcast a message to the campus lounge..."
              className="flex-1 bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-xl py-3 px-4 text-xs font-mono text-[#ECE8E1] placeholder:text-[#8D9099]/50 focus:outline-none focus:border-[#79C043]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#79C043] hover:bg-[#8ade4e] text-[#131417] font-mono text-xs font-bold uppercase transition disabled:opacity-40 flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Chat;
