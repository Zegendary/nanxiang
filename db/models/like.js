'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    target: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    creator: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {});
  return Like;
};
