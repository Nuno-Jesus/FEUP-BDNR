<?php

require 'mongo.php';

if (isset($_GET['topic'])) {
    $topicId = new MongoDB\BSON\ObjectId($_GET['topic']);
    $topic = $collection->findOne(['_id' => $topicId]);
} else {
    $topics = $collection->find();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MiniForum</title>
</head>
<body>
    <h1>MiniForum</h1>
    <p>
      <a href="index.php">Home</a>
      |
      <a href="new_topic.html">Start a new topic!</a>
    </p>
    <hr>
    
    <?php if (isset($topic)): ?>
        <h2><?php echo htmlspecialchars($topic['title']); ?></h2>
        <p><?php echo nl2br(htmlspecialchars($topic['body'])); ?></p>
        <p><strong>--</strong> <?php echo htmlspecialchars($topic['author']); ?></p>
        <hr>

        <h3>Comments:</h3>
        <ul>
            <?php foreach ($topic['comments'] ?? [] as $comment): ?>
                <li><strong><?php echo htmlspecialchars($comment['author']); ?>: </strong><?php echo htmlspecialchars($comment['text']); ?></li>
            <?php endforeach; ?>
        </ul>
        
        <form method="POST" action="new_comment.php">
            <input type="hidden" name="topic" value="<?php echo $topic['_id']; ?>">
            <textarea name="comment" required></textarea>
            <br>
            <label for="author">Author:</label>
            <input type="text" name="author" placeholder="Your name or leave empty" style="border: 0; border-bottom: 1px solid black; margin: 5px 0;">
            <br>
            <button type="submit">Add new comment!</button>
        </form>
    <?php else: ?>
        <h2>Topics</h2>
        <ul>
            <?php foreach ($topics as $t): ?>
                <li><a href="?topic=<?php echo $t['_id']; ?>"><?php echo htmlspecialchars($t['title']); ?></a>
                    <?php if (count($t['comments']) !== 0) : ?>
                        <em>(<?php echo htmlspecialchars(count($t['comments'])); ?> comments)</em></li>
                    <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
    <hr>
</body>
</html>
