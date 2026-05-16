import { useState } from 'react';
import APIClient from '../apiClient';

const api = new APIClient();

export default function Finder() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(null);
    
    const handleSearch = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const searchResults = await api.searchRequest(query);
            setResults(Array.isArray(searchResults) ? searchResults : []);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setResults([]);
            alert('Ошибка поиска: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    
    const handleDownload = async (doc) => {
        const fileName = doc.name || doc.filename || doc.title;
        if (!fileName) {
            alert('Имя файла не найдено');
            return;
        }
        
        setDownloading(fileName);
        try {
            const blob = await api.downloadFile(fileName);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка скачивания:', error);
            alert('Ошибка скачивания: ' + error.message);
        } finally {
            setDownloading(null);
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
                    placeholder="Enter..."
                />
                <button 
                    className='button' 
                    style={{marginTop: '0px', padding: '13px', border: '2px solid silver'}}
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? 'SAERCHIN...' : 'FIND'}
                </button>
            </div>
            <div className='browContainer' style={{height: '100%'}}>
                <div className='filesContainer'>
                    {loading ? (
                        <div style={{margin: 'auto', fontSize: '20px', color: '#a0a0ff'}}>
                            ⏳ Sarching...
                        </div>
                    ) : results.length > 0 ? (
                        results.map((doc, idx) => {
                            const fileName = doc.name || doc.filename || doc.title;
                            const fileSize = doc.size || doc.file_size;
                            const fileExt = fileName ? fileName.split('.').pop().toUpperCase() : 'FILE';
                            
                            return (
                                <div key={idx} style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #333345',
                                    marginBottom: '12px',
                                    backgroundColor: '#1a1a28',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#222232';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1a1a28';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                >
                                    {/* Основная информация о файле */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        justifyContent: 'space-between',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{
                                                    fontSize: '28px'
                                                }}>
                                                    {fileExt === 'PDF' ? '📕' : fileExt === 'DOCX' ? '📘' : '📄'}
                                                </div>
                                                <div>
                                                    <div style={{ 
                                                        fontWeight: 'bold', 
                                                        color: '#a0a0ff', 
                                                        fontSize: '16px',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {fileName || `Документ ${idx + 1}`}
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        gap: '12px', 
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        {fileSize && (
                                                            <span style={{ 
                                                                fontSize: '11px', 
                                                                color: '#707075',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                💾 {formatFileSize(fileSize)}
                                                            </span>
                                                        )}
                                                        {doc.date && (
                                                            <span style={{ 
                                                                fontSize: '11px', 
                                                                color: '#707075',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                📅 {doc.date}
                                                            </span>
                                                        )}
                                                        <span style={{ 
                                                            fontSize: '10px', 
                                                            color: '#505065',
                                                            backgroundColor: '#252535',
                                                            padding: '2px 6px',
                                                            borderRadius: '3px'
                                                        }}>
                                                            {fileExt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Кнопка скачивания справа */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(doc);
                                            }}
                                            disabled={downloading === fileName}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: downloading === fileName ? '#3a3a4a' : '#2a2a3a',
                                                border: `1px solid ${downloading === fileName ? '#707075' : '#44ff44'}`,
                                                borderRadius: '5px',
                                                color: downloading === fileName ? '#707075' : '#44ff44',
                                                cursor: downloading === fileName ? 'not-allowed' : 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                transition: 'all 0.2s ease',
                                                opacity: downloading === fileName ? 0.6 : 1,
                                                whiteSpace: 'nowrap',
                                                marginLeft: '15px'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (downloading !== fileName) {
                                                    e.target.style.backgroundColor = '#3a3a4a';
                                                    e.target.style.transform = 'scale(1.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (downloading !== fileName) {
                                                    e.target.style.backgroundColor = '#2a2a3a';
                                                    e.target.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            {downloading === fileName ? '⏳ ЗАГРУЗКА...' : '📥 load'}
                                        </button>
                                    </div>
                                    
                                    {/* Детали поиска */}
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '15px', 
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        marginTop: '8px',
                                        paddingLeft: '40px'
                                    }}>
                                        {doc.score !== undefined && (
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#44ff44',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                backgroundColor: 'rgba(68, 255, 68, 0.1)',
                                                padding: '3px 8px',
                                                borderRadius: '12px'
                                            }}>
                                                🎯 Similarity: {(doc.score * 100).toFixed(1)}%
                                            </div>
                                        )}
                                        
                                        {doc.secret && (
                                            <div style={{ 
                                                fontSize: '11px', 
                                                color: '#ff4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                                padding: '3px 8px',
                                                borderRadius: '12px'
                                            }}>
                                                🔒 SECRET
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : query ? (
                        <div style={{margin: 'auto', fontSize: '20px', color: '#1f1f2a', textAlign: 'center'}}>
                            🔍 Nothing
                        </div>
                    ) : (
                        <div style={{margin: 'auto', fontSize: '30px', color: '#1f1f2a', textAlign: 'center'}}>
                            📁 Files will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}