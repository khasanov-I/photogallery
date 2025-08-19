import {JSX, memo} from 'react';
import {Outlet} from 'react-router-dom';
import { Navbar } from '../../../widgets/Navbar/Navbar';

type LayoutProps = {
    className?: string;
};

export const Layout = memo((props: LayoutProps): JSX.Element => {

    return <>
        <Navbar />
        <div className='content-page'>
            <Outlet />
        </div>
    </>;
});
