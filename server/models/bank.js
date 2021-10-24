const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bank', {
    id: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      primaryKey: true
    },
    bank: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "bank_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'bank',
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
        name: "code_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "bank_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bank" },
        ]
      },
    ]
  });
};
