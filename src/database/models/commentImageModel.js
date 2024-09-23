const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CommentImage = sequelize.define(
  "CommentImage",
  {
    imageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Comments",
        key: "commentId",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = CommentImage;
