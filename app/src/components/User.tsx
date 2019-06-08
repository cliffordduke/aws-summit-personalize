import React, { useState, useEffect, useContext } from 'react'

import { Movie } from './Movie'
import { Grid, ResponsiveContext, Text, Layer, Box, Button } from 'grommet';
import { UserContext } from '../contexts';
import { Toast } from './Toast';

interface User {
  match: {
    params: {
      userId: number
    }
  }
}

export const User: React.FC<User> = ({ match }) => {
  const [recommendations, setRecommendations] = useState([])
  const [movieSelection, setMovieSelection] = useState([0])

  function toggleSelection(id: number) {
    if (movieSelection.includes(id))
      setMovieSelection(movieSelection.filter(item => item !== id))
    else
      setMovieSelection([...movieSelection, id])
  }

  const { userId } = useContext(UserContext)
  useEffect(() => {
    async function execute() {
      let response = await fetch(`https://api-summit.aws.cliffordduke.dev/users/${match.params.userId || userId}/recommendation`);
      let data = await response.json();
      setRecommendations(data.recommendations);
    }
    execute()
  }, [match.params.userId, userId])

  return (
    <React.Fragment>
      <ResponsiveContext.Consumer>
        {
          size => (
            <Grid
              align="start"
              margin={{ left: "small", right: "small" }}
              columns={{ count: "fill", size: "medium" }}
              gap="medium">
              {
                recommendations.map((recommendation, index) => (
                  <Movie
                    toggleSelection={toggleSelection}
                    key={recommendation}
                    id={recommendation} />
                ))
              }
            </Grid>
          )
        }
      </ResponsiveContext.Consumer>
      {movieSelection.length > 1 &&
        <Toast position="bottom" full="horizontal" modal={false}>
          <Box
            direction="row"
            align="center"
            justify="between"
            elevation="small"
            pad={{ vertical: `xsmall`, horizontal: `large` }}
            background="#161E2D"
            gap="medium"
          >
            <Text size="medium">Favorite ({movieSelection.length - 1}) movie{movieSelection.length > 2 ? 's' : ''}</Text>
            <Button color="#FF9900" label="Favorite it!" />
          </Box>
        </Toast>
      }

    </React.Fragment>
  )
}