import { useState } from 'react';

import find from '../assets/find.png';
import pen from '../assets/pen.png';

import Finder from './finder';
import Redactor from './redactor'

export default function MainPage() {    
    // Состояние для активного компонента ('finder' или 'redactor')
    const [activeComponent, setActiveComponent] = useState('finder');
                                                                                                    
    return (
        <div style={{'width':'100%', 'height':'100%', 'overflowX':'hidden'}}>
            {/* HEADER */}
            <div className='headerMain'>
                <div className='customTitle'>LOSE//LINE</div>
                <div style={{'margin-right':'15px'}}>
                    <p>Conection status: <b id='status'>UNCONNECTION</b></p>
                </div>
            </div>
            <div className='bodyMenuM'>
              {/* LEFT MENU */}
              <div className='bodyMenu'>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('finder')}>
                      <img src={find} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}}></img>
                      <p className='subtitle' style={{'margin-left':'10px'}}>BROWSER</p>                                                       
                  </div>
                  <div className='bodyMenuCard' onClick={() => setActiveComponent('redactor')}>
                      <img src={pen} style={{'width':'24px', 'height':'24px', 'margin-top':'auto', 'margin-bottom':'auto', 'margin-left':'10px'}}></img>
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