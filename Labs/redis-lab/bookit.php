<?php
	require __DIR__ . '/redis-data/vendor/autoload.php';

	Predis\Autoloader::register();

	try {
		$redis = new Predis\Client();

		if ($_SERVER["REQUEST_METHOD"] != "POST") {
			throw new Exception($_SERVER["REQUEST_METHOD"] . ' method not allowed');
		}
		
		$url = trim($_POST["url"]);
		$tags = trim($_POST["tags"]);

		if (!filter_var($url, FILTER_VALIDATE_URL)) {
			die("Invalid URL format.");
		}

		$updated = false;

		$bookmarks = $redis->zrange('bookmarks', 0, -1);
		foreach ($bookmarks as $bookmark_id) {
			$bookmark = "bookmark:" . $bookmark_id;
			$existing_url = $redis->hget($bookmark, 'url');
			if ($existing_url === $url) {
				$updated = true;
				addTags($redis, $bookmark, $tags);
			}
		}

		if (!$updated) {
			$bookmark_id = $redis->incr("bookmark_id");
			$bookmark = "bookmark:" . $bookmark_id;
			$redis->hset($bookmark, "url", $url);
			$redis->zadd("bookmarks", time(), $redis->get("bookmark_id"));

			addTags($redis, $bookmark, $tags);
		}
		
		header('Location: index.php');

	} catch (Exception $e) {
		echo "Error: " . $e->getMessage();
	}

	function addTags($redis, $bookmark, $tags) {
		$bookmark_id = $redis->get("bookmark_id");
		if (empty($tags)) {
			return ;
		}

		$oldTags = $redis->smembers($bookmark . ":tags");
		if (!empty($oldTags)) {
			$redis->srem($bookmark . ":tags", $oldTags);
			foreach ($oldTags as $old) {
				$redis->srem("tag:" . trim($old), $bookmark_id);
			}
		}
		
		$tagList = explode(" ", $tags);
		foreach ($tagList as $tag) {
			$redis->sadd($bookmark . ":tags", trim($tag));
			$redis->sadd("tag:" . trim($tag), $bookmark_id);
		}
	}
?>