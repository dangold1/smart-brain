//external modules
import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import 'tachyons';

//internal modules
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';


const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  // --------------------------------Event Handlers----------------------------------------

  onInputChange = (event) => { this.setState({ input: event.target.value }); }

  onImageSubmit = () => {
    const { input, user } = this.state;
    this.setState({ imageUrl: input });
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input })
    })
      .then(response => response.json())
      .then(predictResponse => {
        if (predictResponse) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => response.json())
            .then(userEntries => { this.setState(Object.assign(user, { entries: userEntries })) })
            .catch(console.log())
        }
        this.displayFaceBox(this.calculateFaceLocation(predictResponse))
      })
      .catch(err => console.log(err));
  }
  // ------------------------------Routing------------------------------------------------------

  onRouteChange = (route) => {
    if (route === 'signout') this.setState(initialState);
    else if (route === 'home') this.setState({ isSignedIn: true });
    this.setState({ route: route });
  }

  // --------------------------------Functions------------------------------------------------------

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifiFace.left_col * width,
      topRow: clarifiFace.top_row * height,
      rightCol: width - (clarifiFace.right_col * width),
      bottomRow: height - (clarifiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => { this.setState({ box: box }); }

  // ----------------------------------------Render----------------------------------------------------

  render() {
    const { imageUrl, box, route, isSignedIn, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' ?
            <div>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onImageSubmit={this.onImageSubmit}
              />
              <FaceRecognition
                imageUrl={imageUrl}
                box={box} />
            </div>
            : (
              route === 'signin' ?
                <Signin loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}


export default App;