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

async function fetchLatestBuilds() {
  try {
    const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
    if (!response.ok) throw new Error('Failed to fetch releases');
    const releases = await response.json();

    const latestBuilds = new Map();

    // Process releases in reverse chronological order (newest first)
    releases.reverse().forEach(release => {
      release.assets.forEach(asset => {
        const lowerName = asset.name.toLowerCase();
        
        // Check for arm64-v8a and non-beta builds
        if (lowerName.includes('arm64-v8a') && 
           !lowerName.includes('beta') &&
           !lowerName.includes('experiments') &&
           !lowerName.includes('android-')) {
          
          // Extract base app name
          const appMatch = asset.name.match(/^(.*?)-arm64-v8a/i);
          if (appMatch) {
            const appKey = appMatch[1].toLowerCase().replace(/-revanced$/, '');
            if (!latestBuilds.has(appKey)) {
              latestBuilds.set(appKey, { release, asset });
            }
          }
        }
      });
    });

    const releaseList = document.getElementById('release-list');
    releaseList.innerHTML = '';

    latestBuilds.forEach(({ release, asset }, appKey) => {
      const displayName = appDisplayNames[appKey] || 
        appKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' ReVanced';
      
      const releaseCard = document.createElement('div');
      releaseCard.className = 'release-card';
      releaseCard.innerHTML = `
        <h3>${displayName}</h3>
        <p>Version: ${release.tag_name}</p>
        <p>Size: ${(asset.size / 1024 / 1024).toFixed(1)} MB</p>
        <p>Published: ${new Date(release.published_at).toLocaleDateString()}</p>
        <a href="${asset.browser_download_url}" class="download-btn">
          Download ${asset.name}
        </a>
      `;
      releaseList.appendChild(releaseCard);
    });

  } catch (error) {
    console.error('Error:', error);
    const releaseList = document.getElementById('release-list');
    releaseList.innerHTML = '<p>⚠️ Error loading releases. Please refresh or try later.</p>';
  }
}

fetchLatestBuilds();
