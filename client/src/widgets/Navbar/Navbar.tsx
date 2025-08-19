import {Link} from 'react-router-dom'
import {observer} from 'mobx-react-lite'
import './Navbar.css'
import { useStores } from '../../store/rootStore'

export const Navbar = observer(() => {
    const {userStore} = useStores()
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
            {links.map(e => <Link key={e.content} className='tab' to={e.href}>{e.content}</Link>)}
            {userStore.id ? <Link className='tab' to={`/profile/${userStore.id}`}>Мой профиль</Link> : undefined}
        </div>
        {!userStore.id ? <div className='tabs'>
            <Link className='tab' to='/login'>Авторизация</Link>
            <Link className='tab' to='/register'>Регистрация</Link>
        </div> : undefined}
        {userStore.id ? <div className='tabs'><button className='logout-button' onClick={() => userStore.logout()}>Выйти</button></div> : undefined}
    </div>
})