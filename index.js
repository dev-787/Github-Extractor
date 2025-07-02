// Show/hide containers
function showProfileContainer() {
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("profileContainer").style.display = "block";
  document.getElementById("deepAnalysisContainer").style.display = "none";
}

function showMainContainer() {
  document.getElementById("mainContainer").style.display = "block";
  document.getElementById("profileContainer").style.display = "none";
  document.getElementById("deepAnalysisContainer").style.display = "none";
}

function showDeepAnalysisContainer() {
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("profileContainer").style.display = "none";
  document.getElementById("deepAnalysisContainer").style.display = "block";
}

function hideDeepAnalysisContainer() {
  document.getElementById("deepAnalysisContainer").style.display = "none";
  document.getElementById("profileContainer").style.display = "block";
}

// Input & Button
const userInp = document.querySelector("#usernameInput");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", function () {
  const username = userInp.value.trim().toLowerCase();

  if (username.length === 0) {
    alert("Please enter a GitHub username.");
    return;
  }

  // Show skeleton immediately
  showSkeleton();
  showProfileContainer();
  userInp.value = "";

  getProfile(username)
    .then(function (data) {
      updateUI(data);
    })
    .catch((err) => {
      alert("Error: " + err.message);
      showMainContainer();
    });
});

// Fetch profile data from GitHub API
function getProfile(username) {
  return fetch(`https://api.github.com/users/${username}`).then((raw) => {
    if (!raw.ok) {
      throw new Error("GitHub user not found");
    }
    return raw.json();
  });
}

// Show loading skeletons before actual data
function showSkeleton() {
  const skeletonFields = [
    "#profileName",
    "#profileUsername",
    "#profileBio",
    "#publicRepos",
    "#followersCount",
    "#followingCount",
    "#location",
    "#company",
    "#blog"
  ];

  skeletonFields.forEach((selector) => {
    const el = document.querySelector(selector);
    el.textContent = "";
    el.classList.add("skeleton");
  });

  const avatar = document.querySelector("#profileAvatar");
  avatar.src = "";
  avatar.classList.add("avatar-loading");
}

// Remove skeletons and fill real data
function updateUI(userData) {
  // Avatar
  const avatar = document.querySelector("#profileAvatar");
  avatar.classList.remove("avatar-loading");
  avatar.src = userData.avatar_url;

  // Text fields
  const replaceField = (id, value, fallback = "Not specified") => {
    const el = document.querySelector(id);
    el.textContent = value || fallback;
    el.classList.remove("skeleton");
  };

  replaceField("#profileName", userData.name, "No name provided");
  replaceField("#profileUsername", `@${userData.login}`);
  replaceField("#profileBio", userData.bio, "No bio available");
  replaceField("#publicRepos", userData.public_repos ?? "0");
  replaceField("#followersCount", userData.followers ?? "0");
  replaceField("#followingCount", userData.following ?? "0");
  replaceField("#location", userData.location);
  replaceField("#company", userData.company);

  // Blog/website
  const blogElement = document.querySelector("#blog");
  blogElement.classList.remove("skeleton");
  if (userData.blog) {
    blogElement.innerHTML = `<a href="${userData.blog}" target="_blank">${userData.blog}</a>`;
  } else {
    blogElement.textContent = "No blog";
  }

  // ALSO update the deep-analysis view
  updateDeepAnalysis(userData);
}

// Update Deep Analysis Container with same data
function updateDeepAnalysis(userData) {
  document.getElementById("deepAnalysisAvatar").src = userData.avatar_url;

  document.getElementById("deepAnalysisName").textContent =
    userData.name || "No name provided";

  document.getElementById("deepAnalysisUsername").textContent =
    `@${userData.login}`;

  document.getElementById("deepAnalysisRepos").textContent =
    userData.public_repos ?? "0";

  document.getElementById("deepAnalysisFollowers").textContent =
    userData.followers ?? "0";

  document.getElementById("deepAnalysisFollowing").textContent =
    userData.following ?? "0";

  fetchLatestRepos(userData.login);  
}

// Event listeners for analysis
document.getElementById("showAnalysisBtn").addEventListener("click", function () {
  showDeepAnalysisContainer();
});

