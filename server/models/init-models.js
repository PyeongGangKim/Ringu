var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _author = require("./author");
var _book = require("./book");
var _book_detail = require("./book_detail");
var _cart = require("./cart");
var _category = require("./category");
var _favorite_author = require("./favorite_author");
var _favorite_author_statistics = require("./favorite_author_statistics");
var _favorite_book = require("./favorite_book");
var _favorite_book_statistics = require("./favorite_book_statistics");
var _identification = require("./identification");
var _member = require("./member");
var _notiCount = require("./notiCount");
var _notification = require("./notification");
var _payment = require("./payment");
var _purchase = require("./purchase");
var _review = require("./review");
var _review_statistics = require("./review_statistics");
var _withdrawal = require("./withdrawal");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var author = _author(sequelize, DataTypes);
  var book = _book(sequelize, DataTypes);
  var book_detail = _book_detail(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var favorite_author = _favorite_author(sequelize, DataTypes);
  var favorite_author_statistics = _favorite_author_statistics(sequelize, DataTypes);
  var favorite_book = _favorite_book(sequelize, DataTypes);
  var favorite_book_statistics = _favorite_book_statistics(sequelize, DataTypes);
  var identification = _identification(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var notiCount = _notiCount(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var review_statistics = _review_statistics(sequelize, DataTypes);
  var withdrawal = _withdrawal(sequelize, DataTypes);

  book_detail.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(book_detail, { as: "book_details", foreignKey: "book_id"});
  favorite_book.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(favorite_book, { as: "favorite_books", foreignKey: "book_id"});
  favorite_book_statistics.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(favorite_book_statistics, { as: "favorite_book_statistics", foreignKey: "book_id"});
  payment.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(payment, { as: "payments", foreignKey: "book_id"});
  review_statistics.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(review_statistics, { as: "review_statistics", foreignKey: "book_id"});
  cart.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(cart, { as: "carts", foreignKey: "book_detail_id"});
  payment.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(payment, { as: "payments", foreignKey: "book_detail_id"});
  purchase.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(purchase, { as: "purchases", foreignKey: "book_detail_id"});
  review.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(review, { as: "reviews", foreignKey: "book_detail_id"});
  review_statistics.belongsTo(book_detail, { as: "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(review_statistics, { as: "review_statistics", foreignKey: "book_detail_id"});
  book.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(book, { as: "books", foreignKey: "category_id"});
  account.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(account, { as: "accounts", foreignKey: "author_id"});
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
  favorite_author_statistics.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasOne(favorite_author_statistics, { as: "favorite_author_statistic", foreignKey: "author_id"});
  favorite_book.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(favorite_book, { as: "favorite_books", foreignKey: "member_id"});
  notiCount.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(notiCount, { as: "notiCounts", foreignKey: "member_id"});
  notification.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(notification, { as: "notifications", foreignKey: "member_id"});
  payment.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(payment, { as: "payments", foreignKey: "member_id"});
  purchase.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(purchase, { as: "purchases", foreignKey: "member_id"});
  review.belongsTo(member, { as: "member", foreignKey: "member_id"});
  member.hasMany(review, { as: "reviews", foreignKey: "member_id"});
  review_statistics.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(review_statistics, { as: "review_statistics", foreignKey: "author_id"});
  withdrawal.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(withdrawal, { as: "withdrawals", foreignKey: "author_id"});
  purchase.belongsTo(payment, { as: "payment", foreignKey: "payment_id"});
  payment.hasMany(purchase, { as: "purchases", foreignKey: "payment_id"});

  return {
    account,
    author,
    book,
    book_detail,
    cart,
    category,
    favorite_author,
    favorite_author_statistics,
    favorite_book,
    favorite_book_statistics,
    identification,
    member,
    notiCount,
    notification,
    payment,
    purchase,
    review,
    review_statistics,
    withdrawal,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
