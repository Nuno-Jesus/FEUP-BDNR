from flask import Flask
from cassandra.cluster import Cluster
from flask import Blueprint, render_template, request, redirect, url_for, session
from models import get_bookmark, get_all_bookmarks, get_bookmarks_by_tags, add_bookmark
from utils import is_valid_url

session = None
bp = Blueprint('main', __name__)



def create_keyspace_and_tables(session):
    # Create Keyspace
    session.execute("""
        CREATE KEYSPACE IF NOT EXISTS bookit
        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    """)
    
    # Set Keyspace
    session.set_keyspace('bookit')

    # Create Bookmarks table
    session.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            url_md5 TEXT PRIMARY KEY,
            url TEXT,
            timestamp TIMESTAMP,
            tags SET<TEXT>
        )
    """)

    # Create Bookmarks by Tags table
    session.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks_by_tags (
            tag TEXT,
            url_md5 TEXT,
            url TEXT,
            timestamp TIMESTAMP,
            PRIMARY KEY ((tag), timestamp)
        ) WITH CLUSTERING ORDER BY (timestamp DESC)
    """)

def create_app():
    global session

    app = Flask(__name__)

    cluster = Cluster(['bdnr-cassandra'])
    session = cluster.connect()

    create_keyspace_and_tables(session)  # <-- INIT HERE!

    app.register_blueprint(bp)

    return app

@bp.route('/')
def homepage():
    bookmarks = []
    if request.args.get('tags'):
        tags = request.args.get('tags').split(',')
        bookmarks = get_bookmarks_by_tags(session, tags)
    else:
        bookmarks = get_all_bookmarks(session)

    return render_template('home.html', bookmarks=bookmarks)

@bp.route('/bookmark/<url_md5>')
def bookmark_page(url_md5):
    bookmark = get_bookmark(session, url_md5)
    if not bookmark:
        return "Bookmark not found", 404
    return render_template('bookmark.html', bookmark=bookmark)

@bp.route('/add', methods=['GET', 'POST'])
def add_bookmark_page():
    if request.method == 'POST':
        url = request.form['url'].strip()
        tags = request.form['tags'].split(' ')
        tags = [tag.strip() for tag in tags if tag.strip()]

        if not url:
            return render_template('error.html', error_message="URL cannot be empty")        
        if not is_valid_url(url):
            return render_template('error.html', error_message="Invalid URL format. Please include http:// or https://")    
        if not tags:
            return render_template('error.html', error_message="At least one tag is required")

        add_bookmark(session, url, tags)
        return redirect(url_for('main.homepage'))
    return render_template('add.html')