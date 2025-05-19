<?php
require __DIR__ . '/vendor/autoload.php';

use \Laudis\Neo4j\Authentication\Authenticate;
use \Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', 'password');
$client = ClientBuilder::create()
  ->withDriver('http', 'http://localhost:7474', $auth)
  ->withDefaultDriver('http')
  ->build();

// Create a new Person node and a relationship with a new City.
$client->run(
  'WITH datetime() AS now
  MERGE (b:Bookmark {url: "https://developer.mozilla.org"})
    ON CREATE SET b.when_added = now
  WITH b, now
  OPTIONAL MATCH (b)-[r:HAS_TAG]->()
  DELETE r
  WITH b, now
  MERGE (t1:Tag {name: "documentation"})
  MERGE (t2:Tag {name: "webdev"})
  MERGE (b)-[:HAS_TAG {when_added: now}]->(t1)
  MERGE (b)-[:HAS_TAG {when_added: now}]->(t2)'
);

$client->run(
  'WITH datetime() AS now
  MERGE (b:Bookmark {url: "https://neo4j.com/docs/"})
    ON CREATE SET b.when_added = now
  WITH b, now
  OPTIONAL MATCH (b)-[r:HAS_TAG]->()
  DELETE r
  WITH b, now
  MERGE (t:Tag {name: "neo4j-docs"})
  MERGE (b)-[:HAS_TAG {when_added: now}]->(t)'
);

$client->run(
  'WITH datetime() AS now
  MERGE (b:Bookmark {url: "https://github.com/"})
    ON CREATE SET b.when_added = now
  WITH b, now
  OPTIONAL MATCH (b)-[r:HAS_TAG]->()
  DELETE r
  WITH b, now
  UNWIND ["opensource", "code", "collaboration"] AS tagName
  MERGE (t:Tag {name: tagName})
  MERGE (b)-[:HAS_TAG {when_added: now}]->(t)'
);

?>
