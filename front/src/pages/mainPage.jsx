<<<<<<< HEAD
import { useState, useEffect } from 'react';
import APIClient from '../apiClient';
=======
import { useState } from 'react';
>>>>>>> origin/master

import find from '../assets/find.png';
import pen from '../assets/pen.png';

import Finder from './finder';
<<<<<<< HEAD
import Redactor from './redactor';

const api = new APIClient();
=======
import Redactor from './redactor'
>>>>>>> origin/master

export default function MainPage() {    
    // Состояние для активного компонента ('finder' или 'redactor')
    const [activeComponent, setActiveComponent] = useState('finder');
<<<<<<< HEAD
    const [modelStatus, setModelStatus] = useState('checking');
    const [connectionStatus, setConnectionStatus] = useState('UNCONNECTION');

    useEffect(() => {
        const checkModel = async () => {
            try {
                const status = await api.getModelStatus();
                setModelStatus('ACTIVE');
                setConnectionStatus('CONNECTED');
            } catch (error) {
                console.error('Модель не доступна:', error);
                setModelStatus('OFFLINE');
                setConnectionStatus('OFFLINE');
            }
        };
        checkModel();
    }, []);
=======
>>>>>>> origin/master
                                                                                                    
    return (
        <div style={{'width':'100%', 'height':'100%', 'overflowX':'hidden'}}>
            {/* HEADER */}
            <div className='headerMain'>
                <div className='customTitle'>LOSE//LINE</div>
                <div style={{'margin-right':'15px'}}>
<<<<<<< HEAD
                    <p>Connection status: <b id='status' style={{color: connectionStatus === 'CONNECTED' ? '#44ff44' : '#ff4444'}}>{connectionStatus}</b></p>
=======
                    <p>Conection status: <b id='status'>UNCONNECTION</b></p>
>>>>>>> origin/master
                </div>
            </div>
            <div className='bodyMenuM'>
              {/* LEFT MENU */}
              <div className='bodyMenu'>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('finder')}>
<<<<<<< HEAD
                      <img src={find} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}} alt="find"/>
                      <p className='subtitle' style={{'margin-left':'10px'}}>BROWSER</p>                                                       
                  </div>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('redactor')}>
                      <img src={pen} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}} alt="pen"/>
=======
                      <img src={find} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}}></img>
                      <p className='subtitle' style={{'margin-left':'10px'}}>BROWSER</p>                                                       
                  </div>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('redactor')}>
                      <img src={pen} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}}></img>
>>>>>>> origin/master
                      <p className='subtitle' style={{'margin-left':'10px'}}>REDACTOR</p>                                                       
                  </div>
              </div>
              {/* MAIN MENU */}
              <div style={{'width':'100%'}}>
                {activeComponent === 'finder' ? <Finder /> : <Redactor />}
              </div>
            </div>
        </div>
    );
}