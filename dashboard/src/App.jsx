import {
  BrowserRouter, Routes, Route, HashRouter
} from 'react-router-dom'
import './assets/App.css'
import StudentList from './pages/StudentList'
import Sidebar from './components/Sidebar'
import StudentDetail from './pages/StudentDetail'
import StudentCalendar from './pages/StudentCalendar'
import { Icon } from '@iconify/react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_SERVER;

function App() {
  return (
    <HashRouter>
		<header>
			<div className='header-wrapper'>
				<h1 className="h1-logo">IGC</h1>
				<h2 className="h2-title">동국대학교 학생 상태 현황 대시보드</h2>
			</div>
		</header>
		<nav>
			<div className='nav-wrapper'>
				<Icon icon="uiw:menu" color='#068AFF' fontSize={32}/>
				<p>인공지능</p>
			</div>
		</nav>
		<main>
			<Sidebar></Sidebar>
			<section>
				<Routes>
					<Route path='/' Component={StudentList}></Route>
					<Route path='/:id/detail' Component={StudentDetail}></Route>
					<Route path='/:id/calendar' Component={StudentCalendar}></Route>
				</Routes>
			</section>
		</main>
    </HashRouter>
  )
}

export default App
