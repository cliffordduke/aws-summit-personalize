import React, { useState, useEffect } from 'react'
import { Box, Image, Heading, Text, Button } from 'grommet';
import missing_artwork from '../assets/missing-artwork.png'

interface IMovieProps {
  id: number,
  toggleSelection: (id: number) => void
}

interface IMovie {
  movieId: number
  posterPath?: string
  imdbId?: number
  url?: string
  genres?: string[]
  title?: string,
  totalFavorites?: number
}

///onClick={() => addToSelection(movie.movieId)}
export const Movie: React.FC<IMovieProps> = ({ id, toggleSelection }) => {
  const [movie, setMovie]: [IMovie, React.Dispatch<React.SetStateAction<IMovie>>] = useState({ movieId: 0 });
  const [highlight, setHighlight] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function getMovie() {
      const cachedResult = localStorage.getItem(`movie:${id}`)
      if (cachedResult) {
        setMovie(JSON.parse(cachedResult))
      } else {
        let response = await fetch(`https://api-summit.aws.cliffordduke.dev/movies/${id}`)
        let data: IMovie = await response.json()
        localStorage.setItem(`movie:${id}`, JSON.stringify(data))
        setMovie(data)
      }
      setLoaded(true)
    }
    getMovie()
  }, [id])

  return (
    <Box round="xxsmall" elevation="small" overflow="hidden" border={highlight ? { color: 'brand', size: 'small' } : false}>
      <Button
        onClick={() => {
          if (!movie.movieId) return
          setHighlight(!highlight)
          toggleSelection(movie.movieId)
        }}
      >
        <Box height="medium">
          <Image draggable={false} src={movie.posterPath ? `http://assets-summit.aws.cliffordduke.dev/${movie.posterPath}` : missing_artwork} fit="contain" />
        </Box>
        <Box pad={{ horizontal: "small" }}>
          <Box
            margin={{ top: "small" }}
            direction="row"
            align="center"
            justify="between">
            <Box>
              <Heading truncate={true} level="5" margin="none">{movie.title}</Heading>
              <Text color="dark-5" size="small">
                {movie.genres && movie.genres.slice(0, 4).join(' • ')}
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
          <Box round="small">
            <Text color="brand" size="small">
              <strong>{highlight ? 'Selected' : ''}</strong>
            </Text>
          </Box>

          <Box align="end" justify="between" gap="xsmall" pad={{ right: 'small' }}>
            <Text color="dark-5" size="xsmall">{loaded && `${movie.totalFavorites} people like this movie`}</Text>
          </Box>
        </Box>
      </Button>
    </Box >

  )
}
