'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rank = sequelize.define('Rank', {
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {});
  return Rank;
};
