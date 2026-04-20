import { useState, useRef } from 'react';

export default function Redactor() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [secretLevel, setSecretLevel] = useState('JUNIOR');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Уровни секретности
    const secretLevels = [
        { value: 'ADMIN', label: 'BLOTNOY' },
        { value: 'ADMIN', label: 'PETUH' },
        { value: 'USER', label: 'VODOLAZ' }
    ];

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        
        // Автозаполнение имени (без расширения)
        if (droppedFile) {
            const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, '');
            setDocumentName(nameWithoutExt);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        if (selectedFile) {
            const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
            setDocumentName(nameWithoutExt);
        }
    };

    const removeFile = () => {
        setFile(null);
        setDocumentName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Select file to upload');
            return;
        }
        if (!documentName.trim()) {
            alert('Enter document title');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentName', documentName);
        formData.append('secretLevel', secretLevel);
        
        try {
            console.log('Отправка:', { file: file.name, documentName, secretLevel });
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`Document "${documentName}" successfully uploaded!\nLevel: ${secretLevel}`);
            
            // Очистка формы
            setFile(null);
            setDocumentName('');
            setSecretLevel('JUNIOR');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            alert('Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="finderContainer" style={{ padding: '20px', width: '100%', height: '100%', overflowY: 'auto' }}>
            
            {/* Drag & Drop зона */}
            <div
                className={`dropZone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                    border: `2px dashed ${isDragging ? '#a0a0ff' : '#333345'}`,
                    borderRadius: '8px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: isDragging ? 'rgba(160, 160, 255, 0.1)' : '#1d1d2c',
                    marginBottom: '15px'
                }}
            >
                <div style={{ fontSize: '32px', marginBottom: '5px' }}>📁</div>
                <p style={{ color: '#cfcfcf', fontSize: '13px' }}>
                    <strong>Drag and drop file</strong> or click to select
                </p>
                <p style={{ color: '#707075', fontSize: '11px', marginTop: '5px' }}>
                    Supported formats: PDF, DOCX, TXT
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.txt,.jpg,.png"
                />
            </div>

            {/* Компактная форма */}
            <div style={{
                backgroundColor: '#20202f',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid #333345'
            }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Название документа"
                        style={{
                            flex: 2,
                            padding: '10px',
                            backgroundColor: '#1d1d2c',
                            border: '1px solid #333345',
                            borderRadius: '5px',
                            color: '#cfcfcf',
                            outline: 'none',
                            fontSize: '13px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#a0a0ff'}
                        onBlur={(e) => e.target.style.borderColor = '#333345'}
                    />
                    
                    <select
                        value={secretLevel}
                        onChange={(e) => setSecretLevel(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#1d1d2c',
                            border: '1px solid #333345',
                            borderRadius: '5px',
                            color: '#cfcfcf',
                            outline: 'none',
                            fontSize: '13px',
                            cursor: 'pointer'
                        }}
                    >
                        {secretLevels.map(level => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Выбранный файл */}
            {file && (
                <div style={{ marginBottom: '15px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: '#2a2a38',
                            borderRadius: '5px',
                            border: '1px solid #44ff44'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                            <span>📄</span>
                            <span style={{ fontWeight: 'bold' }}>{file.name}</span>
                            <span style={{ color: '#707075' }}>({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                            onClick={removeFile}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ff6b6b',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '0 8px'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Кнопка отправки */}
            <button
                onClick={handleSubmit}
                disabled={isUploading || !file}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a1a28',
                    border: '1px solid #333345',
                    borderRadius: '5px',
                    color: '#cfcfcf',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    cursor: isUploading || !file ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isUploading || !file ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                    if (!isUploading && file) {
                        e.target.style.backgroundColor = '#2a2a3a';
                        e.target.style.borderColor = '#a0a0ff';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1a1a28';
                    e.target.style.borderColor = '#333345';
                }}
            >
                {isUploading ? 'UPLOADING...' : 'UPLOAD'}
            </button>
        </div>
    );
}