document.getElementById("backFromAnalysisBtn").addEventListener("click", function () {
  hideDeepAnalysisContainer();
});

// Fetch latest 5 repositories for a user
function fetchLatestRepos(username) {
  const repoListContainer = document.getElementById("deepAnalysisRepoList");

  // Clear old content (or skeletons)
  repoListContainer.innerHTML = '<p class="loading-text">Loading latest repositories...</p>';

  // Fetch from GitHub
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`)
    .then((response) => {
      if (!response.ok) throw new Error("Could not fetch repositories");
      return response.json();
    })
    .then((repos) => {
      if (repos.length === 0) {
        repoListContainer.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      // Clear the loading text
      repoListContainer.innerHTML = "";

      repos.forEach((repo) => {
        const repoElement = document.createElement("div");
        repoElement.classList.add("repo-item");

        // Make the entire card clickable
        repoElement.style.cursor = "pointer";
        repoElement.addEventListener("click", () => {
          window.open(repo.html_url, "_blank");
        });

        repoElement.innerHTML = `
          <div class="repo-header">
            <div class="repo-name">${repo.name}</div>
            <div class="repo-stats">
              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
            </div>
          </div>
          <div class="repo-description">
            ${repo.description ? repo.description : "No description available."}
          </div>
          <div class="repo-tags">
            ${repo.language ? `<span class="tag language-tag">${repo.language}</span>` : ""}
          </div>
        `;

        repoListContainer.appendChild(repoElement);
      });
    })
    .catch((error) => {
      console.error(error);
      repoListContainer.innerHTML = `<p>Error loading repositories.</p>`;
    });
}

document.querySelector(".analysis1-btn").addEventListener("click", exportUserProfileAsPDF);

function exportUserProfileAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // 1️⃣ Gather all the data you want from the DOM
  const name = document.getElementById("deepAnalysisName").textContent.trim();
  const username = document.getElementById("deepAnalysisUsername").textContent.trim();
  const repos = document.getElementById("deepAnalysisRepos").textContent.trim();
  const followers = document.getElementById("deepAnalysisFollowers").textContent.trim();
  const following = document.getElementById("deepAnalysisFollowing").textContent.trim();

  // 2️⃣ You can add even more fields if you want
  // For example bio, location, company if you store them
  const bio = document.getElementById("profileBio")?.textContent?.trim() || "";
  const location = document.getElementById("location")?.textContent?.trim() || "";
  const company = document.getElementById("company")?.textContent?.trim() || "";

  // 3️⃣ Start writing to PDF
  let y = 20;
  doc.setFontSize(18);
  doc.text("GitHub User Profile", 20, y);

  y += 10;
  doc.setFontSize(12);
  doc.text(`Name: ${name}`, 20, y);

  y += 10;
  doc.text(`Username: ${username}`, 20, y);

  y += 10;
  doc.text(`Bio: ${bio}`, 20, y);

  y += 10;
  doc.text(`Location: ${location}`, 20, y);

  y += 10;
  doc.text(`Company: ${company}`, 20, y);

  y += 10;
  doc.text(`Public Repositories: ${repos}`, 20, y);

  y += 10;
  doc.text(`Followers: ${followers}`, 20, y);

  y += 10;
  doc.text(`Following: ${following}`, 20, y);

  // 4️⃣ Optionally list latest repos (if you rendered them in DOM)
  y += 20;
  doc.setFontSize(14);
  doc.text("Latest Repositories:", 20, y);

  const repoItems = document.querySelectorAll("#deepAnalysisRepoList .repo-item");
  if (repoItems.length === 0) {
    y += 10;
    doc.setFontSize(12);
    doc.text("No repositories found.", 20, y);
  } else {
    repoItems.forEach((item) => {
      const repoName = item.querySelector(".repo-name")?.textContent.trim() || "Unnamed Repo";
      const repoDesc = item.querySelector(".repo-description")?.textContent.trim() || "No description";
      y += 10;
      if (y > 280) {  // new page if needed
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.text(`• ${repoName}`, 20, y);
      y += 7;
      doc.text(`  ${repoDesc}`, 25, y);
    });
  }

  // 5️⃣ Save the PDF
  doc.save(`${username}_profile.pdf`);
}


