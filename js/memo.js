document.addEventListener("DOMContentLoaded", function () {
  const memoInput1 = document.getElementById("memoNumber-1");

  const popup1 = document.getElementById("memoNumberPopup-1");

  memoInput1.addEventListener("focus", async function (e) {
    // Position the popup below the input
    const rect = memoInput1.getBoundingClientRect();
    popup1.style.left = rect.left + "px";
    popup1.style.top = rect.bottom + window.scrollY + "px";
    popup1.style.width = rect.width + "px";

    // Fetch memo numbers
    try {
      const response = await fetch("/all-memo-numbers");
      const memoNumbers = await response.json();
      popup1.innerHTML = "";
      memoNumbers.forEach((num) => {
        const div = document.createElement("div");
        div.className = "popup-item";
        div.textContent = num;
        div.style.padding = "4px 8px";
        div.style.cursor = "pointer";
        div.addEventListener("mousedown", function () {
          memoInput1.value = num;
          popup1.style.display = "none";
          document.querySelector(".confirm").style.display = "none";
          document.querySelector(".dis").style.display = "block";
        });
        popup1.appendChild(div);
      });
      popup1.style.display = "block";
    } catch {
      popup1.innerHTML =
        "<div style='padding:4px 8px;'>Error loading memos</div>";
      popup1.style.display = "block";
    }
  });

  // Hide popup when clicking outside
  document.addEventListener("mousedown", function (e) {
    if (!popup1.contains(e.target) && e.target !== memoInput1) {
      popup1.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const memoInput2 = document.getElementById("memoNumber-2");
  const popup2 = document.getElementById("memoNumberPopup-2");

  memoInput2.addEventListener("focus", async function (e) {
    // Position the popup below the input
    const rect = memoInput2.getBoundingClientRect();
    popup2.style.left = rect.left + "px";
    popup2.style.top = rect.bottom + window.scrollY + "px";
    popup2.style.width = rect.width + "px";

    // Fetch memo numbers
    try {
      const response = await fetch("/all-memo-numbers");
      const memoNumbers = await response.json();
      popup2.innerHTML = "";
      memoNumbers.forEach((num) => {
        const div = document.createElement("div");
        div.className = "popup-item";
        div.textContent = num;
        div.style.padding = "4px 8px";
        div.style.cursor = "pointer";
        div.addEventListener("mousedown", function () {
          memoInput2.value = num;
          popup2.style.display = "none";
        });
        popup2.appendChild(div);
      });
      popup2.style.display = "block";
    } catch {
      popup2.innerHTML =
        "<div style='padding:4px 8px;'>Error loading memos</div>";
      popup2.style.display = "block";
    }
  });
  // Hide popup when clicking outside
  document.addEventListener("mousedown", function (e) {
    if (!popup2.contains(e.target) && e.target !== memoInput2) {
      popup2.style.display = "none";
    }
  });
});
document;
document.querySelector(".confirm").addEventListener("click", async function () {
  document.getElementById("isUpdate").value = "false";
  const memoNumberInput = document.querySelector(".place-number");
  var ip = document.querySelector(".ip-place");

  try {
    const response = await fetch("/latest");
    const data = await response.json();

    let latestNumber = parseInt(data.latestMemoNumber, 10);
    if (isNaN(latestNumber)) latestNumber = 1000510;
    console.log(data);
    console.log(latestNumber); // fallback if none exists
    const newNumber = (latestNumber + 1).toString();
    memoNumberInput.style.display = "flex";
    ip.value = newNumber;
    // Disable the confirm button
  } catch (err) {
    // fallback if fetch fails
    memoNumberInput.value = "1000001";
  }
  this.disabled = true; // Disable the confirm button
  document.querySelector(".confirm").style.display = "none"; // Show the placement memo number row
});
// document
//   .querySelector(".place-btn")
//   .addEventListener("click", async function (e) {
//     e.preventDefault();
//     // Fetch the latest memo number from the backend
//     try {
//       const response = await fetch("/latest");
//       const data = await response.json();
//       let latestNumber = parseInt(data.latestMemoNumber, 10);
//       if (isNaN(latestNumber)) latestNumber = 1000000; // fallback if none exists
//       const newNumber = (latestNumber + 1).toString();
//       this.previousElementSibling.value = newNumber;
//     } catch (err) {
//       // fallback if fetch fails
//       this.previousElementSibling.value = "1000001";
//     }
//     this.disabled = true;
//   });
const usedWagons = new Set();
document.querySelector(".dis").addEventListener("click", async function () {
  document.getElementById("isUpdate").value = "true";
  document.querySelector(".dis").style.display = "none";
  document.querySelector(".confirm").style.display = "none";
  const memoNumber = document.querySelector(".ip-place").value.trim();
  if (!memoNumber) {
    alert("Please enter Placement Memo No.");
    return;
  }

  try {
    const response = await fetch(
      `/memo?memo=${encodeURIComponent(memoNumber)}`
    );

    if (!response.ok) {
      alert("Memo not found");
      return;
    }
    const memo = await response.json();
    usedWagons.clear();
    if (memo.wagons) {
      memo.wagons.forEach((wagon) => {
        if (wagon.wagonNumber) usedWagons.add(wagon.wagonNumber);
      });
    }
    if (memo.acknowledged) {
      // Hide the Save button
      document.querySelector(".header-save").style.display = "none";
      // Optionally, hide or disable other editing controls as well
    }

    // Fill your form fields with returned memo data
    // Example for date:
    const memoDateInput = document.getElementById("memoDate");
    if (memoDateInput && memo.date) {
      memoDateInput.value = memo.date.split("T")[0];
    }
    // Example for loading point:
    if (memo.loadingPoint) {
      document.querySelector(".loading-point").value =
        memo.loadingPoint.code || "";
      document.querySelector(".loading-point-desc").value =
        memo.loadingPoint.description || "";
    }
    if (memo.unloadingPoint) {
      document.querySelector(".unloading-point").value =
        memo.unloadingPoint.code || "";
      document.querySelector(".unloading-point-desc").value =
        memo.unloadingPoint.description || "";
    }
    // Fill wagons table
    if (memo.wagons) {
      memo.wagons.forEach((wagon, i) => {
        const wagonNo = document.querySelector(`[name="wagonNo_${i}"]`);
        if (wagonNo) wagonNo.value = wagon.wagonNumber || "";

        const wagonType = document.querySelector(`[name="wagonType_${i}"]`);
        if (wagonType) wagonType.value = wagon.wagonType || "";

        const tare = document.querySelector(`[name="tare_${i}"]`);
        if (tare) tare.value = wagon.tare || "";

        const date = document.querySelector(`[name="date_${i}"]`);
        if (date) date.value = wagon.wagondate || "";

        const remarks = document.querySelector(`[name="remarks_${i}"]`);
        if (remarks) remarks.value = wagon.remarks || "";

        const selected = document.querySelector(`[name="selected_${i}"]`);
        if (selected) selected.checked = !!wagon.selected;
      });
    }
  } catch (error) {
    alert("Failed to fetch memo: " + error.message);
  }
});
document.getElementById("displayBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  document.getElementById("displayBtn").style.display = "none";
  const memoNumber = document.getElementById("memoNumber-2").value.trim();
  // After memo is loaded and processed
  document.getElementById("weightReportLink").href =
    "/weight-report?id=" + encodeURIComponent(memoNumber);
  if (!memoNumber) {
    alert("Please enter Placement Memo No.");
    return;
  }

  // Helper to convert "dd.MM.yyyy" to "yyyy-MM-dd" for <input type="date">

  function toInputDateFormat(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      // If already in ISO format, extract only the date part
      return dateStr.split("T")[0];
    }
    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  try {
    const response = await fetch(
      `/memo?memo=${encodeURIComponent(memoNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        alert("Memo not found");
      } else {
        alert("Error fetching memo");
      }
      return;
    }
    const memo = await response.json();
    console.log(memo.isUnloaded);
    if (memo.acknowledged) {
      // Hide the Acknowledge button
      const ackBtn = document.getElementById("ack");
      if (ackBtn) ackBtn.style.display = "none";

      // Show and disable challan number fields
      memo.wagons.forEach((wagon, index) => {
        // Select the correct <td> for this row
        const challanTd = document.querySelectorAll(".challan-td")[index];
        if (challanTd) {
          challanTd.style.visibility = ""; // Show the cell
          // Find the input inside this <td>
          const challanInput = challanTd.querySelector(
            'input[name="challanNumber' + index + '"]'
          );
          if (challanInput) challanInput.readOnly = true;
        }
      });
    }
    if (!memo.isUnloaded) {
      document.getElementById("unloading").style.display = "inline-block";
    }
    // ...inside document.getElementById("displayBtn").addEventListener("click", async (e) => { ... }
    // if (!memo.acknowledged) {
    //   // Show only the Acknowledge button
    //   const ackBtn = document.getElementById("ack");
    //   const loadBtn = document.getElementById("load");
    //   if (ackBtn) ackBtn.style.display = "block";
    //   if (loadBtn) loadBtn.style.display = "none";
    // }
    // ...existing code...
    const allReleased =
      memo.wagons &&
      memo.wagons.length &&
      memo.wagons.every((w) => w.releaseDate && w.releaseTime);

    if (allReleased) {
      // Hide the Loading Completed button
      const loadBtn = document.getElementById("load");
      const wt = document.getElementById("weightReportLink");
      if (wt) wt.style.display = "inline-block";

      if (loadBtn) loadBtn.style.display = "none";
      checkAndShowQRButton();

      // Show and disable release date/time fields
      memo.wagons.forEach((wagon, index) => {
        const releaseDate = document.querySelector(
          `input[name="releaseDate${index}"]`
        );
        if (releaseDate) releaseDate.disabled = true;

        const releaseTime = document.querySelector(
          `input[name="releaseTime${index}"]`
        );
        if (releaseTime) releaseTime.disabled = true;
      });
    }
    function checkAndShowQRButton() {
      const ackBtn = document.getElementById("ack");
      const loadBtn = document.getElementById("load");
      const qrLink = document.getElementById("generateQR");
      const unloadingBtn = document.getElementById("unloading");
      const memoNumber = document.getElementById("memoNumber-2").value.trim();
      if (
        ackBtn &&
        loadBtn &&
        qrLink &&
        ackBtn.style.display === "none" &&
        loadBtn.style.display === "none" &&
        memoNumber
      ) {
        qrLink.href = `/generate-qr/${encodeURIComponent(memoNumber)}`;
        qrLink.style.display = "inline-block";
        // unloadingBtn.style.display = "inline-block";
      } else {
        unloadingBtn.style.display = "none"; // HIDE unloading btn otherwise
      }
    }

    // Fill your form fields with returned memo data
    const dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.value = toInputDateFormat(memo.date);
    }
    const loadingPoint1 = document.getElementById("loadingPoint1");
    if (loadingPoint1) loadingPoint1.value = memo.loadingPoint.code || "";
    const loadingPoint2 = document.getElementById("loadingPoint2");
    if (loadingPoint2)
      loadingPoint2.value = memo.loadingPoint.description || "";
    const unloadingPoint1 = document.getElementById("unloadingPoint1");
    if (unloadingPoint1) unloadingPoint1.value = memo.unloadingPoint.code || "";
    const unloadingPoint2 = document.getElementById("unloadingPoint2");
    if (unloadingPoint2)
      unloadingPoint2.value = memo.unloadingPoint.description || "";

    // Fill wagons table
    // Fill wagons table
    memo.wagons.forEach((wagon, index) => {
      if (index <= 10) {
        const selected = document.querySelector(
          `input[name="selected${index}"]`
        );
        if (selected) selected.checked = !!wagon.selected;

        const wagonType = document.querySelector(
          `input[name="wagonType${index}"]`
        );
        if (wagonType) wagonType.value = wagon.wagonType || "";

        const tare = document.querySelector(`input[name="tare${index}"]`);
        if (tare) tare.value = wagon.tare || "";

        const wagonNumber = document.querySelector(
          `input[name="wagonNumber${index}"]`
        );
        if (wagonNumber) wagonNumber.value = wagon.wagonNumber || "";

        const challanNumber = document.querySelector(
          `input[name="challanNumber${index}"]`
        );
        if (challanNumber) challanNumber.value = wagon.challan_number || "";

        const wagonDate = document.querySelector(
          `input[name="challanDate${index}"]`
        );
        if (wagonDate) wagonDate.value = toInputDateFormat(wagon.wagondate);

        const releaseDate = document.querySelector(
          `input[name="releaseDate${index}"]`
        );
        if (releaseDate)
          releaseDate.value = toInputDateFormat(wagon.releaseDate);

        const releaseTime = document.querySelector(
          `input[name="releaseTime${index}"]`
        );
        if (releaseTime) releaseTime.value = wagon.releaseTime || "00:00:00";

        const remarks = document.querySelector(`input[name="remarks${index}"]`);
        if (remarks) remarks.value = wagon.remarks || "";
      }
    });
  } catch (error) {
    alert("Failed to fetch memo: " + error.message);
  }
});

// document.getElementById("load").addEventListener("click", function () {
//   // ...your existing logic for loading completed...
//   document.getElementById("unloading").style.display = "block";
// });
document
  .getElementById("unloading")
  .addEventListener("click", async function () {
    // Get the current memo number from the form
    const memoNumber = document.getElementById("memoNumber-2").value;

    // Send a POST request to /unloading
    const response = await fetch("/unloading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoNumber }),
    });

    if (response.ok) {
      alert("Wagons sent back to Wagon DB!");
      window.location.reload(); // Refresh the page or redirect as needed
    } else {
      alert("Failed to unload wagons.");
    }
  });
document.getElementById("ack").addEventListener("click", function () {
  document.querySelector("#load").style.display = "block";
  // Show confirmation popup
  showConfirmPopup(
    "Are you sure you want to acknowledge this memo?",
    async function onYes() {
      document.querySelectorAll(".challan-td").forEach((td) => {
        td.style.visibility = "visible";
      });
      document.getElementById("ack").style.display = "none";
      const memoNumber = document.getElementById("memoNumber-2").value.trim();
      if (!memoNumber) {
        alert("No memo number found!");
        return;
      }

      try {
        const response = await fetch("/acknowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoNumber: memoNumber, ack: true }),
        });

        if (response.ok) {
          document.getElementById("option2").click();
          document.querySelector(".header-save").style.display = "none";
          showAckPopup("This memo has been acknowledged.");
        } else {
          alert("Failed to acknowledge memo.");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  );
});
function showConfirmPopup(message, onYes) {
  let popup = document.getElementById("confirm-ack-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "confirm-ack-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.border = "2px solid #333";
    popup.style.padding = "24px 32px";
    popup.style.zIndex = "10000";
    popup.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)";
    popup.style.fontSize = "1.2em";
    popup.style.color = "#222";
    popup.style.textAlign = "center";
    popup.innerHTML =
      message +
      '<br><br><button id="ack-yes">Yes</button> <button id="ack-no">No</button>';
    document.body.appendChild(popup);

    document.getElementById("ack-yes").onclick = function () {
      popup.remove();
      onYes();
    };
    document.getElementById("ack-no").onclick = function () {
      popup.remove();
      document.getElementById("ack").style.display = "block";
    };
  }
}

// Helper function to show a popup
function showAckPopup(message) {
  let popup = document.getElementById("ack-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "ack-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.border = "2px solid #c00";
    popup.style.padding = "24px 32px";
    popup.style.zIndex = "9999";
    popup.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)";
    popup.style.fontSize = "1.2em";
    popup.style.color = "#c00";
    popup.style.textAlign = "center";
    popup.innerHTML =
      message + '<br><br><button id="close-ack-popup">OK</button>';
    document.body.appendChild(popup);
    document.getElementById("close-ack-popup").onclick = function () {
      popup.remove();
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const memoDateInput = document.getElementById("memoDate");
  if (memoDateInput) {
    const today = new Date().toISOString().split("T")[0];
    memoDateInput.value = today;
  }
  // View Toggle Functionality
  document.getElementById("option1").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("view1").classList.remove("hidden");
    document.getElementById("view2").classList.add("hidden");
  });

  document.getElementById("option2").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("view1").classList.add("hidden");
    document.getElementById("view2").classList.remove("hidden");
  });

  // View 1 Popup Functionality
  // ...existing code...
  const popup = document.getElementById("wagonPopup");
  const popupList = document.getElementById("wagonPopupList");
  let currentRow = null;
  const rows = document.querySelectorAll(".view1 .wagon-table tbody tr");

  document.querySelectorAll(".view1 .action-btn").forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentRow = parseInt(this.getAttribute("data-row"));

      // Fetch wagons from Express API
      try {
        // In your JS where you fetch wagons:
        const memoNumber = document.getElementById("memoNumber-2")?.value || "";
        const response = await fetch(
          `/all-wagons?memoNumber=${encodeURIComponent(memoNumber)}`
        );
        // const response = await fetch("/all-wagons");
        if (!response.ok) throw new Error("Failed to fetch wagons");
        const wagons = await response.json();

        // Clear previous list
        popupList.innerHTML = "";

        // Only show wagons not already used
        wagons
          .filter((wagon) => !usedWagons.has(wagon.wagonNumber))
          .sort((a, b) => {
            // Extract trailing number from wagonNumber (e.g., "vdycd 12" => 12)
            const numA = parseInt(a.wagonNumber.match(/\d+$/)?.[0] || "0", 10);
            const numB = parseInt(b.wagonNumber.match(/\d+$/)?.[0] || "0", 10);
            return numA - numB;
          })
          .forEach((wagon) => {
            const div = document.createElement("div");
            div.className = "popup-item";
            div.setAttribute("data-wagon", wagon.wagonNumber);
            div.setAttribute("data-type", wagon.wagonType);

            div.textContent = `${wagon.wagonNumber} - ${wagon.wagonType}`;
            popupList.appendChild(div);
          });

        // Add click event to each new popup item
        popupList.querySelectorAll(".popup-item").forEach((item) => {
          item.addEventListener("click", function () {
            const wagonNumber = this.getAttribute("data-wagon");
            const wagonType = this.getAttribute("data-type");

            // Update the current row data
            if (currentRow !== null && rows[currentRow]) {
              // --- Remove the old wagon from usedWagons if present ---
              const wagonInput =
                rows[currentRow].cells[2].querySelector(".wagon-number");
              const oldWagon = wagonInput.value;
              if (oldWagon && usedWagons.has(oldWagon)) {
                usedWagons.delete(oldWagon);
              }

              // Set the new wagon
              wagonInput.value = wagonNumber;
              rows[currentRow].cells[3].querySelector(".wagon-Type").value =
                wagonType;
              // Always use today's date
              const today = new Date().toISOString().split("T")[0];
              rows[currentRow].cells[5].querySelector(".wagon-Date").value =
                today;

              // Add the new wagon to usedWagons
              usedWagons.add(wagonNumber);
            }

            // Remove this wagon from the popup
            this.remove();

            // Hide the popup
            popup.style.display = "none";
          });
        });

        popup.style.display = "flex";
      } catch (err) {
        popupList.innerHTML = "<div>Error loading wagons</div>";
        popup.style.display = "flex";
      }
    });
  });
  // Add click event to each popup item
  // document.querySelectorAll(".popup-item").forEach((item) => {
  //   item.addEventListener("click", function () {
  //     const wagonNumber = this.getAttribute("data-wagon");
  //     const wagonType = this.getAttribute("data-type");
  //     const date = this.getAttribute("data-date");

  //     // Update the current row data
  //     if (currentRow !== null && rows[currentRow]) {
  //       rows[currentRow].cells[2].querySelector(".wagon-number").value =
  //         wagonNumber;
  //       rows[currentRow].cells[3].querySelector(".wagon-Type").value =
  //         wagonType;
  //       rows[currentRow].cells[5].querySelector(".wagon-Date").value =
  //         date;
  //     }

  //     // Hide the popup
  //     popup.style.display = "none";
  //   });
  // });

  // Close popup when clicking outside
  popup.addEventListener("click", function (e) {
    if (e.target === this) {
      popup.style.display = "none";
    }
  });

  // Header save icon functionality
  document.querySelector(".header-save").addEventListener("click", function () {
    alert("All data saved!");
  });
});
document.querySelector(".clear-btn").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(
    '.wagon-table tbody input[type="checkbox"]'
  );
  let anyChecked = false;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) anyChecked = true;
  });

  if (!anyChecked) {
    window.location.reload();
    document.querySelector(".confirm").style.display = "block";
    document.querySelector(".header-save").style.display = "block";
    document.querySelector(".dis").style.display = "none";
  } else {
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const row = checkbox.closest("tr");
        if (row) {
          // Remove the wagon number from usedWagons set
          const wagonInput = row.querySelector(".wagon-number");
          if (wagonInput && wagonInput.value) {
            usedWagons.delete(wagonInput.value);
          }
          row.querySelectorAll("input").forEach((input) => {
            if (input.type !== "checkbox") input.value = "";
          });
          checkbox.checked = false;
        }
      }
    });
  }
});
// document.querySelector(".clear-btn").addEventListener("click", () => {
//   window.location.reload();
//   document.querySelector(".confirm").style.display = "block";
//   document.querySelector(".header-save").style.display = "block";
//   document.querySelector(".dis").style.display = "none";
//   //   document.querySelectorAll(".clear").forEach((el) => {
//   //     el.value = "";
//   //   });
// });
document.querySelector(".clear-bt").addEventListener("click", () => {
  window.location.reload();
});
document.querySelector(".print").addEventListener("click", () => {
  window.print();
});
document.querySelector(".print1").addEventListener("click", () => {
  window.print();
});

const loadingCompletedButton = document.querySelector("#load");
const releaseDateInputs = document.querySelectorAll(".releasedate");
const releaseTimeInputs = document.querySelectorAll(".releasetime");

// Initially disable the Release Date and Release Time fields and clear their values
releaseDateInputs.forEach((input) => {
  input.value = "";
  input.disabled = true;
});
releaseTimeInputs.forEach((input) => {
  input.value = "";
  input.disabled = true;
});

// Enable and fill only the rows with wagon numbers when "Loading completed" is clicked
loadingCompletedButton.addEventListener("click", function () {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const time = now.toTimeString().slice(0, 5); // "HH:MM"

  releaseDateInputs.forEach((input, idx) => {
    // Find the corresponding wagon number input for this row
    const wagonInput = document.querySelector(
      `input[name="wagonNumber${idx}"]`
    );
    if (wagonInput && wagonInput.value.trim() !== "") {
      input.value = today;
      input.disabled = false;
      releaseTimeInputs[idx].value = time;
      releaseTimeInputs[idx].disabled = false;
    }
  });

  document.querySelector(".wt").style.display = "block";
});
const locationButtons = document.querySelectorAll(".location-btn");
const popups = document.querySelectorAll(".popup-overlay");

locationButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const popupId = this.getAttribute("data-popup");
    const popup = document.getElementById(popupId);
    popup.style.display = "flex";
  });
});
// Close popups when clicking outside
popups.forEach((popup) => {
  popup.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });
});

// Handle location selection
document.querySelectorAll(".popup-item").forEach((item) => {
  item.addEventListener("click", function () {
    const code = this.getAttribute("data-code");
    const desc = this.getAttribute("data-desc");
    const popup = this.closest(".popup-overlay");

    if (popup.id === "loadingPopup") {
      document.querySelector(".loading-point").value = code;
      document.querySelector(".loading-point-desc").value = desc;
    } else if (popup.id === "unloadingPopup") {
      document.querySelector(".unloading-point").value = code;
      document.querySelector(".unloading-point-desc").value = desc;
    }

    popup.style.display = "none";
  });
});
