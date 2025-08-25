import React, { useState, useEffect, useContext } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import {
    homeOutline,
    addCircle,
    cameraOutline,
    settingsOutline,
    personAddOutline,
    documentOutline,
} from 'ionicons/icons';
import './buttombar.css'; // Import CSS file
import Home from '../Home/Home';
import AddHouse from '../../AddData/AddHouse';
import UserList from '../Userlist/UserList';
import ThemeContext from '@/utils/ThemeContext';
import Setting from '../setting/Setting';
import Navbar from '../components/Navbar';
import UserApprove from '../userApprove/userApprove';

const ButtomBar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate(); // เรียกใช้ useNavigate
    const { user } = useContext(ThemeContext)
    useEffect(() => {
        if (!user) {
            navigate('/login'); // ถ้าไม่มี user ให้ไปหน้า Login
        } else {
            // const isAdmin = user.status === "admin" ? true : false;
        }
    }, [navigate]);
    // console.log(isAdmin)
    const handleClick = (index) => {
        setActiveIndex(index);
    };
    return (
        <div>
            <div>
                {
                    activeIndex !== 1 &&
                    <Navbar activeIndex={activeIndex} />
                }
            </div>
            <div className="navigation">
                <ul>
                    <li className={`list ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleClick(0)}>
                        <a href="#">
                            <span className="icon"><IonIcon icon={homeOutline} /></span>
                            <span className="text">หน้าหลัก</span>
                        </a>
                    </li>
                    <li className={`list ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleClick(1)}>
                        <a href="#">
                            <span className="icon"><IonIcon icon={documentOutline} /></span>
                            <span className="text">ข้อมูล</span>
                        </a>
                    </li>
                    <li className={`list ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleClick(2)}>
                        <a href="#">
                            <span className="icon"><IonIcon icon={personAddOutline} /></span>
                            <span className="text">รายชื่อใหม่</span>
                        </a>
                    </li>
                    <li className={`list ${activeIndex === 3 ? 'active' : ''}`} onClick={() => handleClick(3)}>
                        <a href="#">
                            <span className="icon"><IonIcon icon={settingsOutline} /></span>
                            <span className="text">ตั้งค่า</span>
                        </a>
                    </li>
                    <div className="indicator" style={{ transform: `translateX(calc(70px * ${activeIndex}))` }} />
                </ul>
            </div>
            <div>
                {
                    user ?
                        <>
                            {activeIndex === 0 && <Home />}
                            {activeIndex === 1 ? user.status === "admin" ? <UserList /> : <AddHouse /> : ""}
                            {activeIndex === 2 ? user.status === "admin" ?  <UserApprove /> : <AddHouse /> : ""}
                            {activeIndex === 3 && <Setting />}
                        </> : ''
                }
            </div>
        </div>
    );
};

export default ButtomBar;
