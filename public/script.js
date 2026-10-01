document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('fileUpload');
    const searchInput = document.getElementById('searchInput');
    const clearSessionBtn = document.getElementById('clearSessionBtn');
    const fileList = document.getElementById('fileList');
    const resultsList = document.getElementById('resultsList');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.querySelector('.progress-fill');

    // Load initial files if any exist in session
    fetchFiles();

    // Event Listeners
    fileUpload.addEventListener('change', handleFileUpload);
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    clearSessionBtn.addEventListener('click', handleClearSession);

    async function handleFileUpload(e) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (const file of files) {
            formData.append('documents', file);
        }

        // Show progress
        uploadProgress.classList.remove('hidden');
        progressFill.style.width = '50%'; // Simple mock progress

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                progressFill.style.width = '100%';
                
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    progressFill.style.width = '0%';
                    fetchFiles(); // Refresh file list
                    if (searchInput.value.trim()) {
                        handleSearch(); // Refresh search results
                    }
                }, 500);
            } else {
                console.error('Upload failed');
                uploadProgress.classList.add('hidden');
            }
        } catch (err) {
            console.error('Error uploading:', err);
            uploadProgress.classList.add('hidden');
        }
        
        // Reset file input
        e.target.value = '';
    }

    async function fetchFiles() {
        try {
            const res = await fetch('/api/files');
            const files = await res.json();
            renderFileList(files);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    }

    function renderFileList(files) {
        if (files.length === 0) {
            fileList.innerHTML = '<li class="empty-state">No documents uploaded.</li>';
            return;
        }

        fileList.innerHTML = '';
        files.forEach(file => {
            const li = document.createElement('li');
            li.className = 'file-item';
            
            // Determine icon based on mimetype
            let iconClass = 'ri-file-text-line';
            if (file.type.includes('pdf')) iconClass = 'ri-file-pdf-line';
            else if (file.type.includes('word')) iconClass = 'ri-file-word-line';
            else if (file.type.includes('html')) iconClass = 'ri-html5-line';

            li.innerHTML = `
                <div class="file-icon"><i class="${iconClass}"></i></div>
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-meta">${formatBytes(file.size)}</div>
                </div>
            `;
            fileList.appendChild(li);
        });
    }

    async function handleSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            resultsList.innerHTML = '<div class="empty-state">Enter a query to start searching.</div>';
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const results = await res.json();
            renderSearchResults(results);
        } catch (err) {
            console.error('Error searching:', err);
        }
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            resultsList.innerHTML = '<div class="empty-state">No relevant documents found.</div>';
            return;
        }

        resultsList.innerHTML = '';
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'result-item';
            
            // Highlight terms in snippet
            let highlightedSnippet = result.snippet || "No snippet available.";
            if (result.matchedTerms && result.matchedTerms.length > 0) {
                const regex = new RegExp(`(${result.matchedTerms.join('|')})`, 'gi');
                highlightedSnippet = highlightedSnippet.replace(regex, '<mark>$1</mark>');
            }

            const lineInfo = result.lineNum > 0 ? `Line ${result.lineNum}` : `Snippet`;

            div.innerHTML = `
                <div class="file-icon"><i class="ri-file-list-3-line"></i></div>
                <div class="file-info" style="flex: 1; min-width: 0;">
                    <div class="file-name-score-wrapper" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <div class="file-name" style="font-size: 1.05rem;">${result.name}</div>
                        <div class="result-score">Rank: ${result.score}</div>
                    </div>
                    <div class="file-meta" style="color: var(--primary-color); margin-bottom: 4px;">
                        <i class="ri-map-pin-line"></i> ${lineInfo}
                    </div>
                    <div class="snippet" style="font-size: 0.85rem; color: #cbd5e1; font-style: italic; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; overflow: hidden; text-overflow: ellipsis;">
                        "...${highlightedSnippet}..."
                    </div>
                </div>
            `;
            
            // Add click listener to open the document viewer modal
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => openDocumentViewer(result.id, result.matchedTerms));
            
            resultsList.appendChild(div);
        });
    }

    // Modal elements
    const docModal = document.getElementById('docModal');
    const modalDocTitle = document.getElementById('modalDocTitle');
    const modalDocBody = document.getElementById('modalDocBody');
    const closeModalBtn = document.getElementById('closeModalBtn');

    closeModalBtn.addEventListener('click', () => {
        docModal.classList.add('hidden');
    });

    async function openDocumentViewer(docId, matchedTerms) {
        try {
            const res = await fetch(`/api/document/${docId}`);
            if (!res.ok) throw new Error('Document not found');
            const data = await res.json();
            
            modalDocTitle.textContent = data.name;
            
            let highlightedContent = data.content;
            if (matchedTerms && matchedTerms.length > 0) {
                // Escape terms for regex just in case
                const safeTerms = matchedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                const regex = new RegExp(`(${safeTerms.join('|')})`, 'gi');
                highlightedContent = highlightedContent.replace(regex, '<mark>$1</mark>');
            }
            
            modalDocBody.innerHTML = highlightedContent;
            docModal.classList.remove('hidden');
        } catch (err) {
            console.error('Error opening document:', err);
            alert('Could not load document content.');
        }
    }

    async function handleClearSession() {
        if (!confirm('Are you sure you want to clear the session? All uploaded files and indexed data will be lost.')) {
            return;
        }

        try {
            const response = await fetch('/api/clear', { method: 'POST' });
            if (response.ok) {
                fileList.innerHTML = '<li class="empty-state">No documents uploaded.</li>';
                resultsList.innerHTML = '<div class="empty-state">Enter a query to start searching.</div>';
                searchInput.value = '';
            }
        } catch (err) {
            console.error('Error clearing session:', err);
        }
    }

    // Utility: Debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: Format bytes
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
});
