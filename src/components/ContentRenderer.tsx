import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface ContentRendererProps {
  markdownContent: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ markdownContent }) => {
  const components = {
    code({node, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!className) {
        return <code className="inline-code" {...props}>{children}</code>;
      }
      return (
        <CodeBlock code={String(children).replace(/\n$/, '')} language={match ? match[1] : ''} />
      );
    },
    a({node, ...props}: any) {
      return <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent_primary hover:underline" />;
    }
  };
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown components={components}>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default ContentRenderer;