class QuickAddBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.presets = [
      { label: '24" 1080p', value: "1920x1080x24" },
      { label: '27" 1440p', value: "2560x1440x27" },
      { label: '27" 4K', value: "3840x2160x27" },
      { label: '32" 4K', value: "3840x2160x32" },
      { label: '21.5" 1080p', value: "1920x1080x21.5" },
      { label: '32" 1440p', value: "2560x1440x32" },
      { label: '34" UW 1440p', value: "3440x1440x34" },
      { label: '24" 1920x1200', value: "1920x1200x24" },
      { label: '30" 2560x1600', value: "2560x1600x30" },
      { label: '15.6" Laptop', value: "1366x768x15.6" },
    ];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll(".quick-add-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const preset = e.target.dataset.preset;
        this.dispatchEvent(
          new CustomEvent("preset-selected", {
            bubbles: true,
            composed: true,
            detail: { preset },
          })
        );
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
        }
        
        h2 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.75rem 0;
        }
        
        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .quick-add-btn {
          background: #3b82f6;
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .quick-add-btn:hover {
          background: #2563eb;
        }
        
        @media (min-width: 768px) {
          h2 {
            font-size: 1rem;
          }
        }
      </style>
      
      <div class="container">
        <h2>Quick Add Common Monitors</h2>
        <div class="buttons">
          ${this.presets
            .map(
              (preset) => `
            <button class="quick-add-btn" data-preset="${preset.value}">
              ${preset.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
}

customElements.define("quick-add-bar", QuickAddBar);
