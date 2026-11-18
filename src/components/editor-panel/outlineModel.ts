export interface NoteOutlineItem {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  index: number;
}

export const OUTLINE_HEADING_SELECTOR =
  ".editor-rich-content-surface h1, .editor-rich-content-surface h2, .editor-rich-content-surface h3";

export function buildNoteOutline(content: string): NoteOutlineItem[] {
  const items: NoteOutlineItem[] = [];
  let inCodeBlock = false;

  const cleanOutlineText = (value: string) =>
    value
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~#|]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  content.split("\n").forEach((line) => {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) {
      return;
    }

    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (!match) {
      return;
    }

    const title = cleanOutlineText(match[2]);
    if (!title) {
      return;
    }

    items.push({
      id: `note-outline-${items.length}`,
      level: match[1].length as 1 | 2 | 3,
      title,
      index: items.length,
    });
  });

  return items;
}

export function keepOutlineItemVisible(
  container: HTMLElement | null,
  item: HTMLElement | null,
) {
  if (!container || !item) {
    return;
  }

  const padding = 6;
  const containerRect = container.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  if (itemRect.top < containerRect.top + padding) {
    container.scrollTop -= containerRect.top + padding - itemRect.top;
  } else if (itemRect.bottom > containerRect.bottom - padding) {
    container.scrollTop += itemRect.bottom - containerRect.bottom + padding;
  }
}
