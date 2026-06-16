document.addEventListener("DOMContentLoaded", () => {
    const refreshBtn = document.getElementById("refresh-btn");
    const spinner = document.getElementById("spinner");
    const notesList = document.getElementById("notes-list");
    const errorMessage = document.getElementById("error-message");
    const lastUpdatedSpan = document.getElementById("last-updated");

    async function fetchReleases() {
        // Show spinner
        spinner.classList.add("active");
        refreshBtn.disabled = true;
        errorMessage.style.display = "none";

        try {
            const response = await fetch("/api/releases");
            const data = await response.json();

            if (data.status === "success") {
                renderReleases(data.entries);
                const now = new Date();
                lastUpdatedSpan.textContent = `Last synced: ${now.toLocaleTimeString()}`;
            } else {
                throw new Error(data.message || "Failed to load release notes");
            }
        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = "block";
        } finally {
            spinner.classList.remove("active");
            refreshBtn.disabled = false;
        }
    }

    function renderReleases(entries) {
        notesList.innerHTML = "";
        
        if (entries.length === 0) {
            notesList.innerHTML = "<p>No release notes found.</p>";
            return;
        }

        entries.forEach(entry => {
            const card = document.createElement("div");
            card.className = "note-card";

            // Format date helper
            let displayDate = "";
            if (entry.published) {
                const dateObj = new Date(entry.published);
                displayDate = dateObj.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } else {
                displayDate = entry.updated || "Recent Update";
            }

            // Clean title slightly if needed
            const title = entry.title || "BigQuery Update";

            // Create safe text preview for tweet
            // We strip HTML tags from content for a clean tweet message
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = entry.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || "";
            const tweetText = truncateTweetText(`BigQuery Update (${displayDate}): ${title} - ${textContent}`);

            card.innerHTML = `
                <div class="note-header">
                    <div class="note-meta">
                        <span class="note-date">${displayDate}</span>
                        <h3 class="note-title">${title}</h3>
                    </div>
                    <button class="note-tweet-btn" data-tweet-text="${encodeURIComponent(tweetText)}">
                        <svg viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Tweet
                    </button>
                </div>
                <div class="note-body">
                    ${entry.content}
                </div>
            `;

            // Attach event listener for the tweet button
            const tweetBtn = card.querySelector(".note-tweet-btn");
            tweetBtn.addEventListener("click", () => {
                const text = decodeURIComponent(tweetBtn.getAttribute("data-tweet-text"));
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(twitterUrl, "_blank");
            });

            notesList.appendChild(card);
        });
    }

    function truncateTweetText(text) {
        // Clean double spaces/newlines
        let cleanText = text.replace(/\s+/g, " ").trim();
        // Twitter allows 280 characters. We leave some buffer room for link/hashtags
        const limit = 250;
        if (cleanText.length > limit) {
            return cleanText.substring(0, limit - 3) + "... #BigQuery #GoogleCloud";
        }
        return cleanText + " #BigQuery #GoogleCloud";
    }

    // Initial load
    fetchReleases();

    refreshBtn.addEventListener("click", fetchReleases);
});
