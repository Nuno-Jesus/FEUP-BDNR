<?php

require 'mongo-data/vendor/autoload.php';

$mongo = new MongoDB\Client();
$db = $mongo->selectDatabase('miniforum');
$collection = $db->topics;

?>
