async function fetchReleases() {
    try {
        const response = await fetch('https://api.github.com/repos/FiorenMas/Revanced-And-Revanced-Extended-Non-Root/releases');
        const releases = await response.json();
        
        const releaseList = document.getElementById('release-list');
        
        releases.forEach(release => {
            const releaseCard = document.createElement('div');
            releaseCard.className = 'release-card';
            
            releaseCard.innerHTML = `
                <h3>${release.name}</h3>
                <p>Published: ${new Date(release.published_at).toLocaleDateString()}</p>
                <div class="assets">
                    ${release.assets.map(asset => `
                        <a href="${asset.browser_download_url}" class="download-btn">
                            Download ${asset.name}
                        </a>
                    `).join('')}
                </div>
            `;
            
            releaseList.appendChild(releaseCard);
        });
    } catch (error) {
        console.error('Error fetching releases:', error);
    }
}

// Initial load
fetchReleases();
