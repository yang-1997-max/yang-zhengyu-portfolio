import { Children, cloneElement, isValidElement } from "react";
import "./RisingInk.css";

function finishTextNode(text, state) {
  return Array.from(text).map((character, index) => {
    if (/\s/.test(character)) {
      return character;
    }

    const inkIndex = state.index;
    state.index += 1;

    return (
      <span
        className="rising-ink__char"
        style={{ "--ink-index": inkIndex }}
        key={`${state.line}-${inkIndex}-${index}`}
      >
        <span
          className="rising-ink__ghost rising-ink__ghost--halo"
          aria-hidden="true"
        >
          {character}
        </span>
        <span
          className="rising-ink__ghost rising-ink__ghost--ink"
          aria-hidden="true"
        >
          {character}
        </span>
        <span className="rising-ink__glyph">{character}</span>
      </span>
    );
  });
}

function processChildren(children, state) {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return finishTextNode(child, state);
    }

    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === "br") {
      state.line += 1;
      return child;
    }

    if (child.props?.children === undefined) {
      return child;
    }

    return cloneElement(
      child,
      undefined,
      processChildren(child.props.children, state),
    );
  });
}

function getTextContent(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement(child)) {
        return child.type === "br"
          ? " "
          : getTextContent(child.props.children);
      }
      return "";
    })
    .join("");
}

function RisingInk({
  as: Tag = "span",
  children,
  className = "",
  ...props
}) {
  const state = { index: 0, line: 0 };
  const content = processChildren(children, state);
  const accessibleText = getTextContent(children).replace(/\s+/g, " ").trim();

  return (
    <Tag
      className={`rising-ink ${className}`.trim()}
      aria-label={accessibleText}
      {...props}
    >
      {content}
    </Tag>
  );
}

export default RisingInk;
