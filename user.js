const { Model, DataTypes } = require("sequelize");

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
  },
  {
    sequelize: require("./src/database"),
    modelName: "user",
    timestamps: false,
  }
);

module.exports = User;
