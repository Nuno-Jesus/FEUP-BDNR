from cassandra.cluster import Cluster

try:
    cluster = Cluster()
    session = cluster.connect()

    # Check if keyspace exists
    keyspace_exists = session.execute("""
        SELECT keyspace_name 
        FROM system_schema.keyspaces 
        WHERE keyspace_name = 'bookit'
    """).one() is not None

    if not keyspace_exists:
        session.execute("""
            CREATE KEYSPACE bookit
            WITH replication = {
                'class': 'SimpleStrategy',
                'replication_factor': 2
            }; 
        """)

    session.set_keyspace("bookit")

    # Check if bookmarks table exists
    bookmarks_exists = session.execute("""
        SELECT table_name 
        FROM system_schema.tables 
        WHERE keyspace_name = 'bookit' AND table_name = 'bookmarks'
    """).one() is not None

    if not bookmarks_exists:
        session.execute("""
            CREATE TABLE bookmarks (
                url_md5 TEXT,
                url TEXT,
                timestamp TIMESTAMP,
                tags SET<TEXT>,
                PRIMARY KEY (url_md5)
            );
        """)

    # Check if bookmarks_by_tags table exists
    bookmarks_by_tags_exists = session.execute("""
        SELECT table_name 
        FROM system_schema.tables 
        WHERE keyspace_name = 'bookit' AND table_name = 'bookmarks_by_tags'
    """).one() is not None

    if not bookmarks_by_tags_exists:
        session.execute("""
            CREATE TABLE bookmarks_by_tags (
                tag TEXT,
                url_md5 TEXT,
                url TEXT,
                timestamp TIMESTAMP,
                PRIMARY KEY ((tag), timestamp)
            ) WITH CLUSTERING ORDER BY (timestamp DESC);
        """)

    session.execute("""
        BEGIN BATCH
            INSERT INTO bookmarks (url_md5, url, timestamp, tags)
            VALUES ('93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()), {'education', 'porto'});

            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES (':all:', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));

            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('education', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('porto', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));
        APPLY BATCH;
    """)
    session.execute("""
        BEGIN BATCH
            INSERT INTO bookmarks (url_md5, url, timestamp, tags)
            VALUES ('84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()), {'education', 'porto', 'engineering', 'feup', 'portugal'});

            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES (':all:', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));

            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('education', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('porto', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('engineering', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('feup', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES ('portugal', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
        APPLY BATCH;

    """)    
except Exception as e:
    print(str(e))