import React, { useState } from "react";
import MarkdownViewer from "./MarkdownViewer";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

const SettingPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("基本資料");
  const [copySuccess, setCopySuccess] = useState(false);
  const shareUrl = window.location.origin + "?id=27054971";
  const [markdownContent, setMarkdownContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const togglePreview = () => setIsPreviewMode(!isPreviewMode);

  const testUsers = [
    {
      id: "043860825720935",
      name: "★藍色憂鬱☆",
      gender: "Female",
      permission: 3,
      joinTime: "2021-10-12 08:23:11",
      contribution: 85,
    },
    {
      id: "043860825720936",
      name: "KillerX99",
      gender: "Male",
      permission: 4,
      joinTime: "2021-10-13 14:55:32",
      contribution: 120,
    },
    {
      id: "043860825720937",
      name: "櫻吹雪の戀",
      gender: "Female",
      permission: 2,
      joinTime: "2021-10-14 17:42:09",
      contribution: 60,
    },
    {
      id: "043860825720938",
      name: "流星o灑落",
      gender: "Male",
      permission: 3,
      joinTime: "2021-10-15 22:10:27",
      contribution: 90,
    },
    {
      id: "043860825720939",
      name: "CyberZero",
      gender: "Male",
      permission: 4,
      joinTime: "2021-10-16 06:30:55",
      contribution: 150,
    },
    {
      id: "043860825720940",
      name: "o(≧v≦)o糖糖",
      gender: "Female",
      permission: 4,
      joinTime: "2021-10-17 12:05:44",
      contribution: 110,
    },
    {
      id: "043860825720941",
      name: "Dark_Neo",
      gender: "Male",
      permission: 2,
      joinTime: "2021-10-18 18:49:38",
      contribution: 55,
    },
    {
      id: "043860825720942",
      name: "水銀燈の羽",
      gender: "Female",
      permission: 3,
      joinTime: "2021-10-19 09:17:21",
      contribution: 75,
    },
    {
      id: "043860825720943",
      name: "獨孤求敗99",
      gender: "Male",
      permission: 4,
      joinTime: "2021-10-20 15:39:07",
      contribution: 130,
    },
    {
      id: "043860825720944",
      name: "SkyDreamer77",
      gender: "Female",
      permission: 2,
      joinTime: "2021-10-21 21:14:52",
      contribution: 95,
    },
    {
      id: "043860825720945",
      name: "風雲再起",
      gender: "Male",
      permission: 4,
      joinTime: "2021-10-22 07:28:33",
      contribution: 160,
    },
    {
      id: "043860825720946",
      name: "夜神月2003",
      gender: "Male",
      permission: 2,
      joinTime: "2021-10-23 13:50:18",
      contribution: 70,
    },
    {
      id: "043860825720947",
      name: "劍魂飛影",
      gender: "Male",
      permission: 3,
      joinTime: "2021-10-24 19:33:49",
      contribution: 100,
    },
    {
      id: "043860825720948",
      name: "Angel520",
      gender: "Female",
      permission: 4,
      joinTime: "2021-10-25 10:59:27",
      contribution: 125,
    },
    {
      id: "043860825720949",
      name: "龍戰天下",
      gender: "Male",
      permission: 3,
      joinTime: "2021-10-26 16:44:03",
      contribution: 140,
    },
    {
      id: "043860825720950",
      name: "天使の微笑",
      gender: "Female",
      permission: 2,
      joinTime: "2021-10-27 11:20:15",
      contribution: 80,
    },
    {
      id: "043860825720951",
      name: "VirusKiller",
      gender: "Male",
      permission: 4,
      joinTime: "2021-10-28 17:02:45",
      contribution: 135,
    },
    {
      id: "043860825720952",
      name: "紫龍天殤",
      gender: "Male",
      permission: 3,
      joinTime: "2021-10-29 22:30:30",
      contribution: 115,
    },
    {
      id: "043860825720953",
      name: "o○夢幻泡影○o",
      gender: "Female",
      permission: 1,
      joinTime: "2021-10-30 08:55:19",
      contribution: 50,
    },
    {
      id: "043860825720954",
      name: "烈焰之翼",
      gender: "Male",
      permission: 2,
      joinTime: "2021-10-31 15:40:10",
      contribution: 90,
    },
  ];

  const menuItems = [
    { id: "基本資料", label: "基本資料" },
    { id: "公告", label: "公告" },
    { id: "會員管理", label: "會員管理" },
    { id: "訪問許可權", label: "訪問許可權" },
    { id: "會員申請管理", label: "會員申請管理" },
    { id: "黑名單管理", label: "黑名單管理" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "基本資料":
        return (
          <>
            <div className="flex mb-8">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <label className="w-20 text-right text-sm">名稱</label>
                    <input
                      type="text"
                      value="@笑臉馴江湖OL - 過見未來"
                      className="flex-1 p-1 border rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="w-20 text-right text-sm">ID</label>
                    <input
                      type="text"
                      value="27054971"
                      className="w-32 p-1 border rounded text-sm"
                      disabled
                    />
                  </div>
                  <div className="flex items-start gap-4 mb-2">
                    <label className="w-20 text-right text-sm">口號</label>
                    <textarea className="flex-1 p-2 border rounded text-sm h-20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm">類型</label>
                    <select className="p-1 border rounded text-sm">
                      <option>遊戲</option>
                      <option>音樂</option>
                      <option>原神</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm">等級</label>
                    <input
                      type="number"
                      value="8"
                      className="w-20 p-1 border rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm">創建時間</label>
                    <input
                      type="text"
                      value="2014-10-11 19:15:44"
                      className="w-48 p-1 border rounded text-sm"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20 text-right text-sm">時數統計</label>
                    <input
                      type="text"
                      value="4157"
                      className="w-20 p-1 border rounded text-sm"
                    />
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>
              </div>

              {/* 頭像區域 */}
              <div className="w-48 flex flex-col items-center">
                <img
                  src="/logo_server_def.png"
                  alt="Avatar"
                  className="w-32 h-32 border-2 border-gray-300 mb-2"
                />
                <button className="px-4 py-1 bg-blue-50 hover:bg-blue-100 rounded text-sm">
                  更換頭像
                </button>
              </div>
            </div>

            {/* 網址和介紹 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">網址 {shareUrl}</label>
                <button
                  onClick={handleCopy}
                  className={`text-sm transition-colors ${
                    copySuccess
                      ? "text-green-600 hover:text-green-700"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {copySuccess ? "已複製!" : "複製"}
                </button>
              </div>

              <div>
                <label className="block text-sm mb-1">介紹</label>
                <textarea className="w-full h-32 p-2 border rounded text-sm" />
              </div>
            </div>
          </>
        );
      case "公告":
        return (
          <div className="space-y-4">
            {/* 工具欄 */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">公告編輯</label>
              <button
                onClick={togglePreview}
                className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 rounded"
              >
                {isPreviewMode ? "編輯" : "預覽"}
              </button>
            </div>

            {/* 內容區域 */}
            <div className="border rounded p-4">
              {isPreviewMode ? (
                // 預覽模式
                <div className="prose prose-sm max-w-none">
                  <MarkdownViewer markdownText={markdownContent} />
                </div>
              ) : (
                // 編輯模式
                <textarea
                  className="w-full p-2 rounded text-sm min-h-[200px] font-mono"
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="在此輸入 Markdown 內容..."
                />
              )}
            </div>

            {/* Markdown 語法提示 */}
            {!isPreviewMode && (
              <div className="text-xs text-gray-500">
                支援 Markdown 語法：
                <span className="font-mono">
                  **粗體**, *斜體*, # 標題, - 列表, ```程式碼```,
                  [連結](https://)
                </span>
              </div>
            )}
          </div>
        );
      case "會員管理":
        return (
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center mb-[2rem]">
              <span>會員:{testUsers.length}</span>
              <div className="flex justify-end items-center border">
                <Search className="text-gray-300 h-[1.5rem] w-[2rem]" />
                <input
                  type="text"
                  placeholder="輸入關鍵字或ID搜尋"
                  className="item-right w-[15rem] text-left outline-none"
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <ChevronUp className="hover:bg-gray-200 text-gray-400 bg-gray-100 border-l-[0.15rem] h-[2.5rem] w-[2rem]" />
                <ChevronDown className="hover:bg-gray-200 text-gray-400 bg-gray-100 border-l-[0.15rem] h-[2.5rem] w-[2rem]" />
              </div>
            </div>
            <div className="flex flex-col items-center max-h-[29rem] overflow-y-auto">
              <table className="text-left border-2 border-gray-300 items-center min-w-full overflow-y-auto">
                <thead className="sticky top-0 border-2">
                  <tr className="bg-gray-200 border-b-[0.15rem] border-gray-300">
                    <th className="p-[0.5rem] border-r-[0.15rem] border-gray-300">
                      頭像
                    </th>
                    <th className="p-[0.5rem] border-r-[0.15rem] border-gray-300">
                      身份
                    </th>
                    <th className="p-[0.5rem] border-r-[0.15rem] border-gray-300">
                      貢獻值
                    </th>
                    <th className="p-[0.5rem]">加入時間</th>
                  </tr>
                </thead>
                <tbody>
                  {testUsers.map(
                    (testUser) =>
                      (testUser.name.includes(searchText) ||
                        testUser.id.includes(searchText) ||
                        searchText === "") && (
                        <tr
                          key={testUser.id}
                          className="border-b-[0.15rem] border-gray-300"
                        >
                          <td className="pl-[0.5rem] flex items-center border-r-[0.15rem] border-gray-300">
                            <img
                              src={`/channel/UserIcons${testUser.gender}_${testUser.permission}_14x16.png`}
                              className="w-[1rem] h-[1rem]"
                            />
                            <span className="pl-[0.5rem] text-cyan-600">
                              {testUser.name}
                            </span>
                          </td>
                          <td className="pl-[0.5rem] border-r-[0.15rem] border-gray-300">
                            {(() => {
                              switch (testUser.permission) {
                                case 1:
                                  return "會員";
                                case 2:
                                  return "頻道管理員";
                                case 3:
                                  return "群管理員";
                                case 4:
                                  return "群創建者";
                              }
                            })()}
                          </td>
                          <td className="pl-[0.5rem] border-r-[0.15rem] border-gray-300">
                            {testUser.contribution}
                          </td>
                          <td className="pl-[0.5rem]">{testUser.joinTime}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
            <span className="text-right">右鍵可以進行處理</span>
          </div>
        );
      case "訪問許可權":
        return <div>訪問許可權內容</div>;
      case "會員申請管理":
        return <div>會員申請管理內容</div>;
      case "黑名單管理":
        return <div>黑名單管理內容</div>;
      default:
        return null;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      id="modal"
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div className="flex flex-col w-[800] h-[700] bg-white rounded shadow-lg overflow-hidden transform outline-g">
        {/* 頂部標題列 */}
        <div className="bg-blue-600 p-2 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/rc_logo_small.png" alt="Logo" className="w-5 h-5" />
            <span>群組設定</span>
          </div>
        </div>

        {/* 左側選單欄 */}
        <div className="flex flex-1 min-h-0">
          <div className="w-40 bg-blue-50 p-4 space-y-2 text-sm">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`cursor-pointer rounded transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-blue-100/50"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* 右側內容區 */}
          <div className="flex-1 p-6">{renderContent()}</div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex justify-end gap-2 p-4 bg-gray-50">
          <button
            className="px-6 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onClose()}
          >
            保存
          </button>
          <button
            className="px-6 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => onClose()}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
