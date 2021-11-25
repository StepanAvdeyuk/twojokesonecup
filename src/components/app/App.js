import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Admin from '../admin/Admin';
import MainPage from '../pages/MainPage';

const App = () => { 
    return (
            <Router>
                <div className="app">
                <Routes>
                    <Route exact path="/" element={<MainPage/>}/>
                    <Route exact path="/admin/*" element={<Admin/>}/>
                </Routes>
                </div>
            </Router>
    )
}

export default App;