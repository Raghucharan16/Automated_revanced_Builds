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
        icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Photos_icon_%282020%29.svg"
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
        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg"
    },
    "spotify": {
        name: "Spotify ReVanced",
        icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    }
};

async function fetchReleases() {
    try {
        console.log('Fetching releases...');
        const response = await fetch('https://api.github.com/repos/Raghucharan16/Automated_revanced_Builds/releases');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const releases = await response.json();
        console.log('Received releases:', releases);

        // Create Spotify card first
        createFeaturedSpotifyCard();

        const stableBuilds = new Map();

        releases.reverse().forEach(release => {
            release.assets.forEach(asset => {
                const lowerName = asset.name.toLowerCase();
                console.log('Processing asset:', lowerName);

                if (lowerName.includes('arm64-v8a') &&
                   !lowerName.includes('beta') &&
                   !lowerName.includes('experiment') &&
                   !lowerName.includes('strava') &&
                   !lowerName.includes('bili') &&
                    !lowerName.includes('lite') &&
                    !lowerName.includes('tumblr') &&
                    !lowerName.includes('sound')) {
                    
                    const appKeyMatch = lowerName.match(/(.*?)(-arm64-v8a|revanced|beta|stable)/);
                    const appKey = appKeyMatch ? appKeyMatch[1].replace(/-+$/, '') : lowerName.split('-')[0];
                    console.log('Extracted app key:', appKey);

                    if (appKey && !stableBuilds.has(appKey)) {
                        console.log('Adding build for:', appKey);
                        stableBuilds.set(appKey, {
                            asset,
                            release
                        });
                    }
                }
            });
        });

        console.log('Stable builds:', stableBuilds);
        displayReleases(stableBuilds);
        setupThemeToggle();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('release-list').innerHTML = `
            <div class="error">
                Error: ${error.message}. Please check the console for details.
                <br>
                <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases" target="_blank">
                    View Releases Directly on GitHub
                </a>
            </div>
        `;
    }
}

function createFeaturedSpotifyCard() {
    const spotifyCard = document.getElementById('spotify-card');
    const app = appData.spotify;
    
    spotifyCard.innerHTML = `
        <div class="app-header">
            <img src="${app.icon}" 
                 class="app-icon" 
                 alt="${app.name} icon"
                 onerror="this.src='https://www.gstatic.com/android/market_images/web/favicon.ico'">
            <h2 class="app-title">${app.name}</h2>
        </div>
        <div class="meta-info">
            <span>Version: Custom Build</span>
            <span>35.6 MB</span>
            <span>${new Date().toLocaleDateString()}</span>
        </div>
        <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/raw/main/spotify_builds/Spotify.apk" 
           class="download-btn">
            Download Featured Build
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        </a>
    `;
}
function displayReleases(builds) {
    const releaseList = document.getElementById('release-list');
    releaseList.innerHTML = '';

    builds.forEach(({ asset, release }, appKey) => {
        const app = appData[appKey] || {
            name: `${appKey.replace(/-/g, ' ')} ReVanced`,
            icon: 'https://www.gstatic.com/android/market_images/web/favicon.ico'
        };

        const card = document.createElement('div');
        card.className = 'app-card';
        
        // Add MicroG notice for YouTube apps
        const microGNotice = ['youtube', 'youtube-music'].includes(appKey) ? `
            <div class="microg-notice">
                <span class="material-icons">info</span>
                Requires MicroG for non-root installation. 
                <a href="https://github.com/WSTxda/MicroG-RE/releases/download/5.11/microg-release.apk" 
                   target="_blank">Download MicroG</a>
            </div>
        ` : '';

        card.innerHTML = `
            <div class="app-header">
                <img src="${app.icon || `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}" 
                     class="app-icon" 
                     alt="${app.name} icon"
                     onerror="this.src='https://www.gstatic.com/android/market_images/web/favicon.ico'">
                <h2 class="app-title">${app.name}</h2>
            </div>
            ${microGNotice}
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