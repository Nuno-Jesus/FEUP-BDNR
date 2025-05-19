# MongoDB Lab

## Questions
1. **Q** - What is the total number of articles in the collection?
**Answer** - 842 

```MongoDB
db.dblp_nosql.find.countDocuments()
```

2. How many articles are open (“info.access” property)?
**Answer** - 191 

```MongoDB
db.dblp_nosql.find(
   { "info.access": "open" }
).count()
```

3. What is the number of articles per year?
**Answer** 
```MongoDB
[
	{ _id: '2010', count: 3 },
	{ _id: '2011', count: 17 },
	{ _id: '2012', count: 21 },
	{ _id: '2013', count: 48 },
	{ _id: '2014', count: 76 },
	{ _id: '2015', count: 116 },
	{ _id: '2016', count: 129 },
	{ _id: '2017', count: 105 },
	{ _id: '2018', count: 96 },
	{ _id: '2019', count: 76 },
	{ _id: '2020', count: 80 },
	{ _id: '2021', count: 61 },
	{ _id: '2022', count: 14 }
]
```

```MongoDB
db.dblp_nosql.aggregate([
	{ $group: { 
		_id: "$info.year",
		count: { $count: {} } 
	}},
	{ $sort: {"_id": 1 } }
])
```

4. How many articles were published in journals?
**Answer** - 228 

```MongoDB
db.dblp_nosql.find(
	{ "info.type" : { $regex : "Journal" } },
).count()
```

5. How many articles are single authored (one author only)?
**Answer** - 98 

```MongoDB
db.dblp_nosql.find(
	{ "info.authors.author" : {
		$not : { $type : "array" } } 
	},
).count()
```

6. What is the distribution of articles per number of authors? Only consider articles with 2 or more authors.
**Answer**

```MongoDB
[
  { _id: 3, nArticles: 246 },
  { _id: 2, nArticles: 175 },
  { _id: 4, nArticles: 159 },
  { _id: 5, nArticles: 93 },
  { _id: 6, nArticles: 38 },
  { _id: 7, nArticles: 21 },
  { _id: 8, nArticles: 5 },
  { _id: 9, nArticles: 3 },
  { _id: 10, nArticles: 3 },
  { _id: 11, nArticles: 1 }
]

```

```MongoDB

db.dblp_nosql.aggregate([
	{ 
		$match: {
			$and : [
				{ "info.authors.author" : { $type : "array" }},
				{ "info.authors.author" : { $gte : [{ $size : "$info.authors.author" }, 2]} }
			]
		}
	},
	{ $group: { 
		_id: { $size: "$info.authors.author" },
		nArticles: { $count: {} },
	}},
	{ $sort: {"nArticles": -1 } }
])

```

7. Who are the authors with the most papers published?
**Answer**

```MongoDB
[
  { _id: 'Stefanie Scherzinger', count: 28 },
  { _id: 'Uta Störl', count: 25 },
  { _id: 'Gilles Zurfluh', count: 22 },
  { _id: 'Meike Klettke', count: 21 },
  { _id: 'Amal Ait Brahim', count: 20 },
  { _id: 'Ronaldo dos Santos Mello', count: 18 },
  { _id: 'Olivier Teste', count: 16 },
  { _id: 'Fatma Abdelhédi', count: 16 },
  { _id: 'Mohammed El Malki', count: 14 },
  { _id: 'Jorge Bernardino', count: 11 },
  { _id: 'Arlind Kopliku', count: 11 },
  { _id: 'Maristela Holanda', count: 11 },
  { _id: 'Max Chevalier', count: 11 },
  { _id: 'Anne Laurent', count: 10 },
  { _id: 'Arnaud Castelltort', count: 9 },
  { _id: 'Rabah Tighilt Ferhat', count: 9 },
  { _id: 'Ronan Tournier', count: 9 },
  { _id: 'Wouter Joosen', count: 9 },
  { _id: 'Faten Atigui', count: 8 },
  { _id: 'Norbert Ritter', count: 8 }
]

```

```MongoDB
db.dblp_nosql.aggregate( [ 
	{ $unwind: "$info.authors.author" },
	{ $group: { 
		_id: "$info.authors.author.text",
		count: { $count: {} } 
	}}, 
	{ $sort: {"count": -1 } }
] )
```

## MongoDB Lab

Use `make up` to start the MongoDB container, and `make populate` to populate the database (only once!!!).