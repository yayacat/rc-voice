import { useRef, useLayoutEffect } from "react";

import MarkdownViewer from "./MarkdownViewer";

const MessageViewer = ({ messages, users, server }) => {
  const messagesEndRef = useRef(null);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  const formatMsgTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageDate = new Date(parseInt(timestamp));
    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const timeString = messageDate.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (messageDay.getTime() === today.getTime()) {
      return timeString;
    } else if (messageDay.getTime() === yesterday.getTime()) {
      return `昨天 ${timeString}`;
    } else {
      return `${messageDate.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} ${timeString}`;
    }
  };

  // Group messages by user and time window
  const groupMessages = (message) => {
    const sorted = [...message].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const grouped = sorted.reduce((acc, message) => {
      const lastGroup = acc[acc.length - 1];
      const nearTime =
        lastGroup &&
        new Date(message.timestamp) - new Date(lastGroup.timestamp) <=
          5 * 60 * 1000;
      const sameSender = lastGroup && message.sender === lastGroup.sender;

      if (sameSender && nearTime) {
        lastGroup.messages.push(message);
      } else {
        acc.push({
          id: message.id,
          sender: message.sender,
          timestamp: message.timestamp,
          messages: [message],
        });
      }

      return acc;
    }, []);

    return grouped;
  };

  const renderMessage = (group) => {
    return (
      <div key={group.id} className="flex items-start space-x-1 mb-1">
        <img
          src={`/channel/UserIcons${users[group.sender].gender}_${
            users[group.sender].permissions[server.id]
          }_14x16.png`}
          alt={group.sender.id}
          className="select-none flex-shrink-0 mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-bold text-gray-900">
              {users[group.sender].name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {formatMsgTimestamp(group.timestamp)}
            </span>
          </div>

          <div className="text-gray-700">
            {group.messages.map((message) => (
              <div key={message.id} className="break-words">
                <MarkdownViewer markdownText={message.content} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const groupedMessages = groupMessages(messages);
  return (
    <>
      {groupedMessages.map((group) => renderMessage(group))}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageViewer;
