const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('identification', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    identification_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    identification_info: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'identification',
    timestamps: false,
  });
};
