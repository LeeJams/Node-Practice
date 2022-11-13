const getDb = require("../util/database").getDb;
const e = require("express");
const mongodb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id ? new mongodb.ObjectId(id) : null;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIdx = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    const db = getDb();

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIdx >= 0) {
      newQuantity = this.cart.items[cartProductIdx].quantity + 1;
      updatedCartItems[cartProductIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updateCart = {
      items: updatedCartItems,
    };

    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((n) => n.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((n) => ({
          ...n,
          quantity: this.cart.items.find(
            (m) => m.productId.toString() === n._id.toString()
          ).quantity,
        }));
      })
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
          },
        };

        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };

        db.collection("users").updateOne(
          { _id: this._id },
          { $set: { cart: { items: [] } } }
        );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({'user._id': this._id}).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
