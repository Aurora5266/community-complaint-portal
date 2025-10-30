// ==================== Navbar Toggle ====================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ==================== Handle Issue Submission ====================
  const issueForm = document.getElementById("issueForm");
  const successMsg = document.getElementById("successMsg");

  if (issueForm) {
    issueForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const location = document.getElementById("location").value.trim();
      const description = document.getElementById("description").value.trim();
      const photoFile = document.getElementById("photo").files[0];

      if (!name || !email || !location || !description) return;

      const newIssue = {
        id: Date.now(),
        name,
        email,
        location,
        description,
        photo: "",
        status: "Incomplete",
      };

      if (photoFile) {
        const reader = new FileReader();
        reader.onload = () => {
          newIssue.photo = reader.result;
          saveIssue(newIssue);
        };
        reader.readAsDataURL(photoFile);
      } else {
        saveIssue(newIssue);
      }
    });
  }

  function saveIssue(issue) {
    const issues = JSON.parse(localStorage.getItem("issues")) || [];
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));

    if (successMsg) {
      successMsg.innerText = "✅ Issue submitted successfully!";
      setTimeout(() => (successMsg.textContent = ""), 4000);
    }
  }

  // ==================== Display on HOME PAGE ====================
  if (window.location.pathname.includes("home.html")) {
    const container = document.querySelector(".issue-cards");
    const storedIssues = JSON.parse(localStorage.getItem("issues")) || [];

    storedIssues.forEach((issue) => {
      const card = document.createElement("div");
      card.classList.add("issue-card");
      card.innerHTML = `
        <img src="${issue.photo || "https://via.placeholder.com/400"}" alt="Issue">
        <div class="issue-info">
          <p><strong>Description:</strong> ${issue.description}</p>
          <p><strong>Location:</strong> ${issue.location}</p>
          <p><strong>Reported by:</strong> ${issue.name}</p>
          <p class="status ${issue.status.toLowerCase()}">Status: ${issue.status}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==================== Display on ADMIN PAGE ====================
  if (window.location.pathname.includes("admin.html")) {
    const adminSection = document.querySelector(".admin-section");
    const notLoggedInSection = document.querySelector(".not-loggedin-section");

    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");

    if (isLoggedIn !== "true") {
      notLoggedInSection.classList.remove("hidden");
      adminSection.classList.add("hidden");
      return;
    }

    // Show admin dashboard if logged in
    adminSection.classList.remove("hidden");
    notLoggedInSection.classList.add("hidden");

    const tbody = document.querySelector(".admin-table tbody");
    const storedIssues = JSON.parse(localStorage.getItem("issues")) || [];

    // ✅ Append new issues below dummy ones
    storedIssues.forEach((issue) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${issue.photo || "https://via.placeholder.com/100"}" alt="Issue Image"></td>
        <td>${issue.description}<br><small><b>${issue.name}</b>, ${issue.location}</small></td>
        <td><span class="status ${issue.status.toLowerCase()}">${issue.status}</span></td>
        <td>
          <select class="status-select" data-id="${issue.id}">
            <option ${issue.status === "Incomplete" ? "selected" : ""}>Incomplete</option>
            <option ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option ${issue.status === "Complete" ? "selected" : ""}>Complete</option>
          </select>
          <button class="btn-delete" data-id="${issue.id}">Remove</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // === Status Change ===
    tbody.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-select")) {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        const issues = JSON.parse(localStorage.getItem("issues")) || [];
        const updated = issues.map((i) =>
          i.id == id ? { ...i, status: newStatus } : i
        );
        localStorage.setItem("issues", JSON.stringify(updated));
        e.target.closest("tr").querySelector(".status").textContent = newStatus;
        e.target.closest("tr").querySelector(".status").className =
          "status " + newStatus.toLowerCase();
      }
    });

    // === Delete Issue ===
    tbody.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        let issues = JSON.parse(localStorage.getItem("issues")) || [];
        issues = issues.filter((i) => i.id != id);
        localStorage.setItem("issues", JSON.stringify(issues));
        e.target.closest("tr").remove();
      }
    });
  }
});
