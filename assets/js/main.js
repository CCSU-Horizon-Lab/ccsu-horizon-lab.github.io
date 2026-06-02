const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-28% 0px -58% 0px",
      threshold: [0.18, 0.42, 0.7],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// --- Fetch Team Members ---
const membersList = ['Juitar', 'ting0514', 'shuguang-cmd', 'hcc-112'];
const membersTrack = document.getElementById('members-track');

async function loadMembers() {
  if (!membersTrack) return;
  try {
    const promises = membersList.map(username => 
      fetch(`https://api.github.com/users/${username}`).then(res => res.json())
    );
    const membersData = await Promise.all(promises);
    
    let html = '';
    membersData.forEach(user => {
      if(!user.login) return;
      html += `
        <a href="${user.html_url}" class="member-card" target="_blank" rel="noopener">
          <img src="${user.avatar_url}" alt="${user.login}" class="member-avatar">
          <h3 class="member-name">${user.name || user.login}</h3>
          <p class="member-bio">${user.bio || '保持好奇，持续探索。'}</p>
          <span class="member-github">@${user.login}</span>
        </a>
      `;
    });
    
    if(html) {
      membersTrack.innerHTML = html;
    }
  } catch (error) {
    console.error("Failed to load members:", error);
  }
}

// --- Fetch Open Source Projects ---
const projectsTrack = document.getElementById('projects-track');

async function loadProjects() {
  if (!projectsTrack) return;
  try {
    const res = await fetch('https://api.github.com/orgs/CCSU-Horizon-Lab/repos?sort=updated');
    const repos = await res.json();
    
    if(!Array.isArray(repos)) return;
    
    const publicRepos = repos.filter(repo => !repo.private).sort((a,b) => b.stargazers_count - a.stargazers_count);
    
    let html = '';
    publicRepos.forEach(repo => {
      html += `
        <article class="project-card">
          <div class="project-card__header">
            <h3 class="project-card__title">
              ${repo.name}
              <a href="${repo.html_url}" class="external-link" target="_blank" rel="noopener" aria-label="打开仓库">
                <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 3h7v7M13 3L3 13" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </h3>
            <div class="project-card__lang">
              <span class="language-dot" style="background: ${getLangColor(repo.language)}"></span>
              <span>${repo.language || 'Documentation'}</span>
            </div>
          </div>
          <p class="project-card__desc">${repo.description || '探索技术边界的开源试验场。'}</p>
          
          <div class="project-card__footer">
            <span class="star-count">
              <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 2l2 4.5h4.5l-3.5 3.5 1 4.5-4-2.5-4 2.5 1-4.5L1.5 6.5H6z"/>
              </svg>
              ${repo.stargazers_count}
            </span>
            <span class="update-time">Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        </article>
      `;
    });
    
    if(html) {
      projectsTrack.innerHTML = html;
    }
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

function getLangColor(lang) {
  const colors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#41b883',
    'Java': '#b07219'
  };
  return colors[lang] || '#a0aec0';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadMembers();
  loadProjects();
});
