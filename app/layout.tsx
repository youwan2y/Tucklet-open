import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tucklet · 个人知识管理 Agent",
  description: "Tucklet 是你的个人知识管理 Agent。查看 macOS 桌面端实拍，了解如何浏览笔记、跟进待办和使用 Agent。",
  icons: { icon: "/tucklet-mark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body>{children}</body>
    </html>
  );
}
