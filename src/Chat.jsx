import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users } from 'lucide-react';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
const Chat = ({ rideId, rideInfo, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem('username');

const stompRef = useRef(null);
console.log('Chat render');


useEffect(() => {
  if(!rideId) return;
  if (stompRef.current) return; // 🔒 prevent double connect

  const token = localStorage.getItem('token');

  const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  debug: console.log,
  onConnect: () => {
    console.log('STOMP connected ✅');
    setConnected(true);

    client.subscribe(`/topic/ride/${rideId}`, (message) => {
      const data = JSON.parse(message.body);
      setMessages(prev => [...prev, {
        ...data,
        isOwn: data.sender === currentUser
      }]);
    });
  },
  onWebSocketClose: () => {
    console.log('WebSocket closed');
    setConnected(false);
  }
});

client.activate();
stompRef.current = client;

  return () => {
    stompRef.current?.deactivate(); // ✅ ONLY THIS
    stompRef.current = null;
  };
}, [rideId]); // 🚫 NO DEPENDENCIES

useEffect(()=>{
  const fetchHistory=async()=>{
    const token=localStorage.getItem('token');
    const res=await fetch(
      `http://localhost:8080/chat/history/${rideId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );
    if(res.ok){
      const history=await res.json();
      setMessages(
        history.map(msg=>({
          ...msg,
          isOwn: msg.senderId===currentUser
        }))
      );
    }
  };
  fetchHistory();
},[rideId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const sendMessage = () => {
  if (!inputMessage.trim() ) return;
   if (!stompRef.current?.connected) {
    console.warn('STOMP not connected');
    return;
  }
  stompRef.current.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({
      rideId,
     // sender: currentUser,
     // senderName: currentUser.split('@')[0],
      content: inputMessage.trim(),
     // timestamp: new Date().toISOString(),
    }),
  });

  setInputMessage('');
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 w-full max-w-3xl h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">
                Ride Group Chat
              </h3>
              <p className="text-xs text-neutral-400">
                {rideInfo?.from} → {rideInfo?.to}
              </p>
            </div>
            <div className="text-right mr-4">
              <p className="text-xs text-neutral-400">
                {participants.length > 0 ? `${participants.length} members` : ''}
              </p>
              <p className="text-xs text-neutral-400">
                {connected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Participants Bar (Optional - Collapsible) */}
        {participants.length > 0 && (
          <div className="px-4 py-2 bg-neutral-800/50 border-b border-neutral-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-400">Members:</span>
              {participants.map((participant, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full"
                >
                  {participant.name || participant}
                  {participant === currentUser && ' (You)'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-neutral-500 mt-20">
              <Users className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
              <p className="text-lg font-semibold">Welcome to the ride group!</p>
              <p className="text-sm">Chat with your driver and co-passengers</p>
            </div>
          ) : (
            messages.map((message) => {
              // System messages (join/leave notifications)
              if (message.type === 'system') {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="bg-neutral-800/50 text-neutral-400 text-xs px-4 py-2 rounded-full">
                      {message.content}
                    </div>
                  </div>
                );
              }

              // Regular chat messages
              return (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    {!message.isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {message.senderName || message.sender}
                      </p>
                    )}
                    <p className="break-words">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-neutral-800">
          {!connected && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 text-sm p-2 rounded-lg mb-2">
              ⚠️ Not connected to chat server. Reconnecting...
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message the group..."
              disabled={!connected}
              className="flex-1 bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            This is a group chat for all passengers and the driver
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;