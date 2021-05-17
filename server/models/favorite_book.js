const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('favorite_book', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'member',
        key: 'id'
      }
    },
    single_published_book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'single_published_book',
        key: 'id'
      }
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    serialization_book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'serialization_book',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'favorite_book',
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
        name: "member_id",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
      {
        name: "favorite_book_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "single_published_book_id" },
        ]
      },
      {
        name: "favorite_book_serialization_book_id_fk",
        using: "BTREE",
        fields: [
          { name: "serialization_book_id" },
        ]
      },
    ]
  });
};
