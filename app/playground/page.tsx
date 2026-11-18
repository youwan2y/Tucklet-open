import Link from "next/link";
import { ComponentPlayground } from "@/components/ComponentPlayground";
import "@/src/styles/components.css";
import "./playground.css";

export const metadata = { title: "交互组件 · Tucklet" };

export default function PlaygroundPage() {
  return (
    <main className="playground">
      <header className="playground-header">
        <div><p className="eyebrow">TUCKLET / FRONTEND</p><h1>让阅读与输入更自然。</h1></div>
        <Link className="site-text-link" href="/">返回产品介绍 ↗</Link>
      </header>
      <p className="playground-intro">从桌面产品中提取的三个交互组件。这里使用独立示例数据，所有操作仅保留在当前页面内存中。</p>
      <ComponentPlayground />
    </main>
  );
}
