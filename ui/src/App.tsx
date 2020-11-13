import React from 'react';
import './App.css';
// import {Client, IClientData} from './Client';

import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import DamlLedger from '@daml/react';
import Credentials from './Credentials';
import { httpBaseUrl } from './config';

/**
 * React component for the entry point into the application.
 */
// APP_BEGIN
const App: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials | undefined>();

  return credentials
    ? <DamlLedger
        token={credentials.token}
        party={credentials.party}
        httpBaseUrl={httpBaseUrl}
      >
        <MainScreen onLogout={() => setCredentials(undefined)}/>
      </DamlLedger>
    : <LoginScreen onLogin={setCredentials} />
}
// APP_END

//export default App;
//
//interface Istate {
//  loaded: boolean;
//  clients: Array<IClientData>
//}
//
//class App extends React.Component {
//  state: Istate = { clients : [], loaded: false}
//  componentDidMount() { 
//    fetch("/users")
//    .then(x => x.json())
//    .then(x => {console.log(x); return x})
//    .then(x => this.setState({clients: x , loaded: true})); }
//
//  render() {
//    const {clients, loaded} = this.state;
//    return (
//    <div className="App">
//      {!loaded && <div> loading.... </div>}
//      {loaded && clients.map(c =>
//         <Client clientId={c.clientId} 
//                 clientFirstName={c.clientFirstName}
//                 clientLastName={c.clientLastName} />)}
//    </div>
//  ); }
//}
//
//
export default App;
