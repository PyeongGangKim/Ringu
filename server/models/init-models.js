var DataTypes = require("sequelize").DataTypes;
var _author = require("./author");
var _book = require("./book");
var _cart = require("./cart");
var _category = require("./category");
var _favorite_author = require("./favorite_author");
var _favorite_book = require("./favorite_book");
var _identification = require("./identification");
var _member = require("./member");
var _notification = require("./notification");
var _purchase = require("./purchase");
var _review = require("./review");
var _serialization_book = require("./serialization_book");
var _single_published_book = require("./single_published_book");
var _withdrawal = require("./withdrawal");

function initModels(sequelize) {
  var author = _author(sequelize, DataTypes);
  var book = _book(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var favorite_author = _favorite_author(sequelize, DataTypes);
  var favorite_book = _favorite_book(sequelize, DataTypes);
  var identification = _identification(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var serialization_book = _serialization_book(sequelize, DataTypes);
  var single_published_book = _single_published_book(sequelize, DataTypes);
  var withdrawal = _withdrawal(sequelize, DataTypes);

  favorite_author.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(favorite_author, { as: "favorite_authors", foreignKey: "author_id"});
  serialization_book.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(serialization_book, { as: "serialization_books", foreignKey: "author_id"});
  single_published_book.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(single_published_book, { as: "single_published_books", foreignKey: "author_id"});
  withdrawal.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(withdrawal, { as: "withdrawals", foreignKey: "author_id"});
  cart.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(cart, { as: "carts", foreignKey: "book_id"});
  purchase.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(purchase, { as: "purchases", foreignKey: "book_id"});
  review.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(review, { as: "reviews", foreignKey: "book_id"});
  serialization_book.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(serialization_book, { as: "serialization_books", foreignKey: "category_id"});
  single_published_book.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(single_published_book, { as: "single_published_books", foreignKey: "category_id"});
  author.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasOne(author, { as: "author", foreignKey: "member_id"});
  cart.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(cart, { as: "carts", foreignKey: "member_id"});
  favorite_author.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(favorite_author, { as: "favorite_authors", foreignKey: "member_id"});
  favorite_book.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(favorite_book, { as: "favorite_books", foreignKey: "member_id"});
  notification.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(notification, { as: "notifications", foreignKey: "member_id"});
  purchase.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(purchase, { as: "purchases", foreignKey: "member_id"});
  review.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(review, { as: "reviews", foreignKey: "member_id"});
  book.belongsTo(serialization_book, { as: "serialization_book", foreignKey: "serialization_book_id"});
  serialization_book.hasMany(book, { as: "books", foreignKey: "serialization_book_id"});
  favorite_book.belongsTo(serialization_book, { as: "serialization_book", foreignKey: "serialization_book_id"});
  serialization_book.hasMany(favorite_book, { as: "favorite_books", foreignKey: "serialization_book_id"});
  book.belongsTo(single_published_book, { as: "single_published_book", foreignKey: "single_published_book_id"});
  single_published_book.hasMany(book, { as: "book", foreignKey: "single_published_book_id"});
  favorite_book.belongsTo(single_published_book, { as: "single_published_book", foreignKey: "single_published_book_id"});
  single_published_book.hasMany(favorite_book, { as: "favorite_books", foreignKey: "single_published_book_id"});

  return {
    author,
    book,
    cart,
    category,
    favorite_author,
    favorite_book,
    identification,
    member,
    notification,
    purchase,
    review,
    serialization_book,
    single_published_book,
    withdrawal,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
