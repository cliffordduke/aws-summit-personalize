const fetch = require('node-fetch')
const Bottleneck = require('bottleneck')
const csv = require('csvtojson')
const AWS = require('aws-sdk')
const path = require('path')
const winston = require('winston')
const crypto = require('crypto')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'output.log' })
  ]
})

AWS.config.update({
  region: 'us-west-2'
})

const s3 = new AWS.S3()
const client = new AWS.DynamoDB.DocumentClient()

const api = 'a4f205071663396357b793ab4dba6e52'

const limiter = new Bottleneck({
  minTime: 250
})

async function process (movie) {
  let detailsPath = `https://api.themoviedb.org/3/movie/tt${movie.imdbId}?api_key=${api}&language=en-US`
  let res = await fetch(detailsPath)
  if (!res.ok) {
    logger.error(movie.movieId)
    return movie.movieId
  }
  let movieDetails = await res.json()
  let imagePath = await imageToS3(`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`, movie.movieId)
  logger.info(`[${movie.movieId}] [${imagePath}]`)
  await updateDynamoDB(movie.movieId, imagePath)
  return movie.movieId
}

async function updateDynamoDB (movieId, imagePath) {
  let params = {
    TableName: 'movies',
    Key: {
      'movieId': parseInt(movieId)
    },
    UpdateExpression: 'set posterPath = :x',
    ExpressionAttributeValues: {
      ':x': imagePath
    }
  }
  await client.update(params).promise()
}

async function imageToS3 (posterPath, movieId) {
  let imgRes = await fetch(posterPath)
  let key = `posters/${crypto.randomBytes(20).toString('hex')}${path.extname(posterPath)}`
  await s3.upload({
    Bucket: 'aws-summit-hk-personalens',
    Key: key,
    Body: imgRes.body
  }).promise()
  return key
}

async function readFile () {
  return csv().fromFile('../dataset/links.csv')
}

async function missingArtwork (lastEvaluatedKey) {
  let params = {
    TableName: 'movies',
    FilterExpression: 'attribute_not_exists(posterPath)'
  }
  if (lastEvaluatedKey) {
    params = {
      ExclusiveStartKey: {
        movieId: lastEvaluatedKey
      },
      ...params
    }
  }
  return client.scan(params).promise()
}

async function main () {
  const movieData = await readFile()
  let size = movieData.length
  let current = 1
  for (const movie of movieData) {
    limiter.schedule(() => process(movie)).then((movieId) => console.log(`Completed ${current++} of ${size} (${movieId})`))
  }
}

async function main2 () {
  let lastEvaluatedKey
  do {
    let results = await missingArtwork(lastEvaluatedKey)
    for (const movie of results.Items) {
      limiter.schedule(() => process(movie)).then((movieId) => console.log(`Completed ${movieId}`))
    }
    lastEvaluatedKey = results.LastEvaluatedKey
  } while (lastEvaluatedKey)
}

main2()
