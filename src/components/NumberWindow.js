// src/components/NumberWindow.js
import React, { useState } from "react";
import axios from "axios";
import { API_URLS, WINDOW_SIZE } from "../config";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Typography } from "@mui/material";

const NumberWindow = () => {
  const [type, setType] = useState("p");
  const [prevWindow, setPrevWindow] = useState([]);
  const [currWindow, setCurrWindow] = useState([]);
  const [fetched, setFetched] = useState([]);
  const [average, setAverage] = useState(0);

  const fetchNumbers = async () => {
    try {
      const res = await axios.get(API_URLS[type]);
      let newNumbers = res.data.numbers || [];

      // Filter out duplicates
      newNumbers = newNumbers.filter((num) => !currWindow.includes(num));
      setFetched(newNumbers);

      // Update window
      const updatedWindow = [...currWindow, ...newNumbers].slice(-WINDOW_SIZE);
      setPrevWindow(currWindow);
      setCurrWindow(updatedWindow);

      // Calculate average
      const avg =
        updatedWindow.reduce((sum, n) => sum + n, 0) / updatedWindow.length;
      setAverage(avg.toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg">
        <Typography variant="h5" gutterBottom>
          Average Calculator Microservice 
        </Typography>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Select Number Type:</Form.Label>
          <Col sm="6">
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="p">Prime</option>
              <option value="f">Fibonacci</option>
              <option value="e">Even</option>
              <option value="r">Random</option>
            </Form.Select>
          </Col>
          <Col sm="3">
            <Button variant="primary" onClick={fetchNumbers}>
              Fetch Numbers
            </Button>
          </Col>
        </Form.Group>

        <Typography variant="body1" className="mb-2">
          <strong>Window Size:</strong> {WINDOW_SIZE}
        </Typography>

        <div className="output-box">
          <p><strong>windowPrevState:</strong> {JSON.stringify(prevWindow)}</p>
          <p><strong>windowCurrState:</strong> {JSON.stringify(currWindow)}</p>
          <p><strong>numbers:</strong> {JSON.stringify(fetched)}</p>
          <p><strong>avg:</strong> {average}</p>
        </div>
      </Card>
    </Container>
  );
};

export default NumberWindow;
