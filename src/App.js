import React, { useEffect, useState, useRef } from "react";
import "./App.css";
// import useFetch from './useFetch';
import axios from "axios";
import {
  Accordion,
  Alert,
  Stack,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import SwapiHeader from "./components/SwapiHeader";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pageNext, setPageNext] = useState(0);
  const [pagePrevious, setPagePrevious] = useState(0);
  const nameForm = useRef(null);

  useEffect(() => {
    getData("https://swapi.dev/api/people/?page=1");
  }, []);

  const getData = (endpoint) => {
    axios(endpoint)
      .then((response) => {
        setIsLoading(false);
        console.log("RES", response.data);

        if (response.data.results) {
          setPosts(response.data.results);
          setPageNext(response.data.next);
          setPagePrevious(response.data.previous);
        } else {
          console.log("An error occurred");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("An error happened", error);
      });
  };

  const searchFunc = async () => {
    const searchUrl = `https://swapi.dev/api/people/?search=${nameForm.current.name.value}`;
    getData(searchUrl);
  };

  const postsRender = posts.map((post) => (
    <Accordion key={post.name}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{post.name}</Accordion.Header>
        <Accordion.Body id="accordionBody">
          <div className="label">
            <Alert variant="primary">
              <p>{`Gender: ${post.gender}`}</p>
              <p>{`Height: ${post.height}`}</p>
              <p>{`Mass: ${post.mass}`}</p>
            </Alert>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ));

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    // <Container className="container">
    <div>
      <Row>
        <Col>
          <Stack className="col-lg mx-auto">
            <div>{postsRender.slice(0, 5)}</div>
          </Stack>
        </Col>
        <Col>
          <Stack className="col-lg mx-auto">
            <div>{postsRender.slice(5, 10)}</div>
          </Stack>
        </Col>
      </Row>
    </div>
    /* </Container> */
  );

  return (
    <div>
      <SwapiHeader />

      <Container className="container">
        <div>
          <Row>
            <Col>
              <Stack className="col-lg mx-auto">
                <div id="search_bar" className="mx-auto mt-5">
                  <form ref={nameForm}>
                    <input name={"name"} placeholder="Search character.." />
                  </form>
                </div>
              </Stack>
            </Col>
            <Col>
              <Stack className="col-lg mx-auto">
                <div id="search_bar" className="mx-auto mt-5">
                  <button onClick={() => searchFunc()}>Search</button>
                </div>
              </Stack>
            </Col>
          </Row>
        </div>

        {content}

        <div className="my_button">
          <Row>
            <Col>
              <Stack className="col-lg mx-auto">
                <Button
                  className="mx-auto mt-5"
                  id="previousButton"
                  variant="outline-secondary"
                  disabled={!pagePrevious}
                  onClick={() => getData(pagePrevious)}
                >
                  {`<<< Previous Page`}
                </Button>
              </Stack>
            </Col>
            <Col>
              <Stack className="col-lg mx-auto">
                <Button
                  className="mx-auto mt-5"
                  id="nextButton"
                  variant="outline-secondary"
                  disabled={!pageNext}
                  onClick={() => getData(pageNext)}
                >
                  {`Next Page >>>`}
                </Button>
              </Stack>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default App;
