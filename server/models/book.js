const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('book', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "revised_book_title_uindex"
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'author',
            key: 'id'
        }
    },
    is_finished_serialization : {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    serialization_day : {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    book_description : {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id',
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preview: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    sequelize,
    tableName: 'book',
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
    ]
  });
};
