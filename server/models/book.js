const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    file: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_approved: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
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
    },
    single_published_book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'single_published_book',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'book',
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
    ]
  });
};
