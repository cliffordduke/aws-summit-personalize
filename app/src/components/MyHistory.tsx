import React, { useState, useEffect, useContext } from 'react'
import { Grid, Box, Heading } from 'grommet';
import { Movie } from '.';
import { UserContext } from '../contexts';
import moment from 'moment'

interface IMyHistoryInput {
  match: {
    params: {
      userId: number
    }
  }
}

interface IHistoryRecord {
  timestamp: number
  recommendation: number[]
}

const GetOrdinal = (n: number): string => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const MyHistory: React.FC<IMyHistoryInput> = ({ match }) => {
  const [history, setHistory] = useState<IHistoryRecord[]>([])
  const { userId } = useContext(UserContext)

  const cacheKey = `history:${userId}`

  useEffect(() => {
    async function execute() {
      const cachedResult = localStorage.getItem(cacheKey)
      if (cachedResult) {
        setHistory(JSON.parse(cachedResult))
      } else {
        let response = await fetch(`https://api-summit.aws.cliffordduke.dev/users/${match.params.userId || userId}/recommendation/history`);
        let data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data.history))
        setHistory(data.history);
      }
    }
    execute();
  }, [match.params.userId, userId])

  return (
    <Box>
      <Heading level="2" margin={{ left: 'small' }}>Your Recommendation History</Heading>
      {
        history.map((record, index) => (
          <React.Fragment key={record.timestamp}>
            <Heading margin={{ left: 'small', top: "none" }} level="3">{`${GetOrdinal(index + 1)} recommendation`}</Heading>
            <Grid
              align="start"
              margin={{ left: "small", right: "small", bottom: 'medium' }}
              columns={{ count: "fit", size: "xsmall" }}
              gap="medium">
              {
                record.recommendation.slice(0, 30).map((movieId, index) => (
                  <Movie
                    imageOnly={true}
                    key={movieId}
                    id={movieId} />
                ))
              }
            </Grid>
            <hr style={{ borderTop: '1px solid #232F3E' }} />
          </React.Fragment>
        ))
      }
    </Box>
  )
}