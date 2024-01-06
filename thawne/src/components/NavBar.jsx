import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import useToken from '../hooks/useToken';


function NavBar({ openModal }) {
    const { logout } = useToken();

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return(
        <>
            <div className="flex justify-between px-6 py-3" style={{backgroundColor: '#252525'}}>
                <p className="text-xl my-auto ml-4 font-bold text-white">
                    Thawne
                    <span className="text-yellow-300 mx-1"> 
                        <ion-icon name="flash"></ion-icon>
                    </span>
                    </p>
                <div className='flex items-center space-x-4'>
                    <Tooltip title="New Chat" placement="bottom" onClick={openModal}>
                        <button className="bg-transparent text-white px-3">
                            <ion-icon name="add-outline"></ion-icon>
                        </button>
                    </Tooltip>
                    <Tooltip title="Settings" placement="bottom">
                        <button className="bg-transparent text-white px-3">
                            <Link to="/settings/profile" ><ion-icon name="settings-sharp"></ion-icon></Link>
                        </button>
                    </Tooltip>
                    <Tooltip title="Log Out" placement="bottom">
                        <button className="bg-transparent text-white px-3" onClick={handleLogout}>
                            <ion-icon name="log-out-outline"></ion-icon>
                        </button>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default NavBar