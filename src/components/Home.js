import React, { useState, useEffect } from "react";
import {
    Jumbotron,Card,
    Container} from 'react-bootstrap'
import UserService from "../services/user.service";
import Contact from "./contact";
import About from "./about";
import JsonData from '../data/data.json';



const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <Jumbotron>
          <Container>
            <h1>Tracker Users on UIB's WiFi Access Points</h1>
            <h3>{content}</h3>
          </Container>
      </Jumbotron>

      <About data={JsonData.About} />
      {/*<Contact data={JsonData.Contact} />*/}

      <div id="footer">
        <div className="container text-center">
          <h7>
            &copy; 2020 Isaac Lera and Carlos Guerrero
          </h7>
        </div>
      </div>

    </div>
  );
};

export default Home;
