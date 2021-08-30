let DataTypes = require("sequelize").DataTypes;
let _author = require("./author");
let _book = require("./book");
let _book_detail = require("./book_detail");
let _cart = require("./cart");
let _category = require("./category");
let _favorite_author = require("./favorite_author");
let _favorite_author_statistics = require("./favorite_author_statistics");
let _favorite_book = require("./favorite_book");
let _favorite_book_statistics = require("./favorite_book_statistics");
let _identification = require("./identification");
let _member = require("./member");
let _notification = require("./notification");
let _purchase = require("./purchase");
let _review = require("./review");
let _review_statistics = require("./review_statistics");
let _withdrawal = require("./withdrawal");
let _notiCount = require("./notiCount");
let _payment = require("./payment");
let _account = require("./account");

function initModels(sequelize) {
  let author = _author(sequelize, DataTypes);
  let book = _book(sequelize, DataTypes);
  let book_detail = _book_detail(sequelize, DataTypes);
  let cart = _cart(sequelize, DataTypes);
  let category = _category(sequelize, DataTypes);
  let favorite_author = _favorite_author(sequelize, DataTypes);
  let favorite_author_statistics = _favorite_author_statistics(sequelize, DataTypes);
  let favorite_book = _favorite_book(sequelize, DataTypes);
  let favorite_book_statistics = _favorite_book_statistics(sequelize, DataTypes);
  let identification = _identification(sequelize, DataTypes);
  let member = _member(sequelize, DataTypes);
  let notification = _notification(sequelize, DataTypes);
  let purchase = _purchase(sequelize, DataTypes);
  let review = _review(sequelize, DataTypes);
  let review_statistics = _review_statistics(sequelize, DataTypes);
  let withdrawal = _withdrawal(sequelize, DataTypes);
  let notiCount = _notiCount(sequelize, DataTypes);
  let payment = _payment(sequelize, DataTypes);
  let account = _account(sequelize, DataTypes);

  withdrawal.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(withdrawal, { as: "withdrawals", foreignKey: "author_id"});
  book_detail.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(book_detail, { as: "book_details", foreignKey: "book_id"});
  favorite_book.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(favorite_book, { as: "favorite_books", foreignKey: "book_id"});
  favorite_book_statistics.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(favorite_book_statistics, { as: "favorite_book_statistics", foreignKey: "book_id"});
  review_statistics.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(review_statistics, { as: "review_statistics", foreignKey: "book_id"});
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
  review_statistics.belongsTo(member, { as: "author", foreignKey: "author_id"});
  member.hasMany(review_statistics, { as: "review_statistics", foreignKey: "author_id"});
  notiCount.belongsTo(member, {as: "member", foreignKey: "member_id"});
  member.hasOne(notiCount, {as: "notiCount", foreignKey: "member_id"});
  payment.belongsTo(member, {as : "member", foreignKey: "member_id"});
  member.hasMany(payment, {as : "payments", foreignKey: "member_id"});
  payment.belongsTo(book_detail, {as : "book_detail", foreignKey: "book_detail_id"});
  book_detail.hasMany(payment, {as : "payments", foreignKey: "book_detail_id"});
  payment.belongsTo(book, {as : "book", foreignKey: "book_id"});
  book.hasMany(payment, {as : "payments", foreignKey: "book_id"});
  payment.hasOne(purchase, {as : "purchase", foreignKey: "payment_id"});
  purchase.belongsTo(payment, {as: "payment", foreignKey: "payment_id"});
  account.belongsTo(member, {as : "author", foreignKey: "author_id"});
  member.hasOne(account, {as : "account", foreignKey: "author_id"});
  favorite_author_statistics.belongsTo(member, {as : "author", foreignKey: "author_id"});
  member.hasOne(favorite_author_statistics, {as : "favorite_author_statistics", foreignKey: "author_id"});

  return {
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
    notification,
    purchase,
    review,
    review_statistics,
    withdrawal,
    notiCount,
    payment,
    account,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
