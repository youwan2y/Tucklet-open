"use client";

import { useMemo, useRef, useState } from "react";
import { NoteFontSizeControl } from "@/src/components/NoteFontSizeControl";
import { NoteOutlineRail } from "@/src/components/editor-panel/NoteOutlineRail";
import { buildNoteOutline } from "@/src/components/editor-panel/outlineModel";
import { KanbanDraftInput } from "@/src/components/kanban/KanbanDraftInput";

const sections = [
  { level: 1, title: "一份可以继续使用的笔记", text: "记录只是开始。阅读时找到关键段落，整理时保留上下文，行动时把想法变成可以推进的事项。" },
  { level: 2, title: "先把信息放在一起", text: "把活动安排、讨论结论与待办放进同一个工作空间。保持清楚的标题层级，让长文也有容易辨认的结构。" },
  { level: 3, title: "保留来源与问题", text: "区分已经确认的信息和仍待确认的问题。回看时知道结论来自哪里，也知道下一步应该向谁核实。" },
  { level: 2, title: "用大纲找回阅读位置", text: "右侧短线代表当前文档的标题。滚动正文时更新当前章节，悬停或聚焦短线可以展开目录，点击后跳到相应位置。" },
  { level: 2, title: "让文字适合自己的阅读习惯", text: "点击右上方的字号按钮，试着放大或缩小正文。字号由父组件持有，控件只负责交互，可以接入自己的偏好设置。" },
  { level: 1, title: "从阅读走向行动", text: "把笔记里值得继续推进的想法写成任务。文字输入先停留在草稿里，确认之后再交给外层的保存逻辑。" },
  { level: 2, title: "给下一步一个清楚的名字", text: "任务标题要具体到能开始执行。下方的输入框复用了桌面看板的草稿组件，按回车或离开输入框可以提交。" },
] as const;

export function ComponentPlayground() {
  const [fontSize, setFontSize] = useState(16);
  const [title, setTitle] = useState("整理开放日的待确认事项");
  const [commits, setCommits] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const outline = useMemo(() => buildNoteOutline(sections.map(section => `${"#".repeat(section.level)} ${section.title}\n\n${section.text}`).join("\n\n")), []);

  return <>
    <section className="demo-section" aria-labelledby="reading-heading">
      <div className="demo-section-title"><div><h2 id="reading-heading">01 / 笔记阅读</h2><p>滚动正文，或使用右侧大纲跳转。</p></div><NoteFontSizeControl value={fontSize} onChange={setFontSize} /></div>
      <div className="reader-frame">
        <div ref={scrollRef} className="reader-scroll" tabIndex={0} aria-label="示例笔记正文">
          <article className="editor-rich-content-surface" style={{ fontSize }}>
            {sections.map(({ level, title: heading, text }) => {
              const Heading = `h${level}` as "h1" | "h2" | "h3";
              return <section key={heading}><Heading>{heading}</Heading><p>{text}</p><p>这是一份公开演示用的示例笔记。可以调整字号、滚动阅读，也可以随时通过目录回到某个章节。</p></section>;
            })}
          </article>
        </div>
        <NoteOutlineRail items={outline} scrollRef={scrollRef} />
      </div>
    </section>
    <section className="demo-section" aria-labelledby="draft-heading">
      <div className="demo-section-title"><div><h2 id="draft-heading">02 / 看板草稿输入</h2><p>输入过程中保留草稿，回车或失焦后提交；中文输入法选词时的回车不会提交。</p></div></div>
      <label className="draft-label" htmlFor="task-title">任务标题</label>
      <KanbanDraftInput id="task-title" className="draft-input" value={title} onCommit={next => { setTitle(next); setCommits(count => count + 1); }} />
      <output className="draft-status" aria-live="polite">已提交 {commits} 次 · 当前值：{title || "（空标题）"}</output>
      <p className="demo-footnote">此处只演示前端输入行为；保存接口、协作冲突处理和持久化由完整产品的其他层负责。</p>
    </section>
  </>;
}
