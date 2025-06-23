// document.addEventListener('DOMContentLoaded', () => {
//         let userData = {};
//         let reposData = [];
//         let languageStats = {};

//         async function analyzeProfile() {
//             const username = document.getElementById('usernameInput').value.trim();
//             if (!username) {
//                 alert('Please enter a GitHub username');
//                 return;
//             }

//             const resultContainer = document.getElementById('resultContainer');
//             resultContainer.style.display = 'block';
//             resultContainer.innerHTML = '<div class="loading">🔍 Analyzing profile...</div>';

//             try {
//                 // Fetch user data
//                 const userResponse = await fetch(`https://api.github.com/users/${username}`);
//                 if (!userResponse.ok) throw new Error('User not found');
//                 userData = await userResponse.json();

//                 // Fetch repositories
//                 const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
//                 reposData = await reposResponse.json();

//                 // Process language statistics
//                 await processLanguageStats();

//                 // Display all data
//                 displayProfile();
//                 displayRepositories();
//                 displayInsights();

//                 // Add show class for animations
//                 setTimeout(() => {
//                     resultContainer.classList.add('show');
//                 }, 100);

//             } catch (error) {
//                 resultContainer.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
//             }
//         }

//         async function processLanguageStats() {
//             languageStats = {};
//             for (const repo of reposData.slice(0, 20)) { // Limit to avoid rate limiting
//                 if (repo.language) {
//                     languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
//                 }
//             }
//         }

//         function displayProfile() {
//             document.getElementById('userAvatar').src = userData.avatar_url;
//             document.getElementById('userName').textContent = userData.name || 'No name provided';
//             document.getElementById('userHandle').textContent = `@${userData.login}`;
//             document.getElementById('userBio').textContent = userData.bio || '';
//             document.getElementById('userLocation').textContent = userData.location ? `📍 ${userData.location}` : '';
//             document.getElementById('userCompany').textContent = userData.company ? `🏢 ${userData.company}` : '';
//             document.getElementById('userBlog').innerHTML = userData.blog ? `🔗 <a href="${userData.blog}" target="_blank">${userData.blog}</a>` : '';

//             document.getElementById('followersCount').textContent = userData.followers;
//             document.getElementById('followingCount').textContent = userData.following;
//             document.getElementById('reposCount').textContent = userData.public_repos;
//             document.getElementById('gistsCount').textContent = userData.public_gists;

//             const resultContainer = document.getElementById('resultContainer');
//             resultContainer.innerHTML = `
//                 <div class="profile-section">
//                     <h3 class="section-title">👤 Profile Overview</h3>
//                     <div class="profile-header">
//                         <img class="avatar" src="${userData.avatar_url}" alt="Avatar">
//                         <div class="profile-info">
//                             <h2>${userData.name || 'No name provided'}</h2>
//                             <div class="username">@${userData.login}</div>
//                             <div>${userData.bio || ''}</div>
//                             <div>${userData.location ? `📍 ${userData.location}` : ''}</div>
//                             <div>${userData.company ? `🏢 ${userData.company}` : ''}</div>
//                             <div>${userData.blog ? `🔗 <a href="${userData.blog}" target="_blank">${userData.blog}</a>` : ''}</div>
//                         </div>
//                     </div>
//                     <div class="profile-stats">
//                         <div class="stat-card">
//                             <div class="stat-number">${userData.followers}</div>
//                             <div class="stat-label">Followers</div>
//                         </div>
//                         <div class="stat-card">
//                             <div class="stat-number">${userData.following}</div>
//                             <div class="stat-label">Following</div>
//                         </div>
//                         <div class="stat-card">
//                             <div class="stat-number">${userData.public_repos}</div>
//                             <div class="stat-label">Repositories</div>
//                         </div>
//                         <div class="stat-card">
//                             <div class="stat-number">${userData.public_gists}</div>
//                             <div class="stat-label">Gists</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="repos-section">
//                     <h3 class="section-title">📁 Public Repositories</h3>
//                     <div id="repositoriesList"></div>
//                 </div>

//                 <div class="insights-section">
//                     <h3 class="section-title">📊 Developer Insights</h3>

//                     <div class="chart-container">
//                         <h4>Language Usage</h4>
//                         <canvas id="languageChart" width="400" height="200"></canvas>
//                     </div>

//                     <div class="chart-container">
//                         <h4>Contribution Activity Heatmap</h4>
//                         <div class="heatmap" id="contributionHeatmap"></div>
//                     </div>

//                     <div class="chart-container">
//                         <h4>Repository Metrics</h4>
//                         <canvas id="metricsChart" width="400" height="200"></canvas>
//                     </div>
//                 </div>

//                 <div class="export-section">
//                     <h3 class="section-title">💾 Export Data</h3>
//                     <div class="export-buttons">
//                         <button class="export-btn" onclick="exportData('json')">Export JSON</button>
//                         <button class="export-btn" onclick="exportData('csv')">Export CSV</button>
//                         <button class="export-btn" onclick="exportData('excel')">Export Excel</button>
//                     </div>
//                 </div>
//             `;

//             displayRepositories();
//             displayInsights();
//         }

