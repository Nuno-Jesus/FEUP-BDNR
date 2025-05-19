<?php
require 'mongo.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'] ?? '';
    $body = $_POST['body'] ?? '';
    $author = $_POST['author'] ?? '';

    if ($title && $body && $author) {
        $collection->insertOne([
            'title' => $title,
            'body' => $body,
            'author' => $author,
            'comments' => []
        ]);
    }
}

header("Location: index.php");
exit;
?>
