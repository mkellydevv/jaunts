import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

import "./NavBar.css";

export default function NavBar() {
	const { user } = useSelector(state => state.session);
	const [active, setActive] = useState(false);
	const location = useLocation();

	const changeBackground = () => {
		if (window.scrollY >= 80) {
			setActive(true);
		}
		else {
			setActive(false);
		}
	}

	useEffect(() => {
		if (window.location.pathname !== "/")
			setActive(true);
		else {
			setActive(false);
			window.addEventListener('scroll', changeBackground);
		}

		return () => {
			window.removeEventListener('scroll', changeBackground);
		}
	}, [location]);

	return (
		<nav id="navbar" className={active ? "active" : ""}>
			<div className="navbar__lists">
				{user &&
					<NavLink to="/lists" exact={true} activeClassName="active">
						<button className="jaunts__btn jaunts__btn-1">Lists</button>
					</NavLink>
				}
			</div>
				<NavLink className="navbar__home-link" to="/" exact={true} activeClassName="active">
					<div className="navbar__home">
						<div className="navbar__home-icon">
							<i className="fas fa-hiking" />
						</div>
						<div className="navbar__home-text">
							Jaunts
						</div>
					</div>
				</NavLink>
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
