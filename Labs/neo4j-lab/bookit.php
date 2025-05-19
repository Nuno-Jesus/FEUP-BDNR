<?php
	require __DIR__ . '/vendor/autoload.php';

	use \Laudis\Neo4j\Authentication\Authenticate;
	use \Laudis\Neo4j\ClientBuilder;

	$auth = Authenticate::basic('neo4j', 'password');
	$client = ClientBuilder::create()
		->withDriver('http', 'http://localhost:7474', $auth)
		->withDefaultDriver('http')
		->build();

	try {
		if ($_SERVER["REQUEST_METHOD"] != "POST") {
			throw new Exception($_SERVER["REQUEST_METHOD"] . ' method not allowed');
		}
		
		$url = trim($_POST["url"]);
		$tags = trim($_POST["tags"]);

		if (!filter_var($url, FILTER_VALIDATE_URL)) {
			die("Invalid URL format.");
		}

		if (empty($tags)) {
			die("No tags provided.");
		}

		$updated = false;

		$bookmarks = $client->run(
			'MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
			WITH b, COLLECT(t.name) AS tags
			RETURN b.url, tags
			ORDER BY b.when_added;'
		);

		foreach ($bookmarks as $bookmark) {
			$existing_url = $bookmark->get('b.url');
			if ($existing_url === $url) {
				$updated = true;
		
				$query = '
					WITH datetime() AS now
					MATCH (b:Bookmark {url: $url})
					SET b.when_added = now
					WITH b, now
					OPTIONAL MATCH (b)-[r:HAS_TAG]->()
					DELETE r
					WITH b, now
					UNWIND $newTags AS tagName
					MERGE (t:Tag {name: tagName})
					MERGE (b)-[:HAS_TAG {when_added: now}]->(t)
				';
		
				$params = [
						'url' => $url,
						'newTags' => explode(" ", $tags)
				];
		
				$client->run($query, $params);
			}
		}

		if (!$updated) {
			$query = '
				WITH datetime() AS now
				MERGE (b:Bookmark {url: $url})
					ON CREATE SET b.when_added = now
				WITH b, now
				UNWIND $tags AS tagName
				MERGE (t:Tag {name: tagName})
				MERGE (b)-[:HAS_TAG {when_added: now}]->(t);
			';

			$params = [
				'url' => $url,
				'tags' => explode(" ", $tags)
			];

			$client->run($query, $params);
		}
		
		header('Location: index.php');

	} catch (Exception $e) {
		echo "Error: " . $e->getMessage();
	}
?>