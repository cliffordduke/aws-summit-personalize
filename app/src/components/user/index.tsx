import React, { useState, useEffect } from 'react'

import Movie from '../movie'
import { Heading, Grid, ResponsiveContext } from 'grommet';

interface User {
  match: {
    params: {
      userId: number
    }
  }
}

const User: React.FC<User> = ({ match }) => {
  const [recommendations, setRecommendations] = useState([])

  console.log(match.params.userId)
  useEffect(() => {
    async function execute() {
      let response = await fetch(`https://api-summit.aws.cliffordduke.dev/users/${match.params.userId || '241281902480912'}/recommendation`);
      let data = await response.json();
      console.log(data.recommendations)
      setRecommendations(data.recommendations);
    }
    execute()
  }, [])



  return (
    <ResponsiveContext.Consumer>
      {
        size => (
          <Grid
            align="start"
            columns={size}
            gap="medium">
            {
              recommendations.map((recommendation, index) => (
                <Movie
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

export default User