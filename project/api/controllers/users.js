const store = require("../config");

// get all users
async function getAllUsers(req, res) {
  const session = store.openSession();
  const { id } = req.query;

  try {
    if (id) {
      const doc = await session.load(id);
      return res.json(doc || {});
    }

    let query = session.query({ collection: "Users" });

    const results = await query.all();
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

// get user by id
async function getUserById(req, res) {
  const session = store.openSession();
  const id = req.params.id;

  try {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await session.load("users/" + id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
}

// get user orders
async function getUserOrders(req, res) {
  const session = store.openSession();
  const id = req.params.id;

  try {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await session.load("users/" + id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const sortedOrders = user.orders ? [...user.orders].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ) : [];

    res.json(sortedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user orders." });
  }
}

// buy product
async function buyProduct(req, res) {
  const session = store.openSession();
  const id = req.params.id;
  const { address, items } = req.body;

  try {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items. Must be a non-empty array." });
    }

    const user = await session.load("users/" + id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newOrder = {
      date: new Date().toISOString(),
      address: address,
      items: items,
    };

    if (!user.orders) {
      user.orders = [];
    }
    user.orders.push(newOrder);

    await session.store(user);
    await session.saveChanges();

    res.json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to buy product." });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserOrders,
  buyProduct
};