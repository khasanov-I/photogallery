import {Link, useLocation} from 'react-router-dom'
import {observer} from 'mobx-react-lite'
import './Navbar.css'
import { useStores } from '../../store/rootStore'

export const Navbar = observer(() => {
    const {userStore} = useStores()
    const location = useLocation()
    const links = [
        {
            href: '/',
            content: "Главная"
        },
        {
            href: '/search',
            content: "Поиск"
        },
        {
            href: '/users',
            content: "Пользователи"
        },
    ]

    return <div className='navbar'>
        <div className='tabs'>
            {links.map(e => <Link reloadDocument style={location.pathname === e.href ? {backgroundColor: "rgb(240, 240, 240)"} : undefined} key={e.content} className='tab' to={e.href}>{e.content}</Link>)}
            {userStore.id ? <Link reloadDocument style={location.pathname === `/profile/${userStore.id}` ? {backgroundColor: "rgb(240, 240, 240)"} : undefined} className='tab' to={`/profile/${userStore.id}`}>Мой профиль</Link> : undefined}
        </div>
        {!userStore.id ? <div className='tabs'>
            <Link reloadDocument style={location.pathname === '/login' ? {backgroundColor: "rgb(240, 240, 240)"} : undefined} className='tab' to='/login'>Авторизация</Link>
            <Link reloadDocument style={location.pathname === '/register' ? {backgroundColor: "rgb(240, 240, 240)"} : undefined} className='tab' to='/register'>Регистрация</Link>
        </div> : undefined}
        {userStore.id ? <div className='tabs'><button className='logout-button' onClick={() => userStore.logout()}>Выйти</button></div> : undefined}
    </div>
})