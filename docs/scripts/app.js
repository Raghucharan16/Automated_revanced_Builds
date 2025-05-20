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
  "reddit": "Reddit ReVanced",
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

    const latestBuilds = {};

    releases.forEach(release => {
      release.assets.forEach(asset => {
        if (asset.name.includes('-arm64-v8a-') && !asset.name.includes('beta')) {
          const appName = asset.name.split('-arm64-v8a-')[0];
          if (!latestBuilds[appName]) {
            latestBuilds[appName] = { release, asset };
          }
        }
      });
    });

    const releaseList = document.getElementById('release-list');
    if (!releaseList) throw new Error('Release list element not found');

    releaseList.innerHTML = ''; // Clear existing content

    for (const appName in latestBuilds) {
      const { release, asset } = latestBuilds[appName];
      const displayName = appDisplayNames[appName] || toTitleCase(appName) + ' ReVanced';
      const releaseDate = new Date(release.published_at).toLocaleDateString();

      const releaseCard = document.createElement('div');
      releaseCard.className = 'release-card';
      releaseCard.innerHTML = `
        <img src="icons/${appName}.png" alt="${displayName}">
        <h3>${displayName}</h3>
        <p>Published: ${releaseDate}</p>
        <a href="${asset.browser_download_url}" class="download-btn">Download</a>
        <p><a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases" target="_blank">View All Releases</a></p>
      `;
      releaseList.appendChild(releaseCard);
    }
  } catch (error) {
    console.error('Error:', error);
    const releaseList = document.getElementById('release-list');
    if (releaseList) {
      releaseList.innerHTML = '<p>Error loading releases. Please try again later.</p>';
    }
  }
}

fetchLatestBuilds();
