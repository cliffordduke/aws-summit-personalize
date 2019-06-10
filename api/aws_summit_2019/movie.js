const aws = require('aws-sdk');

const db = new aws.DynamoDB.DocumentClient();

exports.get_movie = async function (event) {
  const movieId = parseInt(event.pathParameters.movieId);

  let result = await db.get({ TableName: 'movies', Key: { 'movieId': movieId } }).promise();
  let movieVotes = await db.query({
    TableName: 'movie_likes',
    IndexName: 'movieId-userId-index',
    KeyConditionExpression: 'movieId = :movieId',
    ExpressionAttributeValues: {
      ':movieId': movieId
    },
    Select: 'COUNT'
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ ...result.Item, totalFavorites: movieVotes.Count })
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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ ...user.Item, likes })
  };
};

exports.get_recommendation_history = async function (event) {
  let queryParams = {
    TableName: 'user_recommendation_history',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': parseInt(event.pathParameters.userId)
    }
  };
  let history = await db.query(queryParams).promise();
  let result = history.Items.map((historyItem) => {
    return {
      timestamp: historyItem.timestamp,
      recommendation: historyItem.recommendation
    };
  });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ userId: event.pathParameters.userId, history: result })
  };
};
