import {
  calculatePPI,
  calculateDotPitch,
  calculateTotalPixels,
  formatNumber,
  formatPixels,
} from "./utils.js";

class MonitorCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = {
      width: null,
      height: null,
      diagonal: null,
      ppi: null,
      ppi2: null,
      dotPitch: null,
      totalPixels: null,
    };
  }

  static get observedAttributes() {
    return ["monitor-number", "width", "height", "diagonal"];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();

    // Initialize with attributes if provided
    if (this.hasAttribute("width")) {
      this._data.width = parseFloat(this.getAttribute("width"));
    }
    if (this.hasAttribute("height")) {
      this._data.height = parseFloat(this.getAttribute("height"));
    }
    if (this.hasAttribute("diagonal")) {
      this._data.diagonal = parseFloat(this.getAttribute("diagonal"));
    }

    this.calculate();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "width" || name === "height" || name === "diagonal") {
        this._data[name] = parseFloat(newValue) || null;
        this.calculate();
      }
      if (name === "monitor-number") {
        this.updateMonitorNumber();
      }
    }
  }

  get data() {
    return this._data;
  }

  calculate() {
    if (
      this._data.width > 0 &&
      this._data.height > 0 &&
      this._data.diagonal > 0
    ) {
      this._data.ppi = calculatePPI(
        this._data.width,
        this._data.height,
        this._data.diagonal
      );
      this._data.ppi2 = this._data.ppi * this._data.ppi;
      this._data.dotPitch = calculateDotPitch(this._data.ppi);
      this._data.totalPixels = calculateTotalPixels(
        this._data.width,
        this._data.height
      );
      this.updateOutputs();
    } else {
      this._data.ppi = null;
      this._data.ppi2 = null;
      this._data.dotPitch = null;
      this._data.totalPixels = null;
      this.resetOutputs();
    }

    this.dispatchEvent(
      new CustomEvent("data-changed", {
        bubbles: true,
        composed: true,
        detail: this._data,
      })
    );
  }

  updateOutputs() {
    const shadow = this.shadowRoot;
    shadow.querySelector('[data-output="ppi"]').textContent =
      this._data.ppi !== null ? formatNumber(this._data.ppi, 2) : "-";
    shadow.querySelector('[data-output="ppi2"]').textContent =
      this._data.ppi2 !== null ? formatNumber(this._data.ppi2, 0) : "-";
    shadow.querySelector('[data-output="dotpitch"]').textContent =
      this._data.dotPitch !== null ? formatNumber(this._data.dotPitch, 3) : "-";
    shadow.querySelector('[data-output="pixels"]').textContent =
      this._data.totalPixels !== null
        ? formatPixels(this._data.totalPixels)
        : "-";
  }

  resetOutputs() {
    const shadow = this.shadowRoot;
    shadow.querySelector('[data-output="ppi"]').textContent = "-";
    shadow.querySelector('[data-output="ppi2"]').textContent = "-";
    shadow.querySelector('[data-output="dotpitch"]').textContent = "-";
    shadow.querySelector('[data-output="pixels"]').textContent = "-";
  }

  updateMonitorNumber() {
    const shadow = this.shadowRoot;
    const title = shadow.querySelector("h3");
    if (title) {
      title.textContent = `Monitor ${
        this.getAttribute("monitor-number") || ""
      }`;
    }
  }

  attachEventListeners() {
    const shadow = this.shadowRoot;
    const inputs = shadow.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const inputType = e.target.dataset.input;
        const value = parseFloat(e.target.value);
        this._data[inputType] = isNaN(value) ? null : value;
        this.calculate();
      });
    });

    shadow.querySelector(".remove-btn").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("remove-calculator", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  render() {
    const monitorNumber = this.getAttribute("monitor-number") || "";
    const width = this.getAttribute("width") || "";
    const height = this.getAttribute("height") || "";
    const diagonal = this.getAttribute("diagonal") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          position: relative;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }
        
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        
        .remove-btn:hover {
          color: #dc2626;
        }
        
        .inputs {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        input {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          outline: none;
        }
        
        input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .outputs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .output-group {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        
        .output-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .output-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }
      </style>
      
      <div class="card">
        <div class="header">
          <h3>Monitor ${monitorNumber}</h3>
          <button class="remove-btn" aria-label="Remove calculator">×</button>
        </div>
        
        <div class="inputs">
          <div class="input-group">
            <label>Resolution Width (px)</label>
            <input 
              type="number" 
              data-input="width" 
              placeholder="1920"
              value="${width}"
            />
          </div>
          <div class="input-group">
            <label>Resolution Height (px)</label>
            <input 
              type="number" 
              data-input="height" 
              placeholder="1080"
              value="${height}"
            />
          </div>
          <div class="input-group">
            <label>Diagonal Size (inches)</label>
            <input 
              type="number" 
              step="0.1" 
              data-input="diagonal" 
              placeholder="24"
              value="${diagonal}"
            />
          </div>
        </div>
        
        <div class="outputs">
          <div class="output-group">
            <div class="output-label">PPI</div>
            <div class="output-value" data-output="ppi">-</div>
          </div>
          <div class="output-group">
            <div class="output-label">PPI²</div>
            <div class="output-value" data-output="ppi2">-</div>
          </div>
          <div class="output-group">
            <div class="output-label">Dot Pitch (mm)</div>
            <div class="output-value" data-output="dotpitch">-</div>
          </div>
          <div class="output-group">
            <div class="output-label">Total Pixels</div>
            <div class="output-value" data-output="pixels">-</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("monitor-calculator", MonitorCalculator);
