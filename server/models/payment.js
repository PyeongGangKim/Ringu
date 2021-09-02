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
      allowNull: true,
      references: {
        model: 'member',
        key: 'id'
      }
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'book',
        key: 'id'
      }
    },
    book_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'book_detail',
        key: 'id'
      }
    },
    bank_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    card_code: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    card_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    card_number: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    card_type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    uid: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    paid_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pay_method: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    receipt_url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    pg: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    merchant_uid: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    buyer_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    buyer_tel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    buyer_email: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    buyer_addr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    buyer_postcode: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tax_free_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
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
          { name: "pay_method" },
        ]
      },
      {
        name: "author_book_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "book_id" },
        ]
      },
      {
        name: "payment_book_detail_id_fk_idx",
        using: "BTREE",
        fields: [
          { name: "book_detail_id" },
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
