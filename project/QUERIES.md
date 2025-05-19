# RQL Queries

This document contains example RQL queries used in the application.

## Product Queries

### Get Product by ID
```rql
from Products
where id(p) = 'products/123'
```

### Get Similar Products
```rql
from index 'Products/MoreLikeThis' 
where morelikethis(id() = 'products/123', '{ "Fields" : [ "category" ] }')
limit 10
```

### Get Product Reviews Average
```rql
from Products as p 
where id(p) = 'products/123' 
select timeseries (from p.ReviewScores select average())
```

### Simple Product Search
```rql
from Products
where search(name, 'keyboard*', AND)
```

### Search Products with Multiple Filters
```rql
from Products
where search(name, 'gaming* mouse*', AND)
and category = 'mouse'
and price >= 50
and price <= 100
and discount between 5 and 70
order by price desc
limit 1, 24
```
This query demonstrates:
- Text search with wildcards
- Multiple category filtering
- Price range filtering
- Discount filtering
- Sorting
- Pagination (page 0, limit 24)

### Category-Based Product Search
```rql
from Products
where category = 'Components'
```

### Multi-Category Product Search
```rql
from Products
where category in ('Components', 'Storage', 'Memory')
```

### Discounted Products
```rql
from Products
where discount > 0
limit 16
```

### Review a product
> [!NOTE]
> This operations must be performed on the PATCH tab of the Raven Studio.

Average rating is calculated via timeseries data. If a document is not reviewed yet, the timeseries won't have any data. Therefore, there are 2 steps when **manually** creating a review:

1. Add the review to the document.
2. Add the timeseries data to the document.

```rql
from 'Products' as p
where id() = 'products/123'
update {
    this.reviews = [...this.reviews, {
        'user': 'Anonymous',
        'rating': 5,
        'title': 'Great product!',
        'text': 'I love this product!',
        'date': '05/17/2025'
    }]        
}
```

Finally you can add the timeseries data to the document.

```rql
from 'Products' as p
where id() = 'products/123'
update {
    timeseries(this, 'ReviewScores').append(new Date(), [5], 'Anonymous')
}
```

## User Queries

### Get All Users
```rql
from Users
```
Simple query to retrieve all users.

### Get Specific User
```rql
from Users
where id() = 'users/1'
```

### Get User Orders
```rql
from Users as u
where id(u) = 'users/1'
select orders
```

### Update User Orders History
```rql
from Users as u
where id(u) = 'users/1'
update orders += 'products/123'
```
