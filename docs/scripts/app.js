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

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

async function fetchLatestBuilds() {
  try {
    const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
    if (!response.ok) throw new Error('Failed to fetch releases');
    const releases = await response.json();

    const latestBuilds = new Map();

    // Process releases in reverse chronological order
    releases.forEach(release => {
      release.assets.forEach(asset => {
        const name = asset.name.toLowerCase();
        
        // Check for arm64-v8a and stable build
        if (name.includes('-arm64-v8a') && 
            !name.includes('beta') && 
            !name.includes('experiments') &&
            !name.includes('-extended')) {
          
          const appKey = asset.name.split('-arm64-v8a')[0].toLowerCase();
          if (!latestBuilds.has(appKey)) {
            latestBuilds.set(appKey, { release, asset });
          }
        }
      });
    });

    const releaseList = document.getElementById('release-list');
    if (!releaseList) throw new Error('Release list element not found');

    releaseList.innerHTML = '';

    // Convert Map to array and sort alphabetically
    Array.from(latestBuilds.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([appKey, { release, asset }]) => {
        const displayName = appDisplayNames[appKey] || toTitleCase(appKey) + ' ReVanced';
        const releaseDate = new Date(release.published_at).toLocaleDateString();

        const releaseCard = document.createElement('div');
        releaseCard.className = 'release-card';
        releaseCard.innerHTML = `
          <img src="icons/${appKey}.png" alt="${displayName}" onerror="this.style.display='none'">
          <h3>${displayName}</h3>
          <p>Size: ${(asset.size / 1024 / 1024).toFixed(1)} MB</p>
          <p>Published: ${releaseDate}</p>
          <a href="${asset.browser_download_url}" class="download-btn">Download</a>
        `;
        releaseList.appendChild(releaseCard);
      });

  } catch
