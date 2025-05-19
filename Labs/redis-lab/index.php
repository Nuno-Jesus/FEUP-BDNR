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
    require __DIR__ . '/redis-data/vendor/autoload.php';

    Predis\Autoloader::register();

    try {
      $redis = new Predis\Client();

      if ($_SERVER["REQUEST_METHOD"] === "GET") {
        if (isset($_GET["tags"]) && !empty($_GET["tags"])) {
          $tags = explode(",", $_GET["tags"]);
          $bookmarks = [];
          $uniqueBookmarks = [];

          foreach ($tags as $tag) {
            $tagged = $redis->smembers("tag:" . $tag);
            foreach ($tagged as $bookmark) {
              $uniqueBookmarks[$bookmark] = true;
            }
          }

          $bookmarks = array_keys($uniqueBookmarks);
        } else {
          $bookmarks = $redis->zrange('bookmarks', 0, 14, 'rev');
        }

        echo "<ul>";

        foreach ($bookmarks as $bookmark_id) {
          $bookmark = "bookmark:" . $bookmark_id;
          $url = $redis->hget($bookmark, 'url');
          echo "<li><p><a href=\"" . htmlspecialchars($url) . "\" target=\"_blank\">" . htmlspecialchars($url) . "</a></p>";
          echo "<p>[ ";
          $tags = $redis->smembers($bookmark . ':tags');
          foreach ($tags as $tag) {
            echo "<a href='?tags=$tag' style='color: blue;'>" . htmlspecialchars($tag) . "</a> ";
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