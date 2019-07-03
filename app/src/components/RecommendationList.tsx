import React, { useState, useEffect, useContext } from "react";

import { Movie } from "./Movie";
import { Grid, ResponsiveContext, Text, Box, Button, Heading } from "grommet";
import { UserContext } from "../contexts";
import { Toast } from "./Toast";
import { Save } from "grommet-icons";

interface IRecommendationList {
  match: {
    params: {
      userId: number;
    };
  };
}

interface IUserData {
  likes: { movieId: number; timestamp: number }[];
}

export const RecommendationList: React.FC<IRecommendationList> = ({
  match
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [movieSelection, setMovieSelection] = useState<number[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { userId } = useContext(UserContext);

  const cacheKey = `recommendation:${userId}`;

  function toggleSelection(id: number) {
    if (movieSelection.includes(id))
      setMovieSelection(movieSelection.filter(item => item !== id));
    else setMovieSelection([...movieSelection, id]);
  }

  useEffect(() => {
    async function execute() {
      const cachedResult = localStorage.getItem(cacheKey);
      if (cachedResult) {
        setRecommendations(JSON.parse(cachedResult));
      } else {
        let response = await fetch(
          `https://api-summit.aws.cliffordduke.dev/users/${match.params
            .userId || userId}/recommendation`
        );
        let data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data.recommendations));
        setRecommendations(data.recommendations);
      }
    }
    execute();
  }, [match.params.userId, userId, cacheKey]);

  async function submitChoices() {
    setFormSubmitting(true);
    let payload = {
      sessionId: userId.toString(),
      itemIds: movieSelection.map(movieId => movieId.toString())
    };
    await fetch(
      `https://api-summit.aws.cliffordduke.dev/users/${userId}/record_event`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`history:${userId}`);
    window.location.reload();
  }

  return (
    <React.Fragment>
      <Heading level="2" margin={{ left: "small" }}>
        Your Recommendations
      </Heading>
      <ResponsiveContext.Consumer>
        {size => (
          <Grid
            align="start"
            margin={{ left: "small", right: "small", bottom: "xlarge" }}
            columns={{
              count: "fill",
              size: size === "small" ? "120px" : "300px"
            }}
            gap="medium"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {recommendations.map((recommendation, index) => (
              <Movie
                toggleSelection={toggleSelection}
                key={recommendation}
                id={recommendation}
                imageOnly={size === "small"}
                showGenres={size !== "small"}
                truncateTitle={size !== "small"}
                showTitle={true}
              />
            ))}
          </Grid>
        )}
      </ResponsiveContext.Consumer>
      {movieSelection.length > 0 && (
        <Toast
          position="bottom"
          full="horizontal"
          modal={false}
          responsive={false}
        >
          <Box
            direction="row"
            align="center"
            justify="between"
            elevation="small"
            pad={{ vertical: "small", horizontal: "large" }}
            background="#161E2D"
            gap="medium"
          >
            <Text size="medium">
              Favorite ({movieSelection.length}) movie
              {movieSelection.length > 1 ? "s" : ""}
            </Text>
            <Button
              disabled={formSubmitting}
              color="brand"
              icon={<Save />}
              label={formSubmitting ? "Saving..." : "Save"}
              onClick={submitChoices}
            />
          </Box>
        </Toast>
      )}
    </React.Fragment>
  );
};
