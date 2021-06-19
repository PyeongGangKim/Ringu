const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review_statistics', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    person_number : {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    ]
  });
};
