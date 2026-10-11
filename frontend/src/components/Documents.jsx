import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [files, setFiles] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState([]);

    const fetchDocuments = async () => {
        const res = await fetch(`${API_BASE}/documents`);
        const data = await res.json();
        setDocuments(data);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async () => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadResults([]);
        
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const res = await fetch(`${API_BASE}/documents/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setUploadResults(data.results);
                fetchDocuments();
            } else {
                setUploadResults([{ filename: 'Batch Upload', status: 'Failed' }]);
            }
        } catch (err) {
            setUploadResults([{ filename: 'Batch Upload', status: 'Error occurred' }]);
        }
        setUploading(false);
        setFiles(null);
        document.getElementById('fileInput').value = '';
    };

    const handleDelete = async (id) => {
        await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
        fetchDocuments();
    };

    return (
        <div>
            <h2>Document Management</h2>
            <div className="card">
                <h3>Upload Documents</h3>
                <p style={{color: 'var(--text-muted)'}}>Drag & Drop or Select multiple files. Supported formats: .txt, .pdf</p>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <input id="fileInput" type="file" multiple onChange={e => setFiles(e.target.files)} accept=".txt,.pdf" />
                    <button className="btn" onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Processing...' : 'Upload All'}
                    </button>
                </div>

                {uploadResults.length > 0 && (
                    <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
                        <h4>Upload Status:</h4>
                        {uploadResults.map((r, i) => (
                            <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span>{r.filename}</span>
                                <span style={{
                                    color: r.status.includes('warning') || r.status.includes('Failed') ? 'var(--danger)' :
                                           r.status.includes('Duplicate') ? 'orange' : 'var(--success)'
                                }}>{r.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card">
                <h3>Indexed Documents ({documents.length})</h3>
                {documents.map(doc => (
                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <strong>{doc.filename}</strong>
                            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                ID: {doc.id} | Size: {doc.length} chars
                            </p>
                        </div>
                        <button className="btn" style={{backgroundColor: 'var(--danger)'}} onClick={() => handleDelete(doc.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
