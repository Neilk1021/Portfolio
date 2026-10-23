import './ExpandableButton.css';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
  name: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}

function ExpandableButton({ name, children, defaultOpen = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        className="TerminalButton"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((v) => !v)}
      >
        {name}
      </button>
      {/* `inert` matters: without it the collapsed links stay keyboard
          focusable inside a zero-height box, so Tab lands on nothing. */}
      <div
        id={panelId}
        inert={!isExpanded}
        className={`content ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="content-inner">{children}</div>
      </div>
    </div>
  );
}

export default ExpandableButton;
