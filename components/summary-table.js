import { formatNumber, formatPixels } from "./utils.js";

class SummaryTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._monitors = [];
  }

  connectedCallback() {
    this.render();
  }

  updateMonitors(monitors) {
    this._monitors = monitors;
    this.renderTable();
  }

  renderTable() {
    const tbody = this.shadowRoot.querySelector("tbody");

    if (this._monitors.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">No monitors added yet</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this._monitors
      .map((monitor, index) => {
        const resolution =
          monitor.width && monitor.height
            ? `${monitor.width} × ${monitor.height}`
            : "-";
        const diagonal = monitor.diagonal ? `${monitor.diagonal}"` : "-";
        const ppi = monitor.ppi ? formatNumber(monitor.ppi, 2) : "-";
        const ppi2 = monitor.ppi2 ? formatNumber(monitor.ppi2, 0) : "-";
        const dotPitch = monitor.dotPitch
          ? formatNumber(monitor.dotPitch, 3) + " mm"
          : "-";
        const pixels = monitor.totalPixels
          ? formatPixels(monitor.totalPixels)
          : "-";

        return `
          <tr>
            <td>Monitor ${index + 1}</td>
            <td>${resolution}</td>
            <td>${diagonal}</td>
            <td>${ppi}</td>
            <td>${ppi2}</td>
            <td>${dotPitch}</td>
            <td>${pixels}</td>
          </tr>
        `;
      })
      .join("");
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
          padding: 1.5rem;
        }
        
        h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        thead tr {
          background: #e5e7eb;
        }
        
        th {
          padding: 0.5rem 1rem;
          text-align: left;
          font-size: 0.875rem;
        }
        
        td {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        tbody tr:hover {
          background: #f9fafb;
        }
        
        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
        }
        
        @media (min-width: 768px) {
          th, td {
            font-size: 1rem;
          }
        }
      </style>
      
      <div class="container">
        <h2>Summary</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Monitor</th>
                <th>Resolution</th>
                <th>Diagonal</th>
                <th>PPI</th>
                <th>PPI²</th>
                <th>Dot Pitch</th>
                <th>Total Pixels</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="7" class="empty-state">No monitors added yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define("summary-table", SummaryTable);
