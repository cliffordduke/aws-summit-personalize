import React, { useState, useEffect, useContext } from 'react'

import { Movie } from './Movie'
import { Grid, ResponsiveContext, Text, Box, Button } from 'grommet';
import { UserContext } from '../contexts';
import { Toast } from './Toast';

interface IRecommendationList {
  match: {
    params: {
      userId: number
    }
  }
}

interface IUserData {
  likes: { movieId: number, timestamp: number }[]
}

export const RecommendationList: React.FC<IRecommendationList> = ({ match }) => {
  const [recommendations, setRecommendations] = useState([])
  const [movieSelection, setMovieSelection] = useState<number[]>([])
  const [formSubmitting, setFormSubmitting] = useState(false)

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

  async function submitChoices() {
    setFormSubmitting(true)
    let payload = {
      sessionId: userId.toString(),
      itemIds: movieSelection.map(movieId => movieId.toString())
    }
    await fetch(`https://api-summit.aws.cliffordduke.dev/users/${userId}/record_event`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    window.location.reload();
  }

  return (
    <React.Fragment>
      <ResponsiveContext.Consumer>
        {
          size => (
            <Grid
              align="start"
              margin={{ left: "small", right: "small", bottom: 'xlarge' }}
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
      {movieSelection.length > 0 &&
        <Toast position="bottom" full="horizontal" modal={false}>
          <Box
            direction="row"
            align="center"
            justify="between"
            elevation="small"
            pad={{ vertical: 'xsmall', horizontal: 'large' }}
            background="#161E2D"
            gap="medium"
          >
            <Text size="medium">Favorite ({movieSelection.length}) movie{movieSelection.length > 1 ? 's' : ''}</Text>
            <Button disabled={formSubmitting} color="brand" label={formSubmitting ? "Saving..." : "Save"} onClick={submitChoices} />
          </Box>
        </Toast>
      }

    </React.Fragment>
  )
}