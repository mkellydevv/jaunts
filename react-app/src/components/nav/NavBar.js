import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

import "./NavBar.css";

export default function NavBar() {
	const { user } = useSelector(state => state.session);

	return (
		<nav id="navbar">
			<div className="navbar__lists">
				{user &&
					<NavLink to="/lists" exact={true} activeClassName="active">
						Lists
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
							Login
						</NavLink>
						<NavLink to="/sign-up" exact={true} activeClassName="active">
							Sign Up
						</NavLink>
					</>
				}
				{user && <LogoutButton />}
			</div>
		</nav>
	);
}

// https://d185jh8djxl1sd.cloudfront.net/assets/placeholder/person_placeholder.png
