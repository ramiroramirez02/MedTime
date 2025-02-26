import react from "react";
import { Link } from "react-router-dom";

function Home(){
    return (
    <div>
        <h1>Home</h1>
        <nav>
            <li><Link to="./signup">Signup</Link></li>
            <li><Link to="./login">Login</Link></li>
        </nav>
    </div>
    );
}

export default Home;