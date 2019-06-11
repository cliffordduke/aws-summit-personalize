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
  const historyQueryParams = {
    TableName: 'user_recommendation_history',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': parseInt(event.pathParameters.userId)
    }
  };
  const { Items: history } = await db.query(historyQueryParams).promise();

  const likesQueryParams = {
    TableName: 'movie_likes',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': parseInt(event.pathParameters.userId)
    }
  };
  const { Items: movieLikes } = await db.query(likesQueryParams).promise();

  let historyResult = history.map((historyItem) => {
    return {
      event: 'RECOMMENDATION',
      timestamp: historyItem.timestamp,
      items: historyItem.recommendation
    };
  });

  let returnResult = [];

  for (let item in historyResult) {
    let index = parseInt(item);
    returnResult.push(historyResult[index]);
    let hasNext = (historyResult[index + 1] !== undefined);
    let recordEvents = movieLikes.filter((like) => like.timestamp >= historyResult[index].timestamp && (hasNext ? like.timestamp < historyResult[index + 1].timestamp : true));
    let timestamp = Math.min.apply(null, recordEvents.map((r) => r.timestamp));
    let recordEvent = {
      event: 'RECORD',
      timestamp: timestamp,
      items: recordEvents.map((r) => r.movieId)
    };
    returnResult.push(recordEvent);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ userId: event.pathParameters.userId, history: returnResult })
  };
};
