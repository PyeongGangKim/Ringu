const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review_statistics', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'member',
        key: 'id'
      }
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'book',
        key: 'id'
      }
    },
    book_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'book_detail',
        key: 'id'
      }
    },
    score_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    person_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'review_statistics',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "review_statistics_book_detail_id_fk",
        using: "BTREE",
        fields: [
          { name: "book_detail_id" },
        ]
      },
      {
        name: "review_statistics_book_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "book_id" },
        ]
      },
      {
        name: "review_statistics_author_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
};
