import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      login: '',
      password: ''
    };
    if (localStorage.getItem('idToken')) {
      props.auth.renewSession();
    }
  }
  onLogin = () =>{
    this.props.auth.login();
  }
  render() {
    return (
      <div className="app flex-row align-items-center" style={{background: '#f2f2f2'}}>
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" sm="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody className="text-center">
                      <h1 className="text-primary mb-1 font-weight-bold">Dietech Software</h1>
                      <p className="text-muted text-center">Sign In to your account</p>
                      <Row>
                        <Col xs="12">
                          <Button color="primary" className="px-4 w-100" onClick={this.onLogin}>Login</Button>
                        </Col>
                      </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
