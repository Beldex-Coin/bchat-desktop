import {
  DecoratorNode,
  EditorConfig,
  
} from "lexical";

export class MentionNode extends DecoratorNode<JSX.Element> {
  __id: string;
  __display: string;

  getId(): string {
  return this.__id;
}

getDisplay(): string {
  return this.__display;
}

  static getType() {
    return "mention";
  }

  static clone(node: MentionNode) {
    return new MentionNode(node.__id, node.__display, node.__key);
  }

  constructor(id: string, display: string, key?: string) {
    super(key);
    this.__id = id;
    this.__display = display;
  }

  createDOM(config: EditorConfig): HTMLElement {
    console.log(config)
    const span = document.createElement("span");
    span.className = "mention-node";
    span.textContent = `@${this.__display}`;
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  exportJSON() {
    return {
      type: "mention",
      id: this.__id,
      display: this.__display,
      version: 1,
    };
  }

  static importJSON(serializedNode: any) {
    return new MentionNode(serializedNode.id, serializedNode.display);
  }
}