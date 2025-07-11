import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CodeEditor from "./CodeEditor";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"

function Hello() {
  const [python2Code, setPython2Code] = useState("");
  const [python3Code, setPython3Code] = useState("");
  const [codeChanges, setCodeChanges] = useState("");
  const [python2File, setPython2File] = useState(null);
  const handleModernize = async () => {
    if (!python2Code) {
      setPython3Code("// Input Python 2 Code");
      return;
    }
    setPython3Code("// Translating...");
    try {
      const res = await axios.post("http://localhost:5000/migrate", { code: python2Code });
      if (res.data.status === "success") {
        setPython3Code(res.data.result);
        setCodeChanges(res.data.explain);
      } 
      else {
        setPython3Code("// BackendErr: " + (res.data.message || "Unknown Err"));
      }
    } 
    catch (e: any) {
      setPython3Code("// NetworkErr: " + e.message);
    }
  };

  return (
    <div>
      <h1 style={{textAlign: "center"}}>Python 2 to 3 Modernizer</h1>
      <Container fluid>
        <Row>
          <Col xs={4} style={{ marginBottom: "1rem" }}>
          <CodeEditor
            label="Python 2"
            id="python2Input"
            value={python2Code}
            onChange={setPython2Code}
            placeholder="Paste or upload your Python 2 code here"
            file={python2File}
            setFile={setPython2File}
          />
          <br/>

          </Col>
      
          <Col xs={4} style={{ marginBottom: "1rem" }}>
            <Container fluid>
              <Row>
                <CodeEditor
                  label="Python 3"
                  id="python3Input"
                  value={python3Code}
                  onChange={setPython3Code}
                  placeholder=""
                  file=""
                  setFile=""
                  
                />
              </Row>
              <br/>
              
            </Container>
            <div className="d-flex justify-content-center gap-2 mt-3">
          <Button size="lg" onClick={handleModernize}>Modernize</Button>
          <Button variant="danger" size="lg"
            onClick={() => {
              setPython2Code("");
              setPython3Code("");
              setPython2File(null);
            }}
            >
            Clear
          </Button>
          </div>
          </Col>

          <Col xs={4} style={{ marginBottom: "1rem" }}>
            <Container fluid>
              <Row>
                <Form>
                  <Form.Label htmlFor="codeChangesInput">Code Changes</Form.Label>
                  <Form.Control id="codeChangesInput" value={codeChanges} onChange={(e) => setCodeChanges("")} as="textarea" readOnly></Form.Control>
                  <br/>
                </Form>
              </Row>
            </Container>
          </Col>                           
        </Row>
      </Container> 
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
