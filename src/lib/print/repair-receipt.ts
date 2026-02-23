export type RepairReceiptLine = {
  name: string;
  amount: number;
};

export type RepairReceiptData = {
  copyType: "REPAIR" | "CUSTOMER";
  billNo: string;
  physicalBillNo?: string | null;
  issuedAt: Date;
  clientName: string;
  clientMobile: string;
  brandName: string;
  storeName: string;
  intakeType: "WALK_IN" | "COURIER";
  status: "PENDING" | "PROCESSING" | "REPAIR_COMPLETED" | "DELIVERED";
  lines: RepairReceiptLine[];
  subtotal: number;
  total: number;
  advance: number;
  balance: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(value: number) {
  return `LKR ${value.toLocaleString()}`;
}

function formatDateTime(value: Date) {
  return value.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function statusLabel(
  status: "PENDING" | "PROCESSING" | "REPAIR_COMPLETED" | "DELIVERED"
) {
  switch (status) {
    case "PROCESSING":
      return "Processing";
    case "REPAIR_COMPLETED":
      return "Repair Completed";
    case "DELIVERED":
      return "Delivered";
    default:
      return "Pending";
  }
}

function buildReceiptHtml(data: RepairReceiptData) {
  const physicalBillNo = data.physicalBillNo?.trim() ?? "";
  const physicalBillMeta = physicalBillNo
    ? `<div class="meta">Physical Bill No: ${escapeHtml(physicalBillNo)}</div>`
    : "";
  const lineRows = data.lines
    .map(
      (line, index) => `
      <div class="line-row">
        <div class="line-name">${index + 1}. ${escapeHtml(line.name)}</div>
        <div class="line-amount">${money(line.amount)}</div>
      </div>
    `
    )
    .join("");
  const repairCodes = data.lines
    .map((line) => {
      const code = line.name.split(" - ")[0]?.trim();
      return code || line.name;
    })
    .filter(Boolean);

  const customerRepairsSection = `
    <div class="meta"><strong>Repairs</strong></div>
    <div class="meta">${escapeHtml(repairCodes.join(", "))}</div>
  `;

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Repair Bill ${escapeHtml(data.billNo)}</title>
      <style>
        @page {
          size: 72mm auto;
          margin: 4mm 3mm;
        }
        * { box-sizing: border-box; }
        html, body {
          width: 66mm;
          margin: 0;
          padding: 0;
          background: #fff;
          color: #000;
          font-family: "Courier New", Courier, monospace;
          font-size: 12px;
          line-height: 1.35;
        }
        .receipt { width: 100%; }
        .center { text-align: center; }
        .logo-img {
          display: block;
          width: 34mm;
          max-width: 100%;
          margin: 0 auto 4px auto;
          object-fit: contain;
        }
        .logo { font-size: 20px; font-weight: 700; letter-spacing: 0.4px; }
        .sub { font-size: 12px; letter-spacing: 0.8px; margin-top: 2px; }
        .contact { text-align: center; font-size: 11px; margin-top: 1px; }
        .rule {
          border-top: 1px dashed #000;
          margin: 8px 0;
          height: 0;
        }
        .meta { margin: 2px 0; }
        .line-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin: 2px 0;
        }
        .line-name { flex: 1; }
        .line-amount { white-space: nowrap; }
        .sum-row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
          font-size: 13px;
        }
        .sum-row.total {
          font-weight: 700;
          margin-top: 4px;
        }
        .thanks {
          text-align: center;
          margin-top: 10px;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <img class="logo-img" src="/assets/logo-dob-bw.png" alt="Doctor of Bat" />
        <div class="center sub">REPAIR BILL${
          data.copyType === "REPAIR" ? " - REPAIR COPY" : ""
        }</div>
        <div class="contact">doctorofbat@gmail.com</div>
        <div class="contact">+94 77 718 4814</div>
        <div class="rule"></div>

        <div class="meta">Bill: ${escapeHtml(data.billNo)}</div>
        ${physicalBillMeta}
        <div class="meta">${escapeHtml(formatDateTime(data.issuedAt))}</div>
        <div class="meta">Client: ${escapeHtml(data.clientName)}</div>
        <div class="meta">Mobile: ${escapeHtml(data.clientMobile)}</div>
        <div class="meta">Brand: ${escapeHtml(data.brandName)}</div>
        <div class="meta">Store: ${escapeHtml(data.storeName)}</div>
        <div class="meta">Intake: ${data.intakeType === "COURIER" ? "Courier" : "Walk-in"}</div>
        <div class="meta">Status: ${statusLabel(data.status)}</div>

        <div class="rule"></div>
        ${
          data.copyType === "CUSTOMER"
            ? customerRepairsSection
            : lineRows
        }
        <div class="rule"></div>

        <div class="sum-row"><span>Subtotal</span><span>${money(data.subtotal)}</span></div>
        <div class="sum-row total"><span>Total</span><span>${money(data.total)}</span></div>
        <div class="sum-row"><span>Advance</span><span>${money(data.advance)}</span></div>
        <div class="sum-row"><span>Balance</span><span>${money(data.balance)}</span></div>

        <div class="rule"></div>
        <div class="thanks">THANK YOU</div>
      </div>
      <script>
        window.onload = function () {
          setTimeout(function () {
            window.print();
          }, 120);
        };
      </script>
    </body>
  </html>
  `;
}

export function printRepairReceipt(data: RepairReceiptData) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(buildReceiptHtml(data));
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 1500);
  };

  iframe.onload = cleanup;
  setTimeout(cleanup, 4000);
}
