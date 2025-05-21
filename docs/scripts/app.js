const appData = {
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
    "telegram": {
        name: "Telegram ReVanced",
        domain: "telegram.org"
    },
    "tiktok": {
        name: "TikTok ReVanced",
        domain: "tiktok.com"
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

        // Create Spotify card initially
        createFeaturedSpotifyCard();

        const stableBuilds = new Map();
        const excludedApps = ['bilibili', 'soundcloud', 'strava', 'tumblr', 'youtube-lite'];

        releases.reverse().forEach(release => {
            release.assets.forEach(asset => {
                const lowerName = asset.name.toLowerCase();
                console.log('Processing asset:', lowerName);

                if (lowerName.includes('arm64-v8a') &&
                   !lowerName.includes('beta') &&
                   !lowerName.includes('experiment')) {
                    
                    const appKeyMatch = lowerName.match(/(.*?)(-arm64-v8a|revanced|beta|stable)/);
                    const appKey = appKeyMatch ? appKeyMatch[1].replace(/-+$/, '') : lowerName.split('-')[0];
                    console.log('Extracted app key:', appKey);

                    // Skip excluded apps
                    if (appKey && !excludedApps.includes(appKey) && !stableBuilds.has(appKey)) {
                        console.log('Adding build for:', appKey);
                        stableBuilds.set(appKey, {
                            asset,
                            release
                        });
                    } else if (excludedApps.includes(appKey)) {
                        console.log(`Skipping excluded app: ${appKey}`);
                    }
                }
            });
        });

        console.log('Stable builds:', stableBuilds);
        displayReleases(stableBuilds);
        setupThemeToggle();
        setupAppIcons(stableBuilds);
        setupReviewIssueButton();
        setupViewReviewsButton();

    } catch (error) {
        console.error('Error fetching releases:', error);
        document.getElementById('release-list').innerHTML = `
            <div class="error">
                <p>Error: ${error.message}. Please check the console for details.</p>
                <br>
                <a href="https://github.com/Raghucharan16/Automated_revanced_Builds/releases" target="_blank">
                    View Releases Directly on GitHub
                </a>
            </div>
        `;
        document.getElementById('app-icons-list').innerHTML = `
            <div class="error">
                <p>Failed to load apps. Please try again later.</p>
            </div>
        `;
        // Ensure Spotify card is still visible even if fetch fails
        createFeaturedSpotifyCard();
        setupAppIcons(new Map()); // Call with empty Map to ensure Spotify logo is added
    }
}

function createFeaturedSpotifyCard() {
    const spotifyCard = document.getElementById('spotify-card');
    const app = appData.spotify;
    
    if (!spotifyCard) {
        console.error('Spotify card element not found');
        return;
    }

    spotifyCard.innerHTML = `
        <div class="app-header">
            <img src="${app.icon}" 
                 class="app-icon" 
                 alt="${app.name} icon">
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
    spotifyCard.style.display = 'block';
    console.log('Spotify card created');
}

function displayReleases(builds) {
    const releaseList = document.getElementById('release-list');
    releaseList.innerHTML = '';

    if (builds.size === 0) {
        releaseList.innerHTML = '<p>No stable builds available at this time.</p>';
        return;
    }

    builds.forEach(({ asset, release }, appKey) => {
        const app = appData[appKey] || {
            name: `${appKey.replace(/-/g, ' ')} ReVanced`,
            icon: ''
        };

        const card = document.createElement('div');
        card.className = 'app-card';
        card.dataset.appKey = appKey;
        
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
                     alt="${app.name} icon">
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
    console.log('Releases displayed:', builds.size);
}

function setupAppIcons(builds) {
    const appIconsList = document.getElementById('app-icons-list');
    appIconsList.innerHTML = '';

    const excludedApps = ['bilibili', 'soundcloud', 'strava', 'tumblr', 'youtube-lite'];

    // Always include Spotify, even if builds is empty
    let appKeys = builds.size > 0 ? Array.from(builds.keys()).filter(key => !excludedApps.includes(key)) : [];

    // Ensure 'facebook' is in the list, then insert 'spotify' after it
    const facebookIndex = appKeys.indexOf('facebook');
    if (facebookIndex !== -1) {
        appKeys.splice(facebookIndex + 1, 0, 'spotify');
    } else {
        appKeys.push('spotify'); // Fallback: add Spotify at the end
    }

    if (appKeys.length === 0) {
        appIconsList.innerHTML = '<p>No apps available.</p>';
        return;
    }

    appKeys.forEach(appKey => {
        if (excludedApps.includes(appKey)) {
            console.log(`Skipping icon for excluded app: ${appKey}`);
            return;
        }

        const app = appData[appKey];
        if (!app) {
            console.log(`No app data for: ${appKey}`);
            return;
        }

        const iconDiv = document.createElement('div');
        iconDiv.innerHTML = `
            <img src="${app.icon || `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}" 
                 class="app-icon-sidebar" 
                 alt="${app.name} icon"
                 data-app-key="${appKey}">
        `;
        appIconsList.appendChild(iconDiv);
        console.log(`Added icon for: ${appKey}`);
    });

    // Add click event listeners to app icons
    document.querySelectorAll('.app-icon-sidebar').forEach(icon => {
        icon.addEventListener('click', () => {
            const appKey = icon.getAttribute('data-app-key');
            filterApps(appKey);
        });
    });
}

function filterApps(appKey) {
    const featuredBuildSection = document.getElementById('featured-build');
    const allBuildsSection = document.getElementById('all-builds');
    const spotifyCard = document.getElementById('spotify-card');
    const appCards = document.querySelectorAll('.app-card');

    // Reset visibility of both sections and ensure Spotify card is visible
    featuredBuildSection.style.display = 'none';
    allBuildsSection.style.display = 'none';
    if (spotifyCard) {
        spotifyCard.style.display = 'none';
    }

    if (appKey === 'spotify') {
        // Re-render Spotify card and show its section
        createFeaturedSpotifyCard();
        featuredBuildSection.style.display = 'block';
    } else {
        allBuildsSection.style.display = 'block';
        appCards.forEach(card => {
            card.style.display = card.dataset.appKey === appKey ? 'block' : 'none';
        });
    }

    // Scroll to the top of the main content
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setupReviewIssueButton() {
    const reviewIssueBtn = document.getElementById('review-issue-btn');
    reviewIssueBtn.addEventListener('click', () => {
        window.location.href = 'review-issue.html';
    });
}

function setupViewReviewsButton() {
    const viewReviewsBtn = document.getElementById('view-reviews-btn');
    viewReviewsBtn.addEventListener('click', () => {
        const password = prompt('Please enter the password to view reviews:');
        if (password === 'RBR') {
            window.location.href = 'view-reviews.html';
        } else {
            alert('Incorrect password. Please try again.');
        }
    });
}

// Initialize
fetchReleases();