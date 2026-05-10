<<<<<<< HEAD
import { useState } from 'react';
import APIClient from '../apiClient';

const api = new APIClient();

export default function Finder() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handleSearch = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const searchResults = await api.searchRequest(query);
            setResults(Array.isArray(searchResults) ? searchResults : []);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="finderContainer">
            <div className='browContainer'>
                <input 
                    type="text" 
                    className='browser'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Введите поисковый запрос..."
                />
                <button 
                    className='button' 
                    style={{'margin-top':'0px', 'padding':'13px', 'border':'2px solid silver'}}
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? 'ИЩУ...' : 'FIND'}
                </button>
            </div>
            <div className='browContainer' style={{'height':'100%'}}>
                <div className='filesContainer'>
                    {loading ? (
                        <div style={{'margin':'auto','font-size':'20px', 'color':'#a0a0ff'}}>
                            ⏳ Поиск документов...
                        </div>
                    ) : results.length > 0 ? (
                        results.map((doc, idx) => (
                            <div key={idx} style={{
                                padding: '10px',
                                borderBottom: '1px solid #333345',
                                marginBottom: '10px'
                            }}>
                                <div style={{ fontWeight: 'bold', color: '#a0a0ff' }}>
                                    📄 {doc.name || doc.filename || `Документ ${idx + 1}`}
                                </div>
                                {doc.score !== undefined && (
                                    <div style={{ fontSize: '12px', color: '#44ff44' }}>
                                        Схожесть: {(doc.score * 100).toFixed(1)}%
                                    </div>
                                )}
                                {doc.secret && (
                                    <div style={{ fontSize: '11px', color: '#ff4444' }}>
                                        🔒 СЕКРЕТНО
                                    </div>
                                )}
                                {doc.date && (
                                    <div style={{ fontSize: '11px', color: '#707075' }}>
                                        {doc.date}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : query ? (
                        <div style={{'margin':'auto','font-size':'20px', 'color':'#1f1f2a'}}>
                            Ничего не найдено
                        </div>
                    ) : (
                        <div style={{'margin':'auto','font-size':'30px', 'color':'#1f1f2a'}}>
                            Files will appear here
                        </div>
                    )}
=======
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
>>>>>>> origin/master
                </div>
            </div>
            {/* Содержимое компонента поиска */}
        </div>
    );
}