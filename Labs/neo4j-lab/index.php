<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookit</title>
</head>
<body>
  <h1>Bookit!</h1>
  <h2>Latest Bookmarks</h2>
  <hr>

  <?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    require __DIR__ . '/vendor/autoload.php';
    
    use \Laudis\Neo4j\Authentication\Authenticate;
    use \Laudis\Neo4j\ClientBuilder;

    $auth = Authenticate::basic('neo4j', 'password');
    
    $client = ClientBuilder::create()
      ->withDriver('http', 'http://localhost:7474', $auth)
      ->withDefaultDriver('http')
      ->build();

    try {
      if ($_SERVER["REQUEST_METHOD"] === "GET") {
        if (isset($_GET["tags"]) && !empty($_GET["tags"])) {
          $tags = explode(",", $_GET["tags"]);
          $tags = array_map('trim', $tags);
          $tags = array_filter($tags);
          
          if (!empty($tags)) {
            $result = $client->run(
              'MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
              WHERE t.name IN $tags
              WITH b, COLLECT(DISTINCT t.name) AS matchedTags
              MATCH (b)-[:HAS_TAG]->(allTags:Tag)
              WITH b, matchedTags, COLLECT(allTags.name) AS tags
              RETURN b.url, tags, matchedTags
              ORDER BY b.when_added DESC',
              [
                'tags' => $tags
              ]
            );
            
            $bookmarks = $result;
          } else {
            $bookmarks = $client->run(
              'MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
              WITH b, COLLECT(t.name) AS tags
              RETURN b.url, tags, [] AS matchedTags
              ORDER BY b.when_added DESC
              LIMIT 10;'
            );
          }
        } else {
          $bookmarks = $client->run(
            'MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
            WITH b, COLLECT(t.name) AS tags
            RETURN b.url, tags, [] AS matchedTags
            ORDER BY b.when_added DESC
            LIMIT 10;'
          );
        }

        echo "<ul>";

        foreach ($bookmarks as $bookmark) {
          $url = $bookmark->get('b.url');
          $tags = $bookmark->get('tags');
          $matchedTags = $bookmark->hasKey('matchedTags') ? $bookmark->get('matchedTags') : [];
      
          echo "<li>";
          echo "<p><a href=\"details.php?url=" . urlencode($url) . "\">" . htmlspecialchars($url) . "</a></p>";
          echo "<p>[ ";

          foreach ($tags as $tag) {
            echo "<a href='?tags=" . urlencode($tag) . "' style='color: blue;'>" . htmlspecialchars($tag) . "</a> ";
          }
          echo " ]</p></li>";
        }
          
        echo "</ul>";
      }
    } catch (Exception $e) {
      echo "<p style='color: red;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    };
  ?>

  <p>
    <a href="index.php">Home</a> |
    <a href="add.html">Add another bookmark</a>!
  </p>
</body>
</html>