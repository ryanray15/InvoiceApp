// Global variables
let nextInvoiceNumber = 1;
const API_URL = "http://localhost:8080/api/invoices";

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("issueDate").value = today;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  document.getElementById("dueDate").value = thirtyDaysFromNow
    .toISOString()
    .split("T")[0];

  // Event Listeners
  document.getElementById("addItem").addEventListener("click", addItemRow);
  document
    .getElementById("invoiceForm")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterInvoices);

  // Load existing invoices
  loadInvoices();
  updateInvoiceNumber();
}

function generateInvoiceNumber() {
  return `INV-${String(nextInvoiceNumber).padStart(4, "0")}`;
}

async function updateInvoiceNumber() {
  try {
    const response = await fetch(API_URL);
    const invoices = await response.json();
    nextInvoiceNumber = invoices.length + 1;
    document.getElementById("invoiceNumber").value = generateInvoiceNumber();
  } catch (error) {
    console.error("Error fetching invoice number:", error);
    document.getElementById("invoiceNumber").value = generateInvoiceNumber();
  }
}

function addItemRow() {
  const itemsList = document.getElementById("itemsList");
  const itemDiv = document.createElement("div");
  itemDiv.className = "grid grid-cols-12 gap-2 items-center";
  itemDiv.innerHTML = `
        <div class="col-span-5">
            <input type="text" placeholder="Item Name" class="w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div class="col-span-2">
            <input type="number" placeholder="Quantity" min="1" value="1" class="w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div class="col-span-3">
            <input type="number" placeholder="Price" step="0.01" min="0" class="w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div class="col-span-1">
            <span class="item-total font-medium">$0.00</span>
        </div>
        <div class="col-span-1">
            <button type="button" class="text-red-500 hover:text-red-700" onclick="removeItem(this)">×</button>
        </div>
    `;
  itemsList.appendChild(itemDiv);

  // Add event listeners for calculation
  const inputs = itemDiv.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    input.addEventListener("input", calculateTotals);
  });
}

function removeItem(button) {
  button.closest(".grid").remove();
  calculateTotals();
}

function calculateTotals() {
  let total = 0;
  const items = document.querySelectorAll("#itemsList .grid");

  items.forEach((item) => {
    const inputs = item.querySelectorAll('input[type="number"]');
    const quantity = parseFloat(inputs[0].value) || 0;
    const price = parseFloat(inputs[1].value) || 0;
    const itemTotal = quantity * price;
    item.querySelector(".item-total").textContent = `$${itemTotal.toFixed(2)}`;
    total += itemTotal;
  });

  document.getElementById("totalAmount").textContent = total.toFixed(2);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const items = [];
  document.querySelectorAll("#itemsList .grid").forEach((item) => {
    const inputs = item.querySelectorAll("input");
    items.push({
      name: inputs[0].value,
      quantity: parseInt(inputs[1].value),
      price: parseFloat(inputs[2].value),
      total: parseFloat(item.querySelector(".item-total").textContent.slice(1)),
    });
  });

  const invoice = {
    invoiceNumber: document.getElementById("invoiceNumber").value,
    clientName: document.getElementById("clientName").value,
    issueDate: document.getElementById("issueDate").value,
    dueDate: document.getElementById("dueDate").value,
    items: items,
    total: parseFloat(document.getElementById("totalAmount").textContent),
    status: "unpaid",
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (response.ok) {
      resetForm();
      loadInvoices();
    } else {
      alert("Error creating invoice. Please try again.");
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
    alert("Error creating invoice. Please try again.");
  }
}

async function loadInvoices() {
  try {
    const response = await fetch(API_URL);
    const invoices = await response.json();
    updateInvoiceList(invoices);
  } catch (error) {
    console.error("Error loading invoices:", error);
  }
}

function updateInvoiceList(invoices) {
  const tbody = document.getElementById("invoiceList");
  tbody.innerHTML = "";

  invoices.forEach((invoice) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${
              invoice.invoiceNumber
            }</td>
            <td class="px-6 py-4 whitespace-nowrap">${invoice.clientName}</td>
            <td class="px-6 py-4 whitespace-nowrap">${invoice.dueDate}</td>
            <td class="px-6 py-4 whitespace-nowrap">$${invoice.total.toFixed(
              2
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }">
                    ${invoice.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="toggleInvoiceStatus('${
                  invoice.invoiceNumber
                }', '${invoice.status === "paid" ? "unpaid" : "paid"}')" 
                    class="text-sm ${
                      invoice.status === "paid"
                        ? "text-yellow-600"
                        : "text-green-600"
                    } hover:underline">
                    Mark as ${invoice.status === "paid" ? "Unpaid" : "Paid"}
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

async function toggleInvoiceStatus(invoiceNumber, newStatus) {
  try {
    const response = await fetch(
      `${API_URL}/${invoiceNumber}/status?status=${newStatus}`,
      {
        method: "PUT",
      }
    );

    if (response.ok) {
      loadInvoices();
    } else {
      alert("Error updating invoice status. Please try again.");
    }
  } catch (error) {
    console.error("Error updating invoice status:", error);
    alert("Error updating invoice status. Please try again.");
  }
}

async function filterInvoices() {
  const status = document.getElementById("statusFilter").value;
  try {
    const response = await fetch(API_URL);
    const invoices = await response.json();
    const filteredInvoices =
      status === "all"
        ? invoices
        : invoices.filter((invoice) => invoice.status === status);
    updateInvoiceList(filteredInvoices);
  } catch (error) {
    console.error("Error filtering invoices:", error);
  }
}

function resetForm() {
  document.getElementById("invoiceForm").reset();
  document.getElementById("itemsList").innerHTML = "";
  document.getElementById("totalAmount").textContent = "0.00";
  updateInvoiceNumber();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("issueDate").value = today;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  document.getElementById("dueDate").value = thirtyDaysFromNow
    .toISOString()
    .split("T")[0];
}
