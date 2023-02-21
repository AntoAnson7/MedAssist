import { Login } from "./pages/login";
import {Signup} from './pages/signup';
import { Home } from "./pages/home";

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom' 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element ={<Login />}/>
          <Route path="/home" element ={<Home />}/>
          <Route path="/signup" element ={<Signup/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
