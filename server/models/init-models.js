var DataTypes = require("sequelize").DataTypes;
var _author = require("./author");
var _book = require("./book");
var _book_detail = require("./book_detail");
var _cart = require("./cart");
var _category = require("./category");
var _favorite_author = require("./favorite_author");
var _favorite_book = require("./favorite_book");
var _identification = require("./identification");
var _member = require("./member");
var _notification = require("./notification");
var _purchase = require("./purchase");
var _review = require("./review");
var _review_statistics = require("./review_statistics");
var _withdrawal = require("./withdrawal");

function initModels(sequelize) {
  var author = _author(sequelize, DataTypes);
  var book = _book(sequelize, DataTypes);
  var book_detail = _book_detail(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var favorite_author = _favorite_author(sequelize, DataTypes);
  var favorite_book = _favorite_book(sequelize, DataTypes);
  var identification = _identification(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var review_statistics = _review_statistics(sequelize, DataTypes);
  var withdrawal = _withdrawal(sequelize, DataTypes);

  withdrawal.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(withdrawal, { as: "withdrawals", foreignKey: "author_id"});
  book_detail.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(book_detail, { as: "book_details", foreignKey: "book_id"});
  favorite_book.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(favorite_book, { as: "favorite_books", foreignKey: "book_id"});
  cart.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(cart, { as: "carts", foreignKey: "book_detail_id"});
  purchase.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(purchase, { as: "purchases", foreignKey: "book_detail_id"});
  review.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(review, { as: "reviews", foreignKey: "book_detail_id"});
  review_statistics.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(review_statistics, { as: "review_statistics", foreignKey: "book_detail_id"});
  book.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(book, { as: "books", foreignKey: "category_id"});
  author.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasOne(author, { as: "author", foreignKey: "member_id"});
  book.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(book, { as: "books", foreignKey: "author_id"});
  cart.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(cart, { as: "carts", foreignKey: "member_id"});
  favorite_author.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(favorite_author, { as: "favorite_authors", foreignKey: "member_id"});
  favorite_author.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(favorite_author, { as: "author_favorite_authors", foreignKey: "author_id"});
  favorite_book.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(favorite_book, { as: "favorite_books", foreignKey: "member_id"});
  notification.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(notification, { as: "notifications", foreignKey: "member_id"});
  purchase.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(purchase, { as: "purchases", foreignKey: "member_id"});
  review.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(review, { as: "reviews", foreignKey: "member_id"});

  return {
    author,
    book,
    book_detail,
    cart,
    category,
    favorite_author,
    favorite_book,
    identification,
    member,
    notification,
    purchase,
    review,
    review_statistics,
    withdrawal,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
