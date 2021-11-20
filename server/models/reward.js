const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reward', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'member_id',
        key: 'id'
      }
    },

  }, {
    sequelize,
    tableName: 'reward',
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
        name: "reward_member_id_fk",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
    ]
  });
};
