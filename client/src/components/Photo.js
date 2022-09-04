import { SearchResult } from './SearchResult';
import { MoreInfo } from './MoreInfo';
import { Container, Dropdown, Button } from 'react-bootstrap'
import React, { useState, useEffect, useRef } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { RiPlantLine } from "react-icons/ri"
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'
import {
  api_key, app_id, measurement_id, messaging_sender_id, storage_bucket,
} from './config'
import { urlToHttpOptions } from 'url';

const firebaseConfig = {
  apiKey: api_key,
  authDomain: 'jason-ren.firebaseapp.com',
  projectId: 'jason-ren',
  storageBucket: storage_bucket,
  messagingSenderId: messaging_sender_id,
  appId: app_id,
  measurementId: measurement_id,
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage()
const storageRef = ref(storage, 'images/plant');


const Photo = () => {
  const [mode, setMode] = useState('url')
  const [url, setURL] = useState('')
  const [organ, setOrgan] = useState('Select Plant Organ')
  const [identify, setIdentify] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [scientificName, setScientificName] = useState('')
  const [commonName, setCommonName] = useState('')
  const [image, setImage] = useState()

  useEffect(() => {
    const uploadPictureButton = document.querySelector(".photo-upload")
    if (uploadPictureButton) {
      uploadPictureButton.addEventListener('change', function () {
        displayUploadPicture(this);
      });
    }

    const displayUploadPicture = async (input) => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = async (e) => {
          document.getElementById('the-picture').setAttribute('src', e.target.result);
          uploadString(storageRef, e.target.result, 'data_url').then((snapshot) => {
            console.log('data_url upload successful')
          })
        };

        await getDownloadURL(storageRef).then((url) => {
          setURL(url)
        }).catch((error) => {
          console.log(error)
        })

        reader.readAsDataURL(input.files[0]);
      }
    }
  })

  const inputRef = useRef(null)

  const resetFileInput = () => {
    inputRef.current.value = null;
  }

  return (
    <>
      <style type="text/css">
        {`
        .photo-upload:hover {
          cursor:pointer;
        }
        .photo-url:hover {
            cursor:text;
          }
          .photo-display {
            border-radius: 5px;
          }
          .required {
            color: #CD5C5C;
            font-weight: 700;
            font-size: 2rem;
          }
          .plant-icon {
            color: green;
            font-weight: 1000;
            font-size: 3rem;
          }`}
      </style>
      <Container className='d-flex justify-content-center mt-4'>
        <h1 className="w-full">
          Welcome to Plantr!
        </h1>
        <RiPlantLine className='plant-icon'></RiPlantLine>
      </Container>
      <h4 className="w-full text-center mt-5">
        Upload an image to get started!
      </h4>
      <Container className='d-flex justify-content-center'>
        <ButtonGroup aria-label="Basic example">
          <Button type='radio' variant={mode === 'url' ? "success" : "outline-success"}
            onClick={() => {
              setMode('url')
              setURL('')
              setIdentify(false)
              setOrgan('Select Plant Organ')
            }}>
            Upload URL
          </Button>
          <Button type='radio' variant={mode === 'url' ? "outline-success" : "success"}
            onClick={() => {
              setMode('local')
              setURL('')
              setIdentify(false)
              setOrgan('Select Plant Organ')
            }}>
            Upload Local Image
          </Button>
        </ButtonGroup>
      </Container>
      <Container className='d-flex justify-content-center'>
        <p className='text-muted'>*Acceptable file formats: .png, .jpg, .jpeg</p>
      </Container>

      {
        mode === 'local' && (
          <>
            <Container className="d-flex justify-content-center mt-4">
              <div className='mr-5'>
                <input
                  role="button"
                  id="myImage"
                  className="w-fit border border-5 place-self-center mx-1 photo-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  ref={inputRef}></input>
                <Button variant='secondary' size='sm'
                  onClick={() => {
                    setURL('')
                    setOrgan('Select Plant Organ')
                    setIdentify(false)
                    document.getElementById('the-picture').setAttribute('src', '')
                    resetFileInput()
                  }}
                  disabled={url === ''}
                  style={url === '' ? { cursor: 'not-allowed' } : {}}>
                  clear
                </Button>
              </div>
              <p className='required'>*</p>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {organ}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" onClick={() => setOrgan('leaf')}>leaf</Dropdown.Item>
                  <Dropdown.Item href="#/action-2" onClick={() => setOrgan('flower')}>flower</Dropdown.Item>
                  <Dropdown.Item href="#/action-3" onClick={() => setOrgan('fruit')}>fruit</Dropdown.Item>
                  <Dropdown.Item href="#/action-4" onClick={() => setOrgan('bark')}>bark</Dropdown.Item>
                  <Dropdown.Item href="#/action-5" onClick={() => setOrgan('auto')}>auto</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Container>
            <Container className="d-flex justify-content-center">
              <img className='photo-display' id="the-picture" width="30%" />
            </Container>
          </>
        )
      }
      {
        mode === 'url' && (
          <>
            <Container className="d-flex justify-content-center mt-4">
              <div className='mr-5'>
                <input
                  id="myImage"
                  className="w-fit border border-5 mx-1 photo-url"
                  type="url"
                  placeholder='Image URL:'
                  onChange={e => setURL(e.target.value)}
                  value={url}></input>
                <Button variant='secondary' size='sm'
                  onClick={() => {
                    setURL('')
                    setOrgan('Select Plant Organ')
                    setIdentify(false)
                  }}
                  disabled={url === ''}
                  style={url === '' ? { cursor: 'not-allowed' } : {}}>
                  clear
                </Button>
              </div>
              <p className='required'>*</p>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {organ}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" onClick={() => setOrgan('leaf')}>leaf</Dropdown.Item>
                  <Dropdown.Item href="#/action-2" onClick={() => setOrgan('flower')}>flower</Dropdown.Item>
                  <Dropdown.Item href="#/action-3" onClick={() => setOrgan('fruit')}>fruit</Dropdown.Item>
                  <Dropdown.Item href="#/action-4" onClick={() => setOrgan('bark')}>bark</Dropdown.Item>
                  <Dropdown.Item href="#/action-5" onClick={() => setOrgan('auto')}>auto</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Container>
            <Container className="d-flex justify-content-center">
              <img className='photo-display' src={url} width="30%" />
            </Container>
          </>
        )
      }
      <Container className="d-flex justify-content-center mt-4 mb-5">
        <Button variant='success'
          disabled={organ === 'Select Plant Organ'}
          style={organ === 'Select Plant Organ' ? { cursor: 'not-allowed' } : {}}
          onClick={() => setIdentify(true)}
          size="lg">
          Identify!
        </Button>
      </Container>
      {
        identify && (
          <SearchResult image={url} organ={organ} setImage={setImage} setModalShow={setModalShow} setCommonName={setCommonName} setScientificName={setScientificName}></SearchResult>
        )
      }
      {
        modalShow && (
          <MoreInfo commonName={commonName} image={image} scientificName={scientificName} modalShow={modalShow} setModalShow={setModalShow}></MoreInfo>
        )
      }
    </>
  )
}

export default Photo