import flask
from flask import Flask, jsonify, render_template
import requests
import feedparser

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/releases")
def get_releases():
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
        
        feed = feedparser.parse(response.content)
        
        entries = []
        for entry in feed.entries:
            content = entry.summary if 'summary' in entry else ""
            if not content and 'content' in entry:
                content = entry.content[0].value
                
            entries.append({
                "id": entry.id if 'id' in entry else entry.link,
                "title": entry.title if 'title' in entry else "BigQuery Update",
                "link": entry.link if 'link' in entry else FEED_URL,
                "updated": entry.updated if 'updated' in entry else "",
                "published": entry.published if 'published' in entry else "",
                "content": content
            })
            
        return jsonify({
            "status": "success",
            "feed_title": feed.feed.title if 'title' in feed.feed else "BigQuery Release Notes",
            "entries": entries
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
