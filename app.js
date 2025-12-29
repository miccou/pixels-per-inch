import "./components/monitor-calculator.js";
import "./components/summary-table.js";
import "./components/quick-add-bar.js";

class PPICalculatorApp {
  constructor() {
    this.calculatorCount = 0;
    this.calculators = new Map();
    this.container = document.getElementById("calculators-container");
    this.summaryTable = document.querySelector("summary-table");
    this.addButton = document.getElementById("add-calculator-btn");
    this.shareButton = document.getElementById("share-btn");

    this.init();
  }

  init() {
    // Event listeners
    this.addButton.addEventListener("click", () => this.addCalculator());
    this.shareButton.addEventListener("click", () => this.shareLink());

    document.addEventListener("preset-selected", (e) => {
      const preset = e.detail.preset;
      const parts = preset.split("x");
      if (parts.length === 3) {
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        const diagonal = parseFloat(parts[2]);
        this.addCalculator(width, height, diagonal);
      }
    });

    document.addEventListener("remove-calculator", (e) => {
      const calculator = e.target;
      this.removeCalculator(calculator);
    });

    document.addEventListener("data-changed", () => {
      this.updateSummary();
      this.updateURL();
    });

    // Load from URL
    this.loadFromURL();

    // Create initial calculator if none loaded from URL
    if (this.calculators.size === 0) {
      this.addCalculator();
    }
  }

  addCalculator(width = null, height = null, diagonal = null) {
    this.calculatorCount++;

    const calculator = document.createElement("monitor-calculator");
    calculator.setAttribute("monitor-number", this.calculatorCount);

    if (width !== null) calculator.setAttribute("width", width);
    if (height !== null) calculator.setAttribute("height", height);
    if (diagonal !== null) calculator.setAttribute("diagonal", diagonal);

    this.container.appendChild(calculator);
    this.calculators.set(calculator, this.calculatorCount);

    this.updateSummary();
    this.updateURL();
  }

  removeCalculator(calculator) {
    calculator.remove();
    this.calculators.delete(calculator);
    this.updateSummary();
    this.updateURL();
  }

  updateSummary() {
    const monitors = [];
    this.calculators.forEach((number, calculator) => {
      monitors.push(calculator.data);
    });
    this.summaryTable.updateMonitors(monitors);
  }

  updateURL() {
    const monitors = [];
    this.calculators.forEach((number, calculator) => {
      const data = calculator.data;
      if (data.width && data.height && data.diagonal) {
        monitors.push(`${data.width}x${data.height}x${data.diagonal}`);
      }
    });

    if (monitors.length > 0) {
      const params = new URLSearchParams();
      params.set("monitors", monitors.join(","));
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newURL);
    } else {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  async shareLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);

      // Show feedback
      const originalText = this.shareButton.innerHTML;
      this.shareButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="share-btn-text">Copied!</span>
      `;

      setTimeout(() => {
        this.shareButton.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const monitorsParam = params.get("monitors");

    if (monitorsParam) {
      const monitors = monitorsParam.split(",");
      monitors.forEach((monitor) => {
        const parts = monitor.split("x");
        if (parts.length === 3) {
          const width = parseFloat(parts[0]);
          const height = parseFloat(parts[1]);
          const diagonal = parseFloat(parts[2]);

          if (!isNaN(width) && !isNaN(height) && !isNaN(diagonal)) {
            this.addCalculator(width, height, diagonal);
          }
        }
      });
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new PPICalculatorApp();
  });
} else {
  new PPICalculatorApp();
}
