import { useEffect, useState } from 'react';
import './navigation.css';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('https://idle-project-diff.onrender.com');

const Navigation = () => {
    let [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        socket.on('activeUsers', (count) => {
            setActiveUsers(count);
        });

        return () => {
            socket.off('activeUsers');
        };
    }, []);

    return (
        <div id='nav'>
            <div id='nav_logo'>
                <Link to="/"><img src="logo copy 1.png" alt="" /></Link>
            </div>
            <div></div>
            <div id='nav_button'>
                <div id="smoothRounddiv">
                    <i className="fa-solid fa-users"></i>
                </div>
                {activeUsers}
            </div>
        </div>
    );
}

export default Navigation;
