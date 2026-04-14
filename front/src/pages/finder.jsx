// finder.jsx
export default function Finder() {
    return (
        <div className="finderContainer">
            <div className='browContainer'>
                <input type="text" className='browser'></input>
                <button className='button' style={{'margin-top':'0px', 'padding':'13px', 'border':'2px solid silver'}}>FIND</button>
            </div>
            <div className='browContainer' style={{'height':'100%'}}>
                <div className='filesContainer'>
                    <div style={{'margin':'auto','font-size':'30px', 'color':'#1f1f2a'}}>
                        Files will appear here
                    </div>
                </div>
            </div>
            {/* Содержимое компонента поиска */}
        </div>
    );
}