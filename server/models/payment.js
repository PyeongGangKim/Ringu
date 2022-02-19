const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment', {
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
    pay_method: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    MID: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    TID: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    paid_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyer_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    MOID: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    auth_date: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    auth_code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    result_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    result_msg: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    buyer_email: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fail_reason: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    failed_at: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fn_cd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fn_name: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    acqu_cd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    acqu_name: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bank_cd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receipt_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    buyer_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    epay_cl: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment',
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
        name: "payment_member_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
    ]
  });
};