//         function displayRepositories() {
//             const reposList = document.getElementById('repositoriesList');
//             reposList.innerHTML = reposData.slice(0, 10).map(repo => `
//                 <div class="repo-item">
//                     <div class="repo-header">
//                         <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
//                         <div class="repo-stats">
//                             <span>⭐ ${repo.stargazers_count}</span>
//                             <span>🍴 ${repo.forks_count}</span>
//                         </div>
//                     </div>
//                     <div class="repo-description">${repo.description || 'No description available'}</div>
//                     <div class="repo-tags">
//                         ${repo.language ? `<span class="tag language-tag">${repo.language}</span>` : ''}
//                         ${repo.topics ? repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('') : ''}
//                         <span class="tag">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
//                     </div>
//                 </div>
//             `).join('');
//         }

//         function displayInsights() {
//             // Language Chart
//             const languageCtx = document.getElementById('languageChart').getContext('2d');
//             const languages = Object.keys(languageStats);
//             const counts = Object.values(languageStats);

//             new Chart(languageCtx, {
//                 type: 'doughnut',
//                 data: {
//                     labels: languages,
//                     datasets: [{
//                         data: counts,
//                         backgroundColor: [
//                             '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
//                             '#dda0dd', '#98d8c8', '#6c5ce7', '#fd79a8', '#fdcb6e'
//                         ]
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     plugins: {
//                         legend: {
//                             labels: { color: 'white' }
//                         }
//                     }
//                 }
//             });

//             // Generate contribution heatmap
//             generateContributionHeatmap();

//             // Metrics Chart
//             const metricsCtx = document.getElementById('metricsChart').getContext('2d');
//             const topRepos = reposData.slice(0, 5);

//             new Chart(metricsCtx, {
//                 type: 'bar',
//                 data: {
//                     labels: topRepos.map(repo => repo.name),
//                     datasets: [{
//                         label: 'Stars',
//                         data: topRepos.map(repo => repo.stargazers_count),
//                         backgroundColor: '#4ecdc4'
//                     }, {
//                         label: 'Forks',
//                         data: topRepos.map(repo => repo.forks_count),
//                         backgroundColor: '#ff6b6b'
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     scales: {
//                         y: { ticks: { color: 'white' } },
//                         x: { ticks: { color: 'white' } }
//                     },
//                     plugins: {
//                         legend: {
//                             labels: { color: 'white' }
//                         }
//                     }
//                 }
//             });
//         }

//         function generateContributionHeatmap() {
//             const heatmap = document.getElementById('contributionHeatmap');
//             heatmap.innerHTML = '';

//             // Generate 365 days of mock contribution data
//             for (let i = 0; i < 365; i++) {
//                 const cell = document.createElement('div');
//                 cell.className = 'heatmap-cell';

//                 // Random contribution level (0-4)
//                 const level = Math.floor(Math.random() * 5);
//                 if (level > 0) {
//                     cell.classList.add(`active-${level}`);
//                 }

//                 heatmap.appendChild(cell);
//             }
//         }

//         function exportData(format) {
//             const exportData = {
//                 profile: userData,
//                 repositories: reposData,
//                 languageStats: languageStats,
//                 exportDate: new Date().toISOString()
//             };

//             const filename = `github_analysis_${userData.login}_${new Date().toISOString().split('T')[0]}`;

//             if (format === 'json') {
//                 downloadFile(JSON.stringify(exportData, null, 2), `${filename}.json`, 'application/json');
//             } else if (format === 'csv') {
//                 const csv = convertToCSV(reposData);
//                 downloadFile(csv, `${filename}.csv`, 'text/csv');
//             } else if (format === 'excel') {
//                 // Mock Excel export (would need additional library in real implementation)
//                 alert('Excel export feature coming soon! Use CSV for now.');
//             }
//         }

//         function convertToCSV(data) {
//             const headers = ['Name', 'Description', 'Language', 'Stars', 'Forks', 'Updated'];
//             const rows = data.map(repo => [
//                 repo.name,
//                 repo.description || '',
//                 repo.language || '',
//                 repo.stargazers_count,
//                 repo.forks_count,
//                 repo.updated_at
//             ]);

//             return [headers, ...rows].map(row =>
//                 row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
//             ).join('\n');
//         }

//         function downloadFile(content, filename, contentType) {
//             const blob = new Blob([content], { type: contentType });
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = filename;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//         }

//         // Allow Enter key to trigger search
//         document.getElementById('usernameInput').addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 analyzeProfile();
//             }
//         });
//         });

// Show/hide containers
function showProfileContainer() {
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("profileContainer").style.display = "block";
}

function showMainContainer() {
  document.getElementById("mainContainer").style.display = "block";
  document.getElementById("profileContainer").style.display = "none";
}

// Input & Button
const userInp = document.querySelector("#usernameInput");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", function () {
  const username = userInp.value.trim();

  if (username.length === 0) {
    alert("Please enter a GitHub username.");
    location.reload();
    throw new Error("No username provided");
  }

  showSkeleton(); // Show skeleton UI

  getProfile(username)
    .then(function (data) {
      updateUI(data);
      showProfileContainer();
    })
    .catch((err) => {
      alert("Something went wrong.");
      location.reload();
      throw err;
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
  avatar.src = "spinner.gif"; // Replace with your loader/spinner image
  avatar.classList.add("avatar-loading");
}

// Remove skeletons and fill real data
function updateUI(userData) {
  // Avatar with loading class removal
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
}

