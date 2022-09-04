import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Container, Badge } from 'react-bootstrap'
import { VscChromeClose } from "react-icons/vsc"
import Spinner from 'react-bootstrap/Spinner'

export const MoreInfo = ({ scientificName, modalShow, setModalShow, commonName, image }) => {
  const [sentiment, setSentiment] = useState()
  const [text, setText] = useState()

  useEffect(() => {
    const getPlantSentiment = async () => {
      if (commonName && modalShow) {
        await axios.get(`http://localhost:3001/wiki?name=${commonName}`
        ).then(response => {
          const { sentiment, rawText } = response.data
          setSentiment(sentiment)
          const lines = rawText.split(/\r?\n/)
          console.log('HELLO')
          console.log(lines)
          setText(lines)
        }).catch(err => {
          console.log(err)
        })
      }
    }
    getPlantSentiment()
  }, [])

  return (
    <>
      <style type="text/css">
        {`
                .close-button {
                    font-size: 1.5rem;
                    margine: auto;
                }
                .close-hover:hover {
                    font-size: 1.5rem;
                    margine: auto;
                    color: #696969;
                    cursor: pointer;
                }
                `}
      </style>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {scientificName}
          </Modal.Title>
          <VscChromeClose className='close-button close-hover'
            onClick={() => setModalShow(false)}></VscChromeClose>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex' style={{ color: 'white' }}>
            <Badge className='mr-1' bg="success" pill>Sentiment score: {sentiment?.score}</Badge>
            <Badge bg="success" pill>Sentiment magnitude: {sentiment?.magnitude.toFixed(2)}</Badge>
          </div>
          <p className='text-muted'>Neutral sentiment score: 0.0 *Truly neutral documents will have a low magnitude value, while mixed documents will have higher magnitude values (Google Cloud Natural Langauge API)</p>
          <img src={image} className="d-flex justify-content-center mx-auto" style={{ objectFit: "cover", borderRadius: "10px" }} width="200px" height="200px"></img>
          <Container style={{ maxHeight: "35vh", }} className="my-3 overflow-auto">
            {!text && (
              <div className="d-flex justify-content-center">
                <Spinner className="mx-auto" animation="border" variant="success"></Spinner>
              </div>
            )}
            {
              text && (
                text.map(section => {
                  return (
                    <>
                      {
                        section.includes("==") && (
                          <>
                            <br />
                            <h6 className="text-center">
                              <strong>{section}</strong>
                            </h6>
                          </>
                        )
                      }
                      {
                        !section.includes("==") && (
                          <div>
                            {section}
                          </div>
                        )
                      }
                    </>
                  )
                })
              )
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}