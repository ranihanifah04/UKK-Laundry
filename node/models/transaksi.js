'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // tbl transaksi join ke tabel member *meminta relasi dari child ke parent
      this.belongsTo(models.member,{
        foreignKey: "id_member", as: "member"
      })
      // *meminta relasi dari child ke parent
      this.belongsTo(models.outlet, {
        foreignKey: "id", as:"outlet"
      })

      // tbl transaksi join ke tabel users
      this.belongsTo(models.users, {
        foreignKey: "id_user", as: "user"
      })

      // tbl transaksi join ke tabel detail transaksi *meminta relasi dari parent ke child
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi", as:"detail_transaksi"
      }) 
    }
  };
  transaksi.init({
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_member: DataTypes.INTEGER,
    tgl: DataTypes.DATE,
    batas_waktu: DataTypes.DATE,
    tgl_bayar: DataTypes.DATE,
    status: DataTypes.INTEGER,
    dibayar: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};