'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here *meminta relasi dari child ke parent
      this.belongsTo(models.outlet, {
        foreignKey: "id", as: "outlet"
      })
    }
  };
  users.init({
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
    tableName: 'users'
  });
  return users;
};