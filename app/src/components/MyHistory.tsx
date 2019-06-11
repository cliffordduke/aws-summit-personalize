import React, { useState, useEffect, useContext } from 'react'
import { Grid, Box, Heading } from 'grommet';
import { Movie } from '.';
import { UserContext } from '../contexts';
import { Timeline, Event } from "./timeline";
import { withRouter } from 'react-router';

interface IMyHistoryInput {
  match: {
    params: {
      userId: number
    }
  }
}

interface IHistoryRecord {
  event: 'RECOMMENDATION' | 'RECORD'
  timestamp: number
  items: number[]
}

const GetOrdinal = (n: number): string => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const MyHistory = withRouter(({ match, history: routeHistory }) => {
  const [history, setHistory] = useState<IHistoryRecord[]>([])
  const [currentRecommendation, setCurrentRecommendation] = useState([])

  const { userId } = useContext(UserContext)

  if (!match.params.userId && !userId) routeHistory.push('/')

  const cacheKey = `history:${match.params.userId || userId}`

  useEffect(() => {
    async function execute() {
      const historyCacheResult = localStorage.getItem(cacheKey)
      if (historyCacheResult) {
        setHistory(JSON.parse(historyCacheResult))
      } else {
        let response = await fetch(`https://api-summit.aws.cliffordduke.dev/users/${match.params.userId || userId}/recommendation/history`);
        let data = await response.json();
        console.log(data)
        localStorage.setItem(cacheKey, JSON.stringify(data.history))
        setHistory(data.history);
      }
      const recommendationCacheKey = `recommendation:${match.params.userId || userId}`;
      const recommendationCacheResult = localStorage.getItem(recommendationCacheKey)
      if (recommendationCacheResult) {
        setCurrentRecommendation(JSON.parse(recommendationCacheResult));
      } else {
        let response = await fetch(`https://api-summit.aws.cliffordduke.dev/users/${match.params.userId || userId}/recommendation`);
        let data = await response.json();
        localStorage.setItem(recommendationCacheKey, JSON.stringify(data.recommendations))
        setCurrentRecommendation(data.recommendations);
      }
    }
    execute();
  }, [match.params.userId, userId, cacheKey])
  let recommendationNumbering = 1;
  let recordNumbering = 1;
  const GetHeading = (e: IHistoryRecord) => {
    switch (e.event) {
      case "RECOMMENDATION":
        return `${GetOrdinal(recommendationNumbering++)} generation recommendation`
      case "RECORD":
        return `${GetOrdinal(recordNumbering++)} user choice`
    }
  }
  return (
    <Box>
      <Heading level="2" margin={{ left: 'small' }}>Your Recommendation History</Heading>
      <Timeline>
        {
          history.map((record, index) => (
            <Event backgroundColor={record.event === "RECORD" ? "#fdc500" : "#ff5252"} label={GetHeading(record)} key={index}>
              <Grid
                align="start"
                margin={{ left: "small", right: "small", bottom: 'medium' }}
                columns={{ count: "fill", size: "120px" }}
                gap="medium">
                {
                  record.items.slice(0, 11).map((movieId, index) => (
                    <Movie
                      fill={record.event === "RECOMMENDATION"}
                      imageOnly={true}
                      showTitle={true}
                      key={`${record.timestamp}:${movieId}`}
                      id={movieId} />
                  ))
                }
              </Grid>
            </Event>
          ))
        }
        {history.length > 0 &&
          <Event backgroundColor="#ff5252" label={`Current generation recommendation`}>
            <Grid
              align="start"
              margin={{ left: "small", right: "small", bottom: 'medium' }}
              columns={{ count: "fill", size: "120px" }}
              gap="medium">
              {
                currentRecommendation.slice(0, 11).map((movieId, index) => (
                  <Movie
                    fill={true}
                    imageOnly={true}
                    showTitle={true}
                    key={`current:${movieId}`}
                    id={movieId} />
                ))
              }
            </Grid>
          </Event>
        }
      </Timeline>
    </Box>
  )
})