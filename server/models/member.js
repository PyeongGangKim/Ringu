const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('member', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "email"
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    profile: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    is_admin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    age_terms_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    service_terms_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    privacy_terms_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    notice_terms_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    account_active_terms_agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'member',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
