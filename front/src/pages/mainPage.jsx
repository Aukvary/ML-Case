import { useState, useEffect } from 'react';
import APIClient from '../apiClient';

import find from '../assets/find.png';
import pen from '../assets/pen.png';

import Finder from './finder';
import Redactor from './redactor';

const api = new APIClient();

export default function MainPage() {    
    const [activeComponent, setActiveComponent] = useState('finder');
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
                                                                                                    
    return (
        <div style={{width: '100%', height: '100%', overflowX: 'hidden'}}>
            {/* HEADER */}
            <div className='headerMain'>
                <div className='customTitle'>LOSE//LINE</div>
                <div style={{marginRight: '15px'}}>
                    <p>Connection status: <b id='status' style={{color: connectionStatus === 'CONNECTED' ? '#44ff44' : '#ff4444'}}>{connectionStatus}</b></p>
                </div>
            </div>
            <div className='bodyMenuM'>
              {/* LEFT MENU */}
              <div className='bodyMenu'>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('finder')}>
                      <img src={find} style={{width: '24px', height: '24px', marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px'}} alt="find"/>
                      <p className='subtitle' style={{marginLeft: '10px'}}>BROWSER</p>                                                       
                  </div>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('redactor')}>
                      <img src={pen} style={{width: '24px', height: '24px', marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px'}} alt="pen"/>
                      <p className='subtitle' style={{marginLeft: '10px'}}>REDACTOR</p>                                                       
                  </div>
              </div>
              {/* MAIN MENU */}
              <div style={{width: '100%'}}>
                {activeComponent === 'finder' ? <Finder /> : <Redactor />}
              </div>
            </div>
        </div>
    );
}