const aws = require('aws-sdk');

const db = new aws.DynamoDB.DocumentClient();

exports.get_movie = async function (event) {
  let result = await db.get({ TableName: 'movies', Key: { 'movieId': parseInt(event.pathParameters.movieId) } }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};

exports.get_user = async function (event) {
  let user = await db.get({ TableName: 'users', Key: { 'userId': parseInt(event.pathParameters.userId) } }).promise();

  console.log(user);
  let queryParams = {
    TableName: 'movie_likes',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': parseInt(event.pathParameters.userId)
    }
  };
  let userMovies;
  try {
    userMovies = await db.query(queryParams).promise();
    console.log(userMovies);
  } catch (err) {
    console.log(err);
  }

  let likes = userMovies.Items.map(item => ({ movieId: item.movieId, timestamp: item.timestamp }));

  return {
    statusCode: 200,
    body: JSON.stringify({ ...user.Item, likes })
  };
};
