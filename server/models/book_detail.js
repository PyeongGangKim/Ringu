const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book_detail', {
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
      type: DataTypes.STRING(100),
      allowNull: false
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
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'book',
        key: 'id'
      }
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'book_detail',
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
        name: "book_detail_book_id_fk",
        using: "BTREE",
        fields: [
          { name: "book_id" },
        ]
      },
    ]
  });
};
