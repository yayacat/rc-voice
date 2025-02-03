import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  Volume1,
  Volume,
  VolumeX,
  Mic,
  MicOff,
  Settings,
  X,
  Minus,
  Square,
  ArrowBigDown,
} from "lucide-react";
// Components
import useWebSocket from "@/hooks/useWebSocket";
import EmojiGrid from "./EmojiGrid";
import MarkdownViewer from "./MarkdownViewer";
import MessageViewer from "./MessageViewer";
import ChannelViewer from "./ChannelViewer";
import SettingPage from "./SettingPage";
import PersonalSettingPage from "./PersonalSettingPage";

const RCVoiceApp = () => {
  // Setting Control
  const [isPersonalSettingOpen, setIsPersonalSettingOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // Volume Control
  const [volume, setVolume] = useState(100);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeRef = useRef(null);

  // User State Control
  const [userId, setUserId] = useState("1");
  const [userState, setUserState] = useState("online");
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const stateIcons = {
    online: "/user_state_online.png",
    dnd: "/user_state_dnd.png",
    idle: "/user_state_idle.png",
    gn: "/user_state_gn.png",
  };

  // Server Control
  const [serverId, setServerId] = useState(null);

  useEffect(() => {
    const urlParm = new URLSearchParams(window.location.search);
    const serverId = urlParm.get("serverId");
    const userId = JSON.parse(localStorage.getItem("userData")).id;

    setUserId(userId);
    setServerId(serverId);
  }, []);

  // Socket Control
  const [connectionStatus, setConnectionStatus] = useState("");
  const { socketInstance, isConnected, error } = useWebSocket(userId, serverId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socketInstance) return;

    setConnectionStatus(isConnected ? "已連接" : "連接中...");

    const handleServerData = (data) => {
      console.log("Recieve server data: ", data);
      setServer(data.server);
      setChannels(data.channels || []);
      setUsers(data.users || []);
      setAnnouncement(data.server.announcement || "");
      setMessages(data.messages || []);
    };
    const handleMessageData = (messages) => {
      console.log("Recieve message data: ", messages);
      setMessages(messages);
    };
    const handleChannelData = (channels) => {
      console.log("Recieve channel data: ", channels);
      setChannels(channels);
    };
    const handleError = (error) => {
      alert(`錯誤: ${error.message}`);
      setConnectionStatus("連接錯誤");
    };

    socketInstance.on("serverData", handleServerData);
    socketInstance.on("chatMessage", handleMessageData);
    socketInstance.on("channel", handleChannelData);
    socketInstance.on("error", handleError);

    return () => {
      socketInstance.off("serverData", handleServerData);
      socketInstance.off("chatMessage", handleMessageData);
      socketInstance.off("channel", handleChannelData);
      socketInstance.off("error", handleError);
    };
  }, [socketInstance, serverId, isConnected, userId]);

  const handleSendMessage = (message) => {
    try {
      socketInstance?.emit("chatMessage", {
        serverId,
        message,
      });
    } catch (error) {
      console.error("發送消息失敗:", error);
    }
  };
  const handleAddChannel = (channel) => {
    try {
      socketInstance?.emit("addChannel", {
        serverId,
        channel,
      });
    } catch (error) {
      console.error("新增頻道失敗:", error);
    }
  };
  const handleEditChannel = (channelId, channel) => {
    try {
      socketInstance?.emit("editChannel", {
        serverId,
        channelId,
        channel,
      });
    } catch (error) {
      console.error("編輯頻道/類別失敗:", error);
    }
  };
  const handleDeleteChannel = (channelId) => {
    try {
      socketInstance?.emit("deleteChannel", { serverId, channelId });
    } catch (error) {
      console.error("刪除頻道/類別失敗:", error);
    }
  };

  // Sidebar Control
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);
  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);
  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const maxWidth = window.innerWidth * 0.3;
        const newWidth = Math.max(
          220,
          Math.min(mouseMoveEvent.clientX, maxWidth)
        );
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Input Control
  const [messageInput, setMessageInput] = useState("");
  const maxContentLength = 2000;

  // Mic Control
  const [isMicOn, setIsMicOn] = useState(false);

  // Emoji Picker Control
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Data (Request from API)
  const [server, setServer] = useState();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="h-screen flex flex-col bg-background font-['SimSun']">
      {isPersonalSettingOpen && (
        <PersonalSettingPage
          visible={isPersonalSettingOpen}
          onClose={() => setIsPersonalSettingOpen(false)}
          user={users[userId]}
        />
      )}
      {isSettingOpen && (
        <SettingPage
          visible={isSettingOpen}
          onClose={() => setIsSettingOpen(false)}
        />
      )}
      {/* Top Navigation */}
      <div className="bg-blue-600 p-2 flex items-center justify-between text-white text-sm flex-none">
        <div className="flex items-center space-x-2">
          <img
            src="/rc_logo_small.png"
            alt="RiceCall"
            className="w-6 h-6 select-none"
          />
          <span className="text-xs font-bold text-black select-none">
            秋天的幻滅
          </span>
          <div className="flex items-center">
            <img
              src={stateIcons[userState]}
              alt="User State"
              className="w-3.5 h-3.5 select-none"
            />
            <select
              value={userState}
              onChange={(e) => setUserState(e.target.value)}
              className="bg-transparent text-white text-xs appearance-none hover:bg-blue-700 p-1 rounded cursor-pointer focus:outline-none select-none"
            >
              <option value="online" className="bg-blue-600">
                線上
              </option>
              <option value="dnd" className="bg-blue-600">
                勿擾
              </option>
              <option value="idle" className="bg-blue-600">
                暫離
              </option>
              <option value="gn" className="bg-blue-600">
                離線
              </option>
            </select>
          </div>
          {connectionStatus && (
            <div className="px-3 py-1 bg-gray-100 text-xs text-gray-600">
              {connectionStatus}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="hover:bg-blue-700 p-1 rounded">
            <Minus size={16} />
          </button>
          <button className="hover:bg-blue-700 p-1 rounded">
            <Square size={16} />
          </button>
          <button className="hover:bg-blue-700 p-1 rounded">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div
          className="flex flex-col min-h-0 min-w-0 w-64 bg-white border-r text-sm"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Left side: Profile image and info */}
          <div className="flex items-center justify-between p-2 border-b mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={server?.icon ?? "/im/IMLogo.png"}
                alt="User Profile"
                className="w-14 h-14 shadow border-2 border-[#A2A2A2] select-none"
              />
              <div>
                <div className="text-gray-700">{server?.name ?? ""} </div>
                <div className="flex flex-row items-center gap-1">
                  <img
                    src="/channel/ID.png"
                    alt="User Profile"
                    className="w-3.5 h-3.5 select-none"
                  />
                  <div className="text-xs text-gray-500">
                    {server?.id ?? ""}
                  </div>
                  <img
                    src="/channel/member.png"
                    alt="User Profile"
                    className="w-3.5 h-3.5 select-none"
                  />
                  <div className="text-xs text-gray-500 select-none">
                    {Object.keys(users).length ?? ""}
                  </div>
                  {/* Right side: Settings button */}
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setIsSettingOpen(true)}
                  >
                    <Settings size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Channel */}
          <div className="flex flex-row p-2 items-center gap-1">
            <img
              src="/channel/NetworkStatus_5.png"
              alt="User Profile"
              className="w-6 h-6 select-none"
            />
            <div className="text-gray-500">{"{Current Channel}"}</div>
          </div>
          {/* Channel List */}
          {channels && (
            <ChannelViewer
              channels={channels}
              users={users}
              server={server}
              handleAddChannel={handleAddChannel}
              handleEditChannel={handleEditChannel}
              handleDeleteChannel={handleDeleteChannel}
            />
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="w-0.5 cursor-col-resize bg-gray-200 transition-colors"
          onMouseDown={startResizing}
        />

        {/* Right Content */}
        <div className="flex flex-1 flex-col min-h-0 min-w-0">
          {/* Announcement Area */}
          {announcement && (
            <div className="flex flex-[2] overflow-y-auto border-b bg-gray-50 p-3 mb-1">
              <MarkdownViewer markdownText={announcement} />
            </div>
          )}
          {/* Messages Area */}
          <div className="flex flex-[5] flex-col overflow-y-auto p-3 min-w-0 max-w-full">
            {messages.length > 0 && (
              <MessageViewer
                messages={messages}
                users={users}
                server={server}
              />
            )}
          </div>
          {/* Input Area */}
          <div className="flex flex-[1] p-3">
            <div className="flex flex-1 flex-row justify-flex-start p-1 border rounded-lg">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-7 h-7 p-1 hover:bg-gray-100 rounded transition-colors z-10"
              >
                <img src="/channel/FaceButton_5_18x18.png" alt="Emoji" />
                <EmojiGrid
                  isOpen={showEmojiPicker}
                  onEmojiSelect={(emojiTag) => {
                    const content = messageInput + emojiTag;
                    if (content.length > maxContentLength) return;
                    setMessageInput(content);
                    setShowEmojiPicker(false);

                    const input = document.querySelector("textarea");
                    if (input) input.focus();
                  }}
                />
              </button>
              <textarea
                className={`w-full p-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500
                ${!isConnected ? "bg-gray-100 cursor-not-allowed" : ""}
                ${
                  messageInput.length >= maxContentLength
                    ? "border-red-500"
                    : ""
                }`}
                rows="2"
                placeholder={isConnected ? "輸入訊息..." : "連接中..."}
                value={messageInput}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.length > maxContentLength) return;
                  setMessageInput(input);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isConnected || !messageInput.trim()) return;
                    handleSendMessage({
                      id: "",
                      sender: userId,
                      content: messageInput,
                      timestamp: new Date().valueOf(),
                    });
                    setMessageInput("");
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData("text");
                  if (text.length + messageInput.length > maxContentLength)
                    return;
                  setMessageInput((prev) => prev + text);
                }}
                maxLength={maxContentLength}
                disabled={!isConnected}
                aria-label="訊息輸入框"
              />{" "}
              <div className="text-xs text-gray-400 self-end ml-2">
                {messageInput.length}/{maxContentLength}
              </div>
            </div>
          </div>
          {/* Bottom Controls */}
          <div className="flex-none bg-background border-t text-sm border-foreground/10 bg-linear-to-b from-violet-500 to-fuchsia-500">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 p-5">
                <span>自由發言</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ArrowBigDown size={16} className="text-foreground" />
                </button>
              </div>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`outline outline-2 outline-gray-300 rounded flex items-center justify-between p-2 hover:bg-foreground/10 transition-colors w-32`}
              >
                <img
                  src={
                    isMicOn
                      ? "/channel/icon_speaking_vol_5_24x30.png"
                      : "/channel/icon_mic_state_1_24x30.png"
                  }
                  alt="Mic"
                />
                <span
                  className={`text-lg font-bold ${
                    isMicOn ? "text-[#B9CEB7]" : "text-[#6CB0DF]"
                  }`}
                >
                  {isMicOn ? "已拿麥" : "拿麥發言"}
                </span>
              </button>
              <div className="flex items-center space-x-2 p-5">
                <div className="relative" ref={volumeRef}>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  >
                    {volume === 0 && (
                      <VolumeX size={16} className="text-foreground" />
                    )}
                    {volume > 0 && volume <= 33 && (
                      <Volume size={16} className="text-foreground" />
                    )}
                    {volume > 33 && volume <= 66 && (
                      <Volume1 size={16} className="text-foreground" />
                    )}
                    {volume > 66 && (
                      <Volume2 size={16} className="text-foreground" />
                    )}
                  </button>

                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2 w-[40px]">
                      <div className="h-32 flex items-center justify-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="h-24 -rotate-90 transform origin-center
        appearance-none bg-transparent cursor-pointer
        [&::-webkit-slider-runnable-track]:rounded-full
        [&::-webkit-slider-runnable-track]:bg-gray-200
        [&::-webkit-slider-runnable-track]:h-3
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-blue-600
        [&::-webkit-slider-thumb]:border-0
        [&::-webkit-slider-thumb]:transition-all
        [&::-webkit-slider-thumb]:hover:bg-blue-700"
                        />
                      </div>
                      <div className="text-center text-xs text-gray-500">
                        {volume}%
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsMicOn(!isMicOn);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isMicOn ? (
                    <Mic size={16} className="text-foreground" />
                  ) : (
                    <MicOff size={16} className="text-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setIsPersonalSettingOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Settings size={16} className="text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCVoiceApp;
