from utils import md5_hash
from datetime import datetime

def get_bookmark(session, url_md5):
    query = "SELECT * FROM bookmarks WHERE url_md5=%s"
    result = session.execute(query, (url_md5,))
    return result.one()

def get_all_bookmarks(session):
    query = "SELECT * FROM bookmarks"
    result = session.execute(query)
    return sorted(result, key=lambda x: x.timestamp, reverse=True)

def get_bookmarks_by_tags(session, tags):
    bookmarks_by_tag = []
    for tag in tags:
        query = "SELECT url_md5, timestamp FROM bookmarks_by_tags WHERE tag = %s"
        rows = session.execute(query, (tag,))
        bookmarks_by_tag.extend(rows)

    seen = set()
    results = []
    for row in bookmarks_by_tag:
        url_md5 = row.url_md5
        if url_md5 in seen:
            continue
        seen.add(url_md5)

        query = "SELECT * FROM bookmarks WHERE url_md5 = %s"
        bookmark_row = session.execute(query, (url_md5,)).one()
        if bookmark_row:
            results.append(bookmark_row)

    return results

def add_bookmark(session, url, tags):
    url_md5 = md5_hash(url)
    timestamp = datetime.utcnow()

    session.execute(
        """
        INSERT INTO bookmarks (url_md5, url, timestamp, tags)
        VALUES (%s, %s, %s, %s)
        """,
        (url_md5, url, timestamp, set(tags))
    )

    # Insert into bookmarks_by_tags table
    for tag in tags:
        session.execute(
            """
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES (%s, %s, %s, %s)
            """,
            (tag, url_md5, url, timestamp)
        )

    return url_md5
