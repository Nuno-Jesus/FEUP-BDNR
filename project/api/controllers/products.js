const store = require("../config");

// get product by id
async function getProductById(req, res) {
  const session = store.openSession();
  const id = req.params.id;

  try {
    const product = await session.load("products/" + id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch product." });
  }
}

// get similiar products
async function getSimilarProducts(req, res) {
  const session = store.openSession();
  const id = req.params.id;

  try {
    const product = await session.load("products/" + id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const similarProducts = await session
      .query({ indexName: "Products/MoreLikeThis" })
      .moreLikeThis((builder) => builder
        .usingDocument(x => x.whereEquals("id()", `products/${id}`))
        .withOptions({ fields: ["category"] })
      )
      .take(10)
      .all();

    if (!similarProducts || similarProducts.length === 0) {
      return res.status(404).json({ error: "No similar products found." });
    }
    
    res.json(similarProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch similar products." });
  }
}

// get reviews average
async function getReviewsAverage(req, res) {
  const session = store.openSession();
  const id = req.params.id;

  try {
    const product = await session.load("products/" + id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!product.reviews || product.reviews.length === 0) {
      res.json({ averageRating: 0 });
    }

    const rawQuery = `from Products as p where id(p) = 'products/${id}' select timeseries (from p.ReviewScores select average())`;

    const result = await session.advanced
      .rawQuery(rawQuery)
      .firstOrNull();
    
    if (!result || !result.Results || result.Results.length === 0) {
      res.json({ averageRating: 0 });
    }

    const averageRating = result.Results[0].Average[0];

    res.json({ averageRating });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
}

// unified product search and filtering endpoint
async function searchProducts(req, res) {
  const session = store.openSession();
  const {
    name,
    categories,
    minPrice,
    maxPrice,
    discount,
    sortBy,
    sortOrder,
    page,
    limit,
  } = req.body;

  try {
    let query = session.query({ collection: "Products" });

    // Handle name search if provided
    if (name && typeof name === "string" && name.trim() !== '') {
      let searchTerm = name.trim();
      const words = searchTerm.split(/\s+/);
      searchTerm = words.map(word => word + '*').join(' ');
      query = query.search("name", searchTerm, "AND");
    }

    // Apply filters
    if (categories && Array.isArray(categories) && categories.length > 0) {
      query = query.whereIn('category', categories);
    }

    if (minPrice && !isNaN(minPrice)) {
      query = query.whereGreaterThanOrEqual('price', parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      if (parseInt(maxPrice) == parseFloat(maxPrice)) {
        query = query.whereLessThanOrEqual('price', parseFloat(maxPrice - 1));
      } else {
        query = query.whereLessThanOrEqual('price', parseFloat(maxPrice));
      }
    }

    if (discount) {
      query = query.whereBetween('discount', 5, 70);
    }
    
    // Apply sorting
    if (sortBy && sortOrder) {
      if (sortBy === 'price') {
        if (sortOrder === "desc") {
          query = query.orderByDescending('price', 'Double');
        } else {
          query = query.orderBy('price', 'Double');
        }
      } else if (sortBy === 'name') {
        if (sortOrder === "desc") {
          query = query.orderByDescending(sortBy);
        } else if (sortOrder === "asc") {
          query = query.orderBy(sortBy);
        }
      }
    }

    // Apply pagination
    const pageSize = limit || 24;
    const pageNumber = page || 1;
    const skip = (pageNumber - 1) * pageSize;
    
    const results = await query
      .statistics((s) => (stats = s))
      .skip(skip)
      .take(pageSize)
      .all();
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No products found matching the criteria." });
    }
    
    res.json({
      data: results,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalCount: stats.totalResults,
        totalPages: Math.ceil(stats.totalResults / pageSize)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
}

// post review
async function postReview(req, res) {
  const session = store.openSession();
  const id = req.params.id;
  const {
    title,
    text,
    score,
    user,
    date,
  } = req.body;

  try {
    const product = await session.load("products/" + id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push({
      title: title, 
      text: text, 
      score: score,
      user: user,
      date: date
    });

    session.timeSeriesFor("products/" + id, "ReviewScores").append(new Date(), [score], user);
    await session.store(product);
    await session.saveChanges();

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add review." });
  }
}

async function getLowStockProducts(req, res) {
  const session = store.openSession();
  const { page, limit } = req.query;

  try {
    // Apply pagination
    const pageSize = limit ? parseInt(limit) : 24;
    const pageNumber = page ? parseInt(page) : 1;
    const skip = (pageNumber - 1) * pageSize;

    let stats;
    const lowStockProducts = await session
      .query({ collection: "Products" })
      .whereLessThan('stock', 5)
      .whereGreaterThan('stock', 1)
      .statistics((s) => (stats = s))
      .skip(skip)
      .take(pageSize)
      .all();

    res.json({
      data: lowStockProducts,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalCount: stats.totalResults,
        totalPages: Math.ceil(stats.totalResults / pageSize)
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch low stock products." });
  }
}

module.exports = {
  searchProducts,
  getProductById,
  postReview,
  getReviewsAverage,
  getSimilarProducts,
  getLowStockProducts
};