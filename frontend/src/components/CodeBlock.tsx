import React from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const langClass = language ? `language-${language}` : "";

  const renderContentWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gh_accent_blue hover:underline"
          key={`${linkUrl}-${match.index}`}
        >
          {linkText}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 1
      ? parts.map((part, i) => <React.Fragment key={`linkpart-code-${i}`}>{part}</React.Fragment>)
      : parts[0] || "";
  };

  return (
    <div
      className="code-block-wrapper my-4 rounded-md overflow-hidden prose-pre:!mt-0 prose-pre:!mb-0 prose-pre:!rounded-none prose-pre:!border-none"
      style={{
        backgroundColor: "var(--tw-prose-pre-bg)",
      }}
    >
      <pre
        className={`text-[13px] leading-relaxed p-4 overflow-x-auto simple-scrollbar`}
        style={{ color: "var(--tw-prose-pre-code)" }}
      >
        <code className={`${langClass} font-mono whitespace-pre`}>{renderContentWithLinks(code)}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
