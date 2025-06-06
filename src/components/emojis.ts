export interface Emoji {
  id: number;
  alt: string;
  path: string;
}

const emojis: Emoji[] = [
  { id: 0, alt: "微笑", path: "/smiles/1.gif" },
  { id: 1, alt: "開懷笑", path: "/smiles/2.gif" },
  { id: 2, alt: "眨眼", path: "/smiles/3.gif" },
  { id: 3, alt: "驚訝", path: "/smiles/4.gif" },
  { id: 4, alt: "吐舌笑臉", path: "/smiles/5.gif" },
  { id: 5, alt: "生氣", path: "/smiles/6.gif" },
  { id: 6, alt: "怕怕", path: "/smiles/7.gif" },
  { id: 7, alt: "尷尬", path: "/smiles/8.gif" },
  { id: 8, alt: "難過", path: "/smiles/9.gif" },
  { id: 9, alt: "哭泣", path: "/smiles/10.gif" },
  { id: 10, alt: "失望", path: "/smiles/11.gif" },
  { id: 11, alt: "困了", path: "/smiles/12.gif" },
  { id: 12, alt: "好好笑", path: "/smiles/13.gif" },
  { id: 13, alt: "啵", path: "/smiles/14.gif" },
  { id: 14, alt: "電到了", path: "/smiles/15.gif" },
  { id: 15, alt: "汗", path: "/smiles/16.gif" },
  { id: 16, alt: "流口水", path: "/smiles/17.gif" },
  { id: 17, alt: "我吐", path: "/smiles/18.gif" },
  { id: 18, alt: "???", path: "/smiles/19.gif" },
  { id: 19, alt: "噓", path: "/smiles/20.gif" },
  { id: 20, alt: "不說", path: "/smiles/21.gif" },
  { id: 21, alt: "色迷迷", path: "/smiles/22.gif" },
  { id: 22, alt: "可愛", path: "/smiles/23.gif" },
  { id: 23, alt: "YEAH", path: "/smiles/24.gif" },
  { id: 24, alt: "崩潰", path: "/smiles/25.gif" },
  { id: 25, alt: "鄙視你", path: "/smiles/26.gif" },
  { id: 26, alt: "開心", path: "/smiles/27.gif" },
  { id: 28, alt: "暈", path: "/smiles/29.gif" },
  { id: 29, alt: "挖鼻孔", path: "/smiles/30.gif" },
  { id: 30, alt: "撒嬌", path: "/smiles/31.gif" },
  { id: 31, alt: "鼓掌", path: "/smiles/32.gif" },
  { id: 32, alt: "害羞", path: "/smiles/33.gif" },
  { id: 33, alt: "欠揍", path: "/smiles/34.gif" },
  { id: 34, alt: "飛吻", path: "/smiles/35.gif" },
  { id: 35, alt: "大哭", path: "/smiles/36.gif" },
  { id: 36, alt: "偷偷笑", path: "/smiles/37.gif" },
  { id: 37, alt: "送花給你", path: "/smiles/38.gif" },
  { id: 38, alt: "拍桌子", path: "/smiles/39.gif" },
  { id: 39, alt: "拜拜", path: "/smiles/40.gif" },
  { id: 40, alt: "抓狂", path: "/smiles/41.gif" },
  { id: 41, alt: "扭捏", path: "/smiles/42.gif" },
  { id: 42, alt: "嗷嗷嗷", path: "/smiles/43.gif" },
  { id: 43, alt: "啾啾", path: "/smiles/44.gif" },
  { id: 44, alt: "耍酷", path: "/smiles/45.gif" },
  { id: 45, alt: "睫毛彎彎", path: "/smiles/46.gif" },
  { id: 46, alt: "好愛你", path: "/smiles/47.gif" },
  { id: 47, alt: "NO", path: "/smiles/48.gif" },
  { id: 48, alt: "YES", path: "/smiles/49.gif" },
  { id: 49, alt: "握個手", path: "/smiles/50.gif" },
  { id: 50, alt: "便便", path: "/smiles/51.gif" },
  { id: 51, alt: "砸死你", path: "/smiles/52.gif" },
  { id: 52, alt: "工作忙", path: "/smiles/53.gif" },
  { id: 53, alt: "阿彌陀佛", path: "/smiles/54.gif" },
  { id: 54, alt: "玫瑰", path: "/smiles/55.gif" },
  { id: 55, alt: "約會", path: "/smiles/56.gif" },
  { id: 56, alt: "西瓜", path: "/smiles/57.gif" },
  { id: 57, alt: "禮物", path: "/smiles/58.gif" },
  { id: 58, alt: "音樂", path: "/smiles/59.gif" },
  { id: 59, alt: "抱抱", path: "/smiles/60.gif" },
  { id: 60, alt: "帶血的刀", path: "/smiles/61.gif" },
] as const;

export default emojis;