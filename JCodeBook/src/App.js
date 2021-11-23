import {useEffect, useState} from 'react';
import './App.css';
import SignIn from "./pages/auth/login.js";
import {Route, Switch, useHistory} from 'react-router-dom';
import firebase from 'firebase/app';
import "firebase/auth"
import UserNav from "./pages";

function App() {
  const history = useHistory()
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
		firebase.auth().onAuthStateChanged(async user => {
      if (user !== null) {
        setLoggedIn(true)
        if (!history.location.pathname.includes('list')) {
          history.push('/list')
        }
      } else {
        if (!history.location.pathname.includes('sign-in')) {
          history.push('/sign-in')
        }
        setLoggedIn(false)
      }
    })
  }, [])

  if (loggedIn === false) {
    return (
      <Switch>
        <Route path={'/sign-in'} exact component={SignIn}/>
      </Switch>
    )
  }

  return (
    <UserNav/>
  );
}

export default App;
