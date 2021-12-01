import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Admin from '../admin/Admin';
import MainPage from '../pages/MainPage';
import Page404 from '../pages/404';

const App = () => { 
    return (
            <Router>
                <div className="app">
                <Routes>
                    <Route exact path="/" element={<MainPage/>}/>
                    <Route exact path="/admin/*" element={<Admin/>}/>
                    <Route path="*" element={<Page404/>}/>
                </Routes>
                </div>
            </Router>
    )
}

export default App;