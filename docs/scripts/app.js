const appData = {
    "bilibili": {
        name: "Bilibili ReVanced",
        domain: "bilibili.com"
    },
    "duolingo": {
        name: "Duolingo ReVanced",
        domain: "duolingo.com"
    },
    "facebook": {
        name: "Facebook ReVanced",
        domain: "facebook.com"
    },
    "gg-photos": {
        name: "Google Photos ReVanced",
        domain: "photos.google.com"
    },
    "googlenews": {
        name: "Google News ReVanced",
        domain: "news.google.com"
    },
    "instagram": {
        name: "Instagram ReVanced",
        domain: "instagram.com"
    },
    "lightroom": {
        name: "Lightroom ReVanced",
        domain: "adobe.com"
    },
    "messenger": {
        name: "Messenger ReVanced",
        domain: "messenger.com"
    },
    "photomath": {
        name: "Photomath ReVanced",
        domain: "photomath.com"
    },
    "pixiv": {
        name: "Pixiv ReVanced",
        domain: "pixiv.net"
    },
    "rar": {
        name: "RAR ReVanced",
        domain: "rarlab.com"
    },
    "reddit": {
        name: "Reddit ReVanced Extended",
        domain: "reddit.com"
    },
    "soundcloud": {
        name: "SoundCloud ReVanced",
        domain: "soundcloud.com"
    },
    "strava": {
        name: "Strava ReVanced",
        domain: "strava.com"
    },
    "telegram": {
        name: "Telegram ReVanced",
        domain: "telegram.org"
    },
    "tiktok": {
        name: "TikTok ReVanced",
        domain: "tiktok.com"
    },
    "tumblr": {
        name: "Tumblr ReVanced",
        domain: "tumblr.com"
    },
    "twitch": {
        name: "Twitch ReVanced",
        domain: "twitch.tv"
    },
    "twitter": {
        name: "Twitter ReVanced",
        domain: "twitter.com"
    },
    "youtube": {
        name: "YouTube ReVanced",
        domain: "youtube.com"
    },
    "youtube-lite": {
        name: "YouTube Lite ReVanced",
        domain: "youtube.com"
    },
    "youtube-music": {
        name: "YouTube Music ReVanced",
        domain: "music.youtube.com"
    }
};

async function fetchReleases() {
    try {
        const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
        if (!response.ok) throw new Error('Failed to fetch releases');
        const releases = await response.json();

        const stableBuilds = new Map();

        // Process releases from newest to oldest
        releases.reverse().forEach(release => {
            release.assets.forEach(asset => {
                const lowerName = asset.name.toLowerCase();
                
                // Filter for arm64-v8a stable builds
                if (lowerName.includes('arm64-v8a') &&
                   !lowerName.includes('beta') &&
                   !lowerName.includes('experiment') &&
                   !lowerName.includes('-extended')) {

                    const appKey = asset.name.split('-arm64-v8a')[0].toLowerCase();
                    if (!stableBuilds.has(appKey)) {
                        stableBuilds.set(appKey, {
                            asset,
                            release
                        });
                    }
                }
            });
        });

        displayReleases(stableBuilds);
        setupThemeToggle();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('release-list').innerHTML = `
            <div class="error">
                Failed to load releases. Please try again later or
                <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases" target="_blank">
                    view all releases on GitHub
                </a>
            </div>
        `;
    }
}

function displayReleases(builds) {
    const releaseList = document.getElementById('release-list');
    releaseList.innerHTML = '';

    builds.forEach(({ asset, release }, appKey) => {
        const app = appData[appKey] || {
            name: `${appKey.replace(/-/g, ' ')} ReVanced`,
            domain: 'android.com'
        };

        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-header">
                <img src="https://www.google.com/s2/favicons?domain=${app.domain}&sz=128" 
                     class="app-icon" 
                     alt="${app.name} icon"
                     onerror="this.src='https://www.gstatic.com/android/market_images/web/favicon.ico'">
                <h2 class="app-title">${app.name}</h2>
            </div>
            <div class="meta-info">
                <span>Version: ${release.tag_name}</span>
                <span>${(asset.size / 1024 / 1024).toFixed(1)} MB</span>
                <span>${new Date(release.published_at).toLocaleDateString()}</span>
            </div>
            <a href="${asset.browser_download_url}" class="download-btn">
                Download Stable Build
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </a>
            <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases" 
               class="all-releases"
               target="_blank">
                View All Releases →
            </a>
        `;
        releaseList.appendChild(card);
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize
fetchReleases();
