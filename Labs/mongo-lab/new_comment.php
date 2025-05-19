<?php
require 'mongo.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $topicId = new MongoDB\BSON\ObjectId($_POST['topic']);
    $commentText = $_POST['comment'] ?? '';
    $author = strlen($_POST['author']) !== 0 ? $_POST['author'] : 'Clueless';

    if ($commentText && $author) {
        $collection->updateOne(
            ['_id' => $topicId],
            ['$push' => ['comments' => ['text' => $commentText, 'author' => $author]]]
        );
    }
}

header("Location: index.php?topic=" . $_POST['topic']);
exit;
?>
