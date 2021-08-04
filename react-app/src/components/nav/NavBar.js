import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

import "./NavBar.css";

export default function NavBar() {
	const { user } = useSelector(state => state.session);
	const [navbar, setNavbar] = useState(false);

	const changeBackground = () => {
		if (window.scrollY >= 80) {
			setNavbar(true);
		}
		else {
			setNavbar(false);
		}
	}

	window.addEventListener('scroll', changeBackground);

	return (
		<nav id="navbar" className={navbar ? "active" : ""}>
			<div className="navbar__lists">
				{user &&
					<NavLink to="/lists" exact={true} activeClassName="active">
						<button className="jaunts__btn jaunts__btn-1">Lists</button>
					</NavLink>
				}
			</div>
			<div className="navbar__home">
				<NavLink to="/" exact={true} activeClassName="active">
					Jaunts
				</NavLink>
			</div>
			<div className="navbar__auth">
				{!user &&
					<>
						<NavLink to="/login" exact={true} activeClassName="active">
							<button className="jaunts__btn jaunts__btn-1">Login</button>
						</NavLink>
						<NavLink to="/sign-up" exact={true} activeClassName="active">
							<button className="jaunts__btn jaunts__btn-2">Sign Up</button>
						</NavLink>
					</>
				}
				{user && <LogoutButton />}
			</div>
		</nav>
	);
}
