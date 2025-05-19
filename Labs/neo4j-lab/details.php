<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  
  require __DIR__ . '/vendor/autoload.php';
  
  use \Laudis\Neo4j\Authentication\Authenticate;
  use \Laudis\Neo4j\ClientBuilder;
  use \ReflectionClass;
  use \DateTime;
  use \DateTimeZone;
  
  $auth = Authenticate::basic('neo4j', 'password');
  $client = ClientBuilder::create()
    ->withDriver('http', 'http://localhost:7474', $auth)
    ->withDefaultDriver('http')
    ->build();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookmark Details</title>
</head>
<body>
  <h1>Bookit!</h1>
  <h2>Bookmark Details</h2>
  <hr>

  <?php
    try {
      if (!isset($_GET['url']) || empty($_GET['url'])) {
        echo "<p>No bookmark specified.</p>";
        echo "<p><a href='index.php'>Return to list</a></p>";
      } else {
        $url = $_GET['url'];
        
        $result = $client->run(
          'MATCH (b:Bookmark {url: $url})-[:HAS_TAG]->(t:Tag)
          WITH b, COLLECT(t.name) AS tags
          RETURN b.url, tags, b.when_added',
          ['url' => $url]
        );
        
        if (count($result) === 0) {
          echo "<p>Bookmark not found.</p>";
        } else {
          $bookmark = $result[0];
          $bookmarkUrl = $bookmark->get('b.url');
          $tags = $bookmark->get('tags');
          $whenAdded = $bookmark->hasKey('b.when_added') ? $bookmark->get('b.when_added') : 'Unknown';
          
          if (is_object($whenAdded) && get_class($whenAdded) === 'Laudis\Neo4j\Types\DateTime') {
            // Using this just because DateTime class is not the one from PHP and no methods are available (bruh)
            $reflectionClass = new ReflectionClass($whenAdded);
            
            $secondsProperty = $reflectionClass->getProperty('seconds');
            $secondsProperty->setAccessible(true);
            $seconds = $secondsProperty->getValue($whenAdded);
            
            $dateTime = new DateTime('@' . $seconds);
            $dateTime->setTimezone(new DateTimeZone(date_default_timezone_get()));
            $whenAddedDisplay = $dateTime->format('Y-m-d H:i:s');
          } else {
            $whenAddedDisplay = $whenAdded;
          }
          
          // Display the bookmark information
          echo "<div>";
          echo "<h2>URL</h2>";
          echo "<a href=\"" . htmlspecialchars($bookmarkUrl) . "\" target=\"_blank\">" . htmlspecialchars($bookmarkUrl) . "</a>";
          echo "</div>";
          
          echo "<div>";
          echo "<h2>Added On</h2>";
          echo "<p>" . htmlspecialchars($whenAddedDisplay) . "</p>";
          echo "</div>";
          
          echo "<div>";
          echo "<h2>Tags</h2>";
          if (empty($tags)) {
            echo "<p>[No tags associated with this bookmark.]</p>";
          } else {
            echo "<span> [ ";
            foreach ($tags as $tag) {
              echo "<a href='index.php?tags=" . urlencode($tag) . "'>" . htmlspecialchars($tag) . "</a> ";
            }
            echo "<span>]";
          }
          echo "</div>";
        }
      }
    } catch (Exception $e) {
      echo "<p style='color: red;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    }
  ?>

  <hr>
  
  <div>
    <a href="index.php">Return to bookmarks list</a>
  </div>
</body>
</html> 