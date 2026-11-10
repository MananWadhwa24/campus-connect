import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { Activity, Wifi, WifiOff, ChevronUp, ChevronDown } from "lucide-react";

function ConnectionStatusPanel() {
  const { isConnected, onlineCount, lastEvent, reconnectCount } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {/* Collapsed Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] text-[#ECE8E1] px-3.5 py-2 rounded-full shadow-2xl hover:border-[#79C043] transition"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-[#79C043] animate-pulse" : "bg-red-500"
          }`}
        />
        <span className="font-semibold tracking-wider text-[11px]">
          {onlineCount} {onlineCount === 1 ? "STUDENT" : "STUDENTS"} ONLINE
        </span>
        {isOpen ? (
          <ChevronDown size={14} className="text-[#8D9099]" />
        ) : (
          <ChevronUp size={14} className="text-[#8D9099]" />
        )}
      </button>

      {/* Expanded Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-[#1C1E22] border border-[rgba(236,232,225,0.15)] rounded-2xl p-4 shadow-2xl text-[#ECE8E1] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(236,232,225,0.1)]">
            <span className="text-[#8D9099] uppercase text-[10px] tracking-widest font-bold">
              Real-Time Node Diagnostics
            </span>
            {isConnected ? (
              <span className="flex items-center gap-1 text-[#79C043] text-[10px] font-bold">
                <Wifi size={12} /> CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 text-[10px] font-bold">
                <WifiOff size={12} /> DISCONNECTED
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#131417] p-2.5 rounded-lg border border-[rgba(236,232,225,0.06)]">
              <p className="text-[#8D9099] text-[10px]">Unique Active</p>
              <p className="text-base font-bold text-[#79C043] mt-0.5">
                {onlineCount}
              </p>
            </div>

            <div className="bg-[#131417] p-2.5 rounded-lg border border-[rgba(236,232,225,0.06)]">
              <p className="text-[#8D9099] text-[10px]">Transport</p>
              <p className="text-sm font-semibold text-[#ECE8E1] mt-0.5">
                WebSocket / Polling
              </p>
            </div>
          </div>

          <div className="text-[10px] text-[#8D9099] space-y-1 bg-[#131417] p-2.5 rounded-lg border border-[rgba(236,232,225,0.06)]">
            <div className="flex justify-between">
              <span>Last Event:</span>
              <span className="text-[#ECE8E1] font-medium">
                {lastEvent ? `${lastEvent.type} @ ${lastEvent.time}` : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reconnect Attempts:</span>
              <span className="text-[#ECE8E1] font-medium">{reconnectCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Auth Session:</span>
              <span className="text-[#79C043] font-medium">Verified JWT</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionStatusPanel;
