const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: 'bank',
        key: 'id'
      }
    },
    account: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'member',
        key: 'id'
      }
    },
    tax_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    promotion_agency_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'author',
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
        name: "author_member_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
      {
        name: "author_bank_fk",
        using: "BTREE",
        fields: [
          { name: "bank" },
        ]
      },
    ]
  });
};
