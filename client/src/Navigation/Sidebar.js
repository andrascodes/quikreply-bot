import React from 'react'
import { Link } from 'react-router-dom'

import './Sidebar.css'

export const Sidebar = props => (
  <div className="Sidebar">
    <ul className="Sidebar-Links">
      <li>
        <Link className="Link" to="/">Dashboard</Link>
      </li>
      <li>
        <Link className="Link" to="/conversations">Conversations</Link>
      </li>
    </ul>
  </div>
)