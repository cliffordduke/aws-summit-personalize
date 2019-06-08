import React, { useState, useEffect } from 'react'
import { Box, Image, Heading, Text, Button } from 'grommet';


interface IMovieProps {
  id: number,
  addToSelection: (id: number) => void
}

interface IMovie {
  movieId: number
  posterPath?: string
  imdbId?: number
  url?: string
  genres?: string[]
  title?: string
}

///onClick={() => addToSelection(movie.movieId)}
export const Movie: React.FC<IMovieProps> = ({ id, addToSelection }) => {
  const [movie, setMovie]: [IMovie, React.Dispatch<React.SetStateAction<IMovie>>] = useState({ movieId: 0 });
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    async function getMovie() {
      let response = await fetch(`https://api-summit.aws.cliffordduke.dev/movies/${id}`)
      let data: IMovie = await response.json()
      setMovie(data)
    }
    getMovie()
  }, [id])

  return (
    <Box round="xxsmall" elevation="small" overflow="hidden" border={highlight ? { color: 'brand', size: 'small' } : false}>
      <Box height="medium">
        <Image src={`http://assets-summit.aws.cliffordduke.dev/${movie.posterPath}`} fit="contain" />
      </Box>
      <Box pad={{ horizontal: "small" }}>
        <Box
          margin={{ top: "small" }}
          direction="row"
          align="center"
          justify="between">
          <Box>
            <Heading level="5" margin="none">{movie.title}</Heading>
            <Text color="dark-5" size="small">
              {movie.genres && movie.genres.join(' • ')}
            </Text>
          </Box>
        </Box>

      </Box>
      <Box
        tag="footer"
        direction="row"
        align="center"
        justify="between"
        pad={{ left: "small", vertical: "small" }}
      >
        <Button
          onClick={() => {
            setHighlight(true)
            addToSelection(movie.movieId)
          }
          }
        >
          <Box round="small">
            <Text color="brand" size="small">
              <strong>Favorite</strong>
            </Text>
          </Box>
        </Button>
      </Box>
    </Box >
  )
}
