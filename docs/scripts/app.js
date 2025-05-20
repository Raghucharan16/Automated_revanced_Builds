const appDisplayNames = {
  "bilibili": "Bilibili ReVanced",
  "duolingo": "Duolingo ReVanced",
  "facebook": "Facebook ReVanced",
  "gg-photos": "Google Photos ReVanced",
  "googlenews": "Google News ReVanced",
  "instagram": "Instagram ReVanced",
  "lightroom": "Lightroom ReVanced",
  "messenger": "Messenger ReVanced",
  "photomath": "Photomath ReVanced",
  "pixiv": "Pixiv ReVanced",
  "rar": "RAR ReVanced",
  "reddit": "Reddit ReVanced Extended",
  "soundcloud": "SoundCloud ReVanced",
  "strava": "Strava ReVanced",
  "telegram": "Telegram ReVanced",
  "tiktok": "TikTok ReVanced",
  "tumblr": "Tumblr ReVanced",
  "twitch": "Twitch ReVanced",
  "twitter": "Twitter ReVanced",
  "youtube": "YouTube ReVanced",
  "youtube-lite": "YouTube Lite ReVanced",
  "youtube-music": "YouTube Music ReVanced"
};

async function fetchAndDisplayBuilds() {
  try {
    const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
    if (!response.ok) throw new Error('Network response was not ok');
    const releases = await response.json();

    const apps = new Map();

    // Process all releases
    releases.forEach(release => {
      release.assets.forEach(asset => {
        if (asset.name.includes('arm64-v8a')) {
          const [baseName] = asset.name.split('-arm64-v8a');
          const appKey = baseName.toLowerCase().replace(/-revanced$/, '');
          const variant = asset.name.replace(`${baseName}-arm64-v8a-`, '').replace('.apk', '');

          if (!apps.has(appKey)) {
            apps.set(appKey, {
              displayName: appDisplayNames[appKey] || toTitleCase(appKey),
              builds: []
            });
          }

          apps.get(appKey).builds.push({
            variant: variant.replace(/-/g, ' '),
            downloadUrl: asset.browser_download_url,
            size: (asset.size / 1024 / 1024).toFixed(1) + ' MB',
            publishDate: new Date(release.published_at).toLocaleDateString(),
            assetName: asset.name
          });
        }
      });
    });

    displayApps(apps);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('release-list').innerHTML = `
      <div class="error">
        Failed to load builds. Please check back later or 
        <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases">
          view directly on GitHub
        </a>
      </div>
    `;
  }
}

function displayApps(apps) {
  const releaseList = document.getElementById('release-list');
  releaseList.innerHTML = '';

  // Sort apps alphabetically
  const sortedApps = Array.from(apps.entries()).sort((a, b) => 
    a[1].displayName.localeCompare(b[1].displayName)
  );

  sortedApps.forEach(([appKey, appData]) => {
    const appSection = document.createElement('div');
    appSection.className = 'app-section';
    
    appSection.innerHTML = `
      <div class="app-header">
        <img src="icons/${appKey}.png" alt="${appData.displayName}" 
             onerror="this.style.display='none'">
        <h2>${appData.displayName}</h2>
      </div>
      <div class="builds-container">
        ${appData.builds.map(build => `
          <div class="build-card">
            <div class="build-info">
              <h3>${build.variant}</h3>
              <p>${build.assetName}</p>
              <p>Size: ${build.size}</p>
              <p>Released: ${build.publishDate}</p>
            </div>
            <a href="${build.downloadUrl}" class="download-btn">
              Download
            </a>
          </div>
        `).join('')}
      </div>
    `;

    releaseList.appendChild(appSection);
  });
}

function toTitleCase(str) {
  return str.replace(/-/g, ' ')
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

fetchAndDisplayBuilds();
