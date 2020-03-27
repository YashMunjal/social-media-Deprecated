import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    const guestLinks = (
        <ul>
            <li>
                <Link to='/profiles'>Developers</Link>
            </li>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </ul>
    );

    return (
        <nav className='navbar bg-dark'>
            <h1>
                <Link to='/'>
                     Dance-edia
            </Link>
            </h1>

            <React.Fragment>{guestLinks}</React.Fragment>

        </nav>
    );
}
export default Navbar;