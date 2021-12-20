module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('User', {
    // id가 기본적으로 들어있다.
    content: {
    	type: DataTypes.TEXT,
	    allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });
  Comment.associate = (db) => {
  };
  return Comment;
}