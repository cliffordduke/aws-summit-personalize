import React, { useState, useEffect, useContext } from 'react'

import { Movie } from './Movie'
import { Grid, ResponsiveContext } from 'grommet';
import { UserContext } from '../contexts';

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

  function addToSelection(id: number) {
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
                  addToSelection={addToSelection}
                  key={recommendation}
                  id={recommendation} />
              ))
            }
          </Grid>
        )
      }
    </ResponsiveContext.Consumer>
  )
}