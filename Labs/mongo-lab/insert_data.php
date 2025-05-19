<?php
require 'mongo.php';

$collection->insertOne([
    '_id' => new MongoDB\BSON\ObjectId("6253f564fb5af5db6905f5d3"),
    'title' => "Which NoSQL solution is the best for log analysis?",
    'body' => "Which NoSQL solution is the best for aggregating log records from multiple systems, where each system has a different record schema.",
    'author' => "Bob",
    'comments' => [
        [
            'text' => "It depends.\r\n\r\nI am available for hiring.",
            'author' => "Clueless"
        ],
        [
            'text' => "You can use a document-based data store which provides a flexible solution for evolving and dynamic schema contexts.",
            'author' => "Alice"
        ],
        [
            'text' => "+1 for Alice's comment.",
            'author' => "George"
        ]
    ]
]);

echo "Data inserted successfully!";
?>
