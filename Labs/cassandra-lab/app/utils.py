import hashlib
from urllib.parse import urlparse

def md5_hash(url):
    return hashlib.md5(url.encode('utf-8')).hexdigest()

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False