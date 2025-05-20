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

const appIcons = {
    "bilibili": "play_circle",
    "duolingo": "language",
    "facebook": "group",
    "gg-photos": "photo_library",
    "googlenews": "article",
    "instagram": "photo_camera",
    "lightroom": "adjust",
    "messenger": "chat",
    "photomath": "calculate",
    "pixiv": "palette",
    "rar": "folder_zip",
    "reddit": "forum",
    "soundcloud": "music_note",
    "strava": "directions_run",
    "telegram": "send",
    "tiktok": "theaters",
    "tumblr": "rss_feed",
    "twitch": "live_tv",
    "twitter": "chat",
    "youtube": "play_circle",
    "youtube-lite": "play_circle_outline",
    "youtube-music": "library_music"
};

async function fetchLatestBuilds() {
    try {
        const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
        if (!response.ok) throw new Error('Failed to fetch releases');
        const releases = await response.json();

        const apps = new Map();

        releases.forEach(release => {
            release.assets.forEach(asset => {
                const lowerName = asset.name.toLowerCase();
                if (lowerName.includes('arm64-v8a')) {
                    const appMatch = lowerName.match(/^(.*?)-arm64-v8a/i);
                    if (appMatch) {
                        const appKey = appMatch[1].replace(/-revanced$/, '');
                        const variant = asset.name
                            .replace(appKey + '-arm64-v8a-', '')
                            .replace('.apk', '')
                            .replace(/-/g, ' ');

                        if (!apps.has(appKey)) {
                            apps.set(appKey, {
                                displayName: appDisplayNames[appKey] || toTitleCase(appKey),
                                builds: []
                            });
                        }

                        apps.get(appKey).builds.push({
                            name: asset.name,
                            size: (asset.size / 1024 / 1024).toFixed(1) + ' MB',
                            date: new Date(release.published_at).toLocaleDateString(),
                            url: asset.browser_download_url
                        });
                    }
                }
            });
        });

        displayApps(apps);
        setupThemeToggle();
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

    Array.from(apps.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([appKey, appData]) => {
            const appSection = document.createElement('div');
            appSection.className = 'release-card';
            appSection.innerHTML = `
                <div class="app-icon">
                    <span class="material-icons">${appIcons[appKey] || 'android'}</span>
                </div>
                <div class="app-info">
                    <h3>${appData.displayName}</h3>
                    <div class="builds">
                        ${appData.builds.map(build => `
                            <div class="build">
                                <div class="meta-info">
                                    <span>${build.name}</span>
                                    <span>${build.size}</span>
                                    <span>${build.date}</span>
                                </div>
                                <a href="${build.url}" class="download-btn">
                                    Download
                                    <span class="material-icons">download</span>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            releaseList.appendChild(appSection);
        });
}

function setupThemeToggle() {
    const themeSwitcher = document.getElementById('theme-switcher');
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function toTitleCase(str) {
    return str.replace(/-/g, ' ')
        .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Initialize
fetchLatestBuilds();
