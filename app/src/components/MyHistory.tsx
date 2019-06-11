import React, { useState, useEffect, useContext } from 'react'
import { Grid, Box, Heading } from 'grommet';
import { Movie } from '.';
import { UserContext } from '../contexts';
import { Timeline, Event } from "./timeline";

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
            <Event backgroundColor={record.event === "RECORD" ? "#fdc500" : "#ff5252"} label={GetHeading(record)} key={record.timestamp}>
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
                      key={movieId}
                      id={movieId} />
                  ))
                }
              </Grid>
            </Event>
          ))
        }
      </Timeline>
    </Box>
  )
}