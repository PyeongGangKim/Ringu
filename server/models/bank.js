const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bank', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      unique: "code_UNIQUE"
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
          { name: "code" },
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
