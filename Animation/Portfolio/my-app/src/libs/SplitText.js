class SplitText {
  static register() {}

  constructor(element, options = {}) {
    if (typeof window === "undefined") return;
    this.element = typeof element === "string" ? document.querySelector(element) : element;
    this.options = options;
    this.type = options.type || "lines,words,chars";
    this.originalHTML = this.element ? this.element.innerHTML : "";
    
    this.lines = [];
    this.words = [];
    this.chars = [];
    
    this.split();
  }

  split() {
    if (typeof window === "undefined" || !this.element) return;
    
    this.lines = [];
    this.words = [];
    this.chars = [];

    // Helper to recursively find all text nodes
    const getTextNodes = (node) => {
      const nodes = [];
      const walk = (n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          if (n.nodeValue.trim().length > 0) {
            nodes.push(n);
          }
        } else {
          if (n.nodeName !== "SCRIPT" && n.nodeName !== "STYLE") {
            for (let child of n.childNodes) {
              walk(child);
            }
          }
        }
      };
      walk(node);
      return nodes;
    };

    const textNodes = getTextNodes(this.element);

    // Replace text nodes with wrapped characters/words
    textNodes.forEach((node) => {
      const text = node.nodeValue;
      const parent = node.parentNode;
      const fragment = document.createDocumentFragment();
      
      // Split by words keeping whitespaces
      const parts = text.split(/(\s+)/);
      
      parts.forEach((part) => {
        if (part.trim().length === 0) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.className = "split-word";
          
          if (this.type.includes("chars")) {
            const chars = part.split("");
            chars.forEach((char) => {
              const charSpan = document.createElement("span");
              charSpan.style.display = "inline-block";
              charSpan.className = "split-char";
              charSpan.textContent = char;
              wordSpan.appendChild(charSpan);
              this.chars.push(charSpan);
            });
          } else {
            wordSpan.textContent = part;
          }
          
          fragment.appendChild(wordSpan);
          this.words.push(wordSpan);
        }
      });
      
      parent.replaceChild(fragment, node);
    });

    // If lines are requested, group elements by offsetTop
    if (this.type.includes("lines")) {
      const linesMap = new Map();
      this.words.forEach((wordSpan) => {
        const top = wordSpan.offsetTop;
        if (!linesMap.has(top)) {
          linesMap.set(top, []);
        }
        linesMap.get(top).push(wordSpan);
      });

      const sortedTops = Array.from(linesMap.keys()).sort((a, b) => a - b);
      
      sortedTops.forEach((top) => {
        const lineWords = linesMap.get(top);
        if (lineWords.length === 0) return;

        const parent = lineWords[0].parentNode;
        const lineSpan = document.createElement("span");
        lineSpan.style.display = "block";
        lineSpan.style.overflow = "hidden";
        lineSpan.className = "split-line";

        // Insert lineSpan before the first word
        parent.insertBefore(lineSpan, lineWords[0]);

        // Move words of this line into lineSpan
        lineWords.forEach((wordSpan) => {
          lineSpan.appendChild(wordSpan);
        });

        this.lines.push(lineSpan);
      });
    }
  }

  revert() {
    if (typeof window === "undefined") return;
    if (this.element) {
      this.element.innerHTML = this.originalHTML;
    }
  }
}

export { SplitText };
