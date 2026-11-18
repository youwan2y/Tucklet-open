"use client";

import { type NoteOutlineItem, OUTLINE_HEADING_SELECTOR, keepOutlineItemVisible } from "./outlineModel";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

export function NoteOutlineRail({
  items,
  scrollRef,
}: {
  items: NoteOutlineItem[];
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const railRef = useRef<HTMLElement>(null);
  const railItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelListRef = useRef<HTMLDivElement>(null);
  const panelItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [panelAnchor, setPanelAnchor] = useState<{ top: number; right: number } | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setPanelAnchor(null);
      setHoveredIndex(null);
    }, 120);
  };

  const openPanel = (nextHoveredIndex?: number) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    cancelClose();
    if (nextHoveredIndex !== undefined) {
      setHoveredIndex(nextHoveredIndex);
    }
    const rect = rail.getBoundingClientRect();
    const panelHeight = Math.min(480, items.reduce(
      (height, item, index) => height + 29 + (item.level === 1 && index > 0 ? 5 : 0),
      17,
    ));
    setPanelAnchor({
      top: Math.max(12, Math.min(rect.top + rect.height / 2 - panelHeight / 2, window.innerHeight - panelHeight - 12)),
      right: window.innerWidth - rect.left,
    });
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || items.length === 0) {
      return;
    }

    let scrollFrame: number | null = null;
    const updateActiveHeading = () => {
      const headings = scrollContainer.querySelectorAll<HTMLElement>(OUTLINE_HEADING_SELECTOR);
      const activationLine = scrollContainer.getBoundingClientRect().top + 24;
      let nextActiveIndex = 0;

      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= activationLine) {
          nextActiveIndex = index;
        }
      });
      setActiveIndex(Math.min(nextActiveIndex, items.length - 1));
    };
    const scheduleActiveHeadingUpdate = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        updateActiveHeading();
      });
    };

    updateActiveHeading();
    scrollContainer.addEventListener("scroll", scheduleActiveHeadingUpdate, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", scheduleActiveHeadingUpdate);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, [items, scrollRef]);

  const highlightedIndex = hoveredIndex ?? activeIndex;

  useEffect(() => {
    keepOutlineItemVisible(railRef.current, railItemRefs.current[highlightedIndex]);
    if (panelAnchor) {
      keepOutlineItemVisible(panelListRef.current, panelItemRefs.current[highlightedIndex]);
    }
  }, [highlightedIndex, panelAnchor]);

  if (items.length === 0) {
    return null;
  }

  const jumpToHeading = (item: NoteOutlineItem) => {
    const scrollContainer = scrollRef.current;
    const headings = scrollContainer?.querySelectorAll<HTMLElement>(OUTLINE_HEADING_SELECTOR);
    const heading = headings?.[item.index];
    if (!scrollContainer || !heading) {
      return;
    }

    const headingTop = heading.getBoundingClientRect().top;
    const containerTop = scrollContainer.getBoundingClientRect().top;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollTop + headingTop - containerTop - 24,
      behavior: "smooth",
    });
    setActiveIndex(item.index);
    setHoveredIndex(null);
    setPanelAnchor(null);
  };

  return (
    <>
      <aside
        ref={railRef}
        className="note-outline-rail"
        aria-label="笔记大纲"
        onMouseEnter={() => openPanel()}
        onMouseLeave={scheduleClose}
      >
        {items.map((item) => (
          <button
            key={item.id}
            ref={(element) => {
              railItemRefs.current[item.index] = element;
            }}
            type="button"
            className={`note-outline-item level-${item.level}${item.index === activeIndex ? " active" : ""}${item.index === hoveredIndex ? " is-hovered" : ""}`}
            aria-label={`跳转到 ${item.level} 级标题：${item.title}`}
            aria-current={item.index === activeIndex ? "location" : undefined}
            onMouseEnter={() => openPanel(item.index)}
            onFocus={() => openPanel(item.index)}
            onBlur={scheduleClose}
            onClick={() => jumpToHeading(item)}
          />
        ))}
      </aside>
      {panelAnchor && createPortal(
        <div
          className="note-outline-panel"
          style={{ top: panelAnchor.top, right: panelAnchor.right }}
          role="navigation"
          aria-label="笔记目录"
          onMouseEnter={cancelClose}
          onMouseLeave={() => {
            setHoveredIndex(null);
            scheduleClose();
          }}
        >
          <div className="note-outline-panel-list" ref={panelListRef}>
            {items.map((item) => (
              <button
                key={item.id}
                ref={(element) => {
                  panelItemRefs.current[item.index] = element;
                }}
                type="button"
                className={`note-outline-panel-item level-${item.level}${item.index === activeIndex ? " active" : ""}${item.index === hoveredIndex ? " is-hovered" : ""}`}
                aria-current={item.index === activeIndex ? "location" : undefined}
                title={item.title}
                onMouseEnter={() => setHoveredIndex(item.index)}
                onFocus={() => setHoveredIndex(item.index)}
                onClick={() => jumpToHeading(item)}
              >
                <span className="note-outline-panel-item-text">{item.title}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
