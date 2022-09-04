import { SearchResult } from './SearchResult';
import { MoreInfo } from './MoreInfo';
import { Container, Dropdown, Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
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


  const radios = [
    { name: 'Upload URL', value: '1' },
    { name: 'Upload Local Image', value: '2' }
  ];

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
          console.log(url)
          setURL(url)
        }).catch((error) => {
          console.log(error)
        })

        reader.readAsDataURL(input.files[0]);
      }
    }
  })

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
          }`}
      </style>
      <h1 className="w-full text-center">
        Welcome to Plantr!
      </h1>
      <h3 className="w-full text-center">
        choose an image to get started!
      </h3>
      <Container className='d-flex justify-content-center'>
        <ButtonGroup aria-label="Basic example">
          <Button type='radio' variant={mode === 'url' ? "success" : "outline-success"} onClick={() => setMode('url')}>Upload URL</Button>
          <Button type='radio' variant={mode === 'url' ? "outline-success" : "success"} onClick={() => setMode('local')}>Upload Local Image</Button>
        </ButtonGroup>
      </Container>
      <Container className='d-flex justify-content-center'>
        <p className='text-muted'>*Acceptable file formats: .png, .jpg, .jpeg</p>
      </Container>

      {
        mode === 'local' && (
          <>
            <Container className="d-flex ">
              <input
                role="button"
                id="myImage"
                className="w-fit border border-5 place-self-center mx-auto photo-upload"
                type="file"
                accept=".png,.jpg,.jpeg"></input>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {organ}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" onClick={() => setOrgan('leaf')}>Leaf</Dropdown.Item>
                  <Dropdown.Item href="#/action-2" onClick={() => setOrgan('flower')}>Flower</Dropdown.Item>
                  <Dropdown.Item href="#/action-3" onClick={() => setOrgan('fruit')}>Fruit</Dropdown.Item>
                  <Dropdown.Item href="#/action-4" onClick={() => setOrgan('bark')}>Bark</Dropdown.Item>
                  <Dropdown.Item href="#/action-5" onClick={() => setOrgan('auto')}>Auto</Dropdown.Item>
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
            <Container className="d-flex justify-content-center mt-3">
              <div className='mr-5'>
                <input
                  id="myImage"
                  className="w-fit border border-5 mx-auto photo-url"
                  type="url"
                  placeholder='Image URL:'
                  onChange={e => setURL(e.target.value)}
                  value={url}></input>
                <Button variant='secondary' size='sm' onClick={() => {
                  setURL('')
                  setOrgan('Select Plant Organ')
                  setIdentify(false)
                }}>
                  clear
                </Button>
              </div>
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
      <Container className="d-flex justify-content-center">
        <Button variant='success'
          disabled={organ === 'Select Plant Organ'}
          style={organ === 'Select Plant Organ' ? { cursor: 'not-allowed' } : {}}
          onClick={() => setIdentify(true)}>
          Identify
        </Button>
      </Container>
      {
        identify && (
          <SearchResult image={url} organ={organ} setModalShow={setModalShow} setCommonName={setCommonName} setScientificName={setScientificName}></SearchResult>
        )
      }
      {
        modalShow && (
          <MoreInfo commonName={commonName} scientificName={scientificName} modalShow={modalShow} setModalShow={setModalShow}></MoreInfo>
        )
      }
    </>
  )
}

export default Photo