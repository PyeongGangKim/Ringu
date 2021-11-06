const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reward_stat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'member',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'reward_stat',
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
        name: "reward_stat_member_id_fk",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
    ]
  });
};
