// import React from 'react';
// import { connect } from "react-redux";

// class Badge extends React.Component {
//   constructor(props) {
//     super(props)

//   }
  

//   buildBdges() {
//     this.props.badges.
//   }
// }

// <Col md={{ span: 3 }}>
//                     <Card style={{ width: '100%' }}>
//                       <Card.Img variant="top" src={medalicon} />
//                       <Card.Body>
//                         <Card.Title>Minor Second Proficiency</Card.Title>
//                         <Card.Text>
//                         </Card.Text>
//                         <Button variant="primary">Train</Button>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                   <Col md={{ span: 3 }}>
//                     <Card style={{ width: '100%' }}>
//                       <Card.Img variant="top" src={medalicon} />
//                       <Card.Body>
//                         <Card.Title>Major Second Proficiency</Card.Title>
//                         <Card.Text>
//                         </Card.Text>
//                         <Button variant="primary">Train</Button>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                   <Col md={{ span: 3 }}>
//                     <Card style={{ width: '100%' }}>
//                       <Card.Img variant="top" src={medalicon} />
//                       <Card.Body>
//                         <Card.Title>Minor Third Proficiency</Card.Title>
//                         <Card.Text>
//                         </Card.Text>
//                         <Button variant="primary">Train</Button>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                   <Col md={{ span: 3 }}>
//                     <Card style={{ width: '100%' }}>
//                       <Card.Img variant="top" src={medalicon} />
//                       <Card.Body>
//                         <Card.Title>Major Third Proficiency</Card.Title>
//                         <Card.Text>
//                         </Card.Text>
//                         <Button variant="primary">Train</Button>
//                       </Card.Body>
//                     </Card>
//                   </Col>

<Col md={2}>
            <Row>
              <h3>Completed Badges</h3>
            </Row>
            <Row>
              <Col md={12}>

                {Object.entries(this.props.badges).filter(badge => badge[1] === "completed").map(badge => {
                  return (
                    <Row>
                      <Card style={{ width: '100%' }} className="border rounded border-dark">
                        <Card.Img variant="top" src={medalicon} />
                        <Card.Body>
                          <Card.Title>{badgeNames[badge[0]]}</Card.Title>
                        </Card.Body>
                      </Card>
                      <br />
                    </Row>
                    
                )
                })}
              </Col>
            </Row>
            <Row>
              <h3>Locked Badges</h3>
            </Row>
            <Row>
              {Object.entries(this.props.badges).filter(badge => badge[1] === "locked").map(badge => {
                return (
                  <Card style={{ width: '25%' }} className="border rounded border-dark">
                    <Card.Img variant="top" src={medalicon} />
                    <Card.Body>
                      <Card.Title>{badgeNames[badge[0]]}</Card.Title>
                    </Card.Body>
                  </Card>
                )
              })}
            </Row>
          </Col>