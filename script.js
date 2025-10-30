// ========== Navbar Toggle ==========
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ========== Report Form Logic ==========
const issueForm = document.getElementById("issueForm");
const successMsg = document.getElementById("successMsg");

if (issueForm) {
  issueForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const photoFile = document.getElementById("photo").files[0];

    // Convert image to base64 if photo is provided
    if (photoFile) {
      const reader = new FileReader();
      reader.readAsDataURL(photoFile);
      reader.onload = () => {
        saveIssue(reader.result);
      };
    } else {
      // Save without photo
      saveIssue(null);
    }
  });
}

// Helper function to save issue
function saveIssue(photoBase64) {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const newIssue = {
    id: Date.now(),
    name,
    email,
    location,
    description,
    photo: photoBase64,
    status: "Incomplete",
  };

  const issues = JSON.parse(localStorage.getItem("issues")) || [];
  issues.push(newIssue);
  localStorage.setItem("issues", JSON.stringify(issues));

  issueForm.reset();
  successMsg.innerText = "✅ Issue submitted successfully!";
  setTimeout(() => (successMsg.textContent = ""), 5000);
}
