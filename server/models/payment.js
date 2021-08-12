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
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'book',
          key: 'id'
        }
    },
    book_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'book_detail',
        key: 'id'
      }
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
    bank_name: {
        type: DataTypes.STRING(40),
        //allowNull: false,
    },
    card_name: {
        type: DataTypes.STRING(40),
        //allowNull: false,
    },
    uid: {
        type: DataTypes.INTEGER,
        //allowNull: false,
    },
    paid_amount: {
        type: DataTypes.INTEGER,
        //allowNull: false,
    },
    pay_method: {
        type: DataTypes.INTEGER,
        //allowNull: false,
    },
    receipt_url: {
        type: DataTypes.STRING(200),
        //allowNull: false,
    },
    pg: {
        type: DataTypes.STRING(45),
        //allowNull: false,
    },
    merchant_uid: {
        type: DataTypes.STRING(45),
        //allowNull: false,
    },
    buyer_name: {
        type: DataTypes.STRING(20),
        //allowNull: false,
    },
    buyer_tel: {
        type: DataTypes.STRING(10),
        //allowNull: false,
    },
    buyer_email: {
        type: DataTypes.STRING(20),
        //allowNull: false,
    },
    buyer_addr: {
        type: DataTypes.STRING(50),
        //allowNull: false,
    },
    buyer_postcode: {
        type: DataTypes.STRING(5),
        //allowNull: false,
    },
    item_name: {
        type: DataTypes.STRING(100),
        //allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        //allowNull: false,
    },
    teax_free_amount: {
        type: DataTypes.INTEGER,
        //allowNull: false,
    },
    
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
        name: "member_id",
        using: "BTREE",
        fields: [
          { name: "member_id" },
        ]
      },
      {
        name: "cart_revised_book_id_fk",
        using: "BTREE",
        fields: [
          { name: "book_detail_id" },
        ]
      },
    ]
  });
};
