# BigQuery Release Notes Web Hub

A premium, modern dark-themed web application built with Python Flask and vanilla HTML, CSS, and JS that fetches, parses, and formats the official Google BigQuery release notes RSS feed, featuring a clean presentation, auto-syncing, manual refresh controls, and integrated Twitter/X sharing.

## Features
- **Feed Parser**: Dynamically fetches and parses RSS feed entries from `https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`.
- **Elegant Theme**: Implements sleek modern typography (`Outfit`/`Inter` from Google Fonts), glassmorphic elements, hover transitions, and a customized responsive grid.
- **Refresh Flow**: Supports instantaneous reloading with visual state indicators (loading spinner).
- **Twitter/X Integration**: One-click sharing button next to each release note that generates a truncated tweet with relevant hashtags (`#BigQuery #GoogleCloud`).

## Project Structure
```
bq-release-notes/
├── app.py                     # Flask server & backend API
├── templates/
│   └── index.html             # Main dashboard UI template
├── static/
│   ├── css/
│   │   └── style.css          # Design tokens & responsive styles
│   └── js/
│       └── app.js             # Client-side refresh & tweet parser logic
├── .gitignore                 # Excluded environments/caches
└── README.md                  # Project documentation
```

## Setup & Run

1. **Clone & Enter directory**
   ```bash
   git clone https://github.com/CJC-ds/carl-event-talks-app.git
   cd carl-event-talks-app
   ```

2. **Configure Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install flask requests feedparser
   ```

4. **Launch Server**
   ```bash
   python app.py
   ```
   Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.
