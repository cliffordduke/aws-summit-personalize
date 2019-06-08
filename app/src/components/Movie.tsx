import React, { Props, useState, useEffect } from 'react'
import { number } from 'prop-types';
import { Box, Image, Heading, Text } from 'grommet';


interface IMovieProps {
  id: number
}

interface IMovie {
  movieId?: number
  posterPath?: string
  imdbId?: number
  url?: string
  genres?: string[]
  title?: string
}

export const Movie: React.FC<IMovieProps> = ({ id }) => {
  const [movie, setMovie]: [IMovie, React.Dispatch<React.SetStateAction<IMovie>>] = useState({});
  async function getMovie() {
    let response = await fetch(`https://api-summit.aws.cliffordduke.dev/movies/${id}`)
    let data: IMovie = await response.json()
    setMovie(data)
  }
  useEffect(() => {
    getMovie()
  }, [id])

  return (
    <Box round="xxsmall" elevation="small" overflow="hidden">
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
    </Box>
  )
}
