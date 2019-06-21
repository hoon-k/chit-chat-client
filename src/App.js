import React from 'react';
import { Route, Link } from 'react-router-dom';
import { ChatClient } from './Chat';
import './App.css';

const Index = () => <h2>Index page</h2>;
const About = () => <h2>About page</h2>;
const Page = () => <h2>Page page</h2>;

function App() {
    return (
        <div className="App">
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat</Link>
                    </li>
                    <li>
                        <Link to="/page">Page</Link>
                    </li>
                </ul>
            </nav>

            <Route path="/" exact component={Index} />
            <Route path="/about/" component={About} />
            <Route path="/chat/" component={ChatClient} />
            <Route path="/page/" component={Page} />
        </div>
    );
}

export default App;
