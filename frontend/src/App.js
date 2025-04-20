import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [editingNote, setEditingNote] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-cloud-run-url.a.run.app';
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => {
            setAlertMessage('');
        }, 3000);
    };

    const validateNote = () => {
        if (!newNote.content.trim() && !newNote.title.trim()) {
            showAlert('Judul dan Catatan masih kosong!');
            return false;
        }
        if (!newNote.title.trim()) {
            showAlert('Judul masih Kosong!');
            return false;
        }
        if (!newNote.content.trim()) {
            showAlert('Catatan masih kosong!');
            return false;
        }
        return true;
    };

    const addNote = async () => {
      if (!validateNote()) return;
  
      try {
          const response = await axios.post(`${API_BASE_URL}/notes`, newNote);
          setNotes([response.data, ...notes]); // Menambahkan catatan baru ke awal array
          setNewNote({ title: '', content: '' });
      } catch (error) {
          console.error('Error adding note:', error);
      }
  };
  

    const updateNote = async () => {
        if (!validateNote()) return;

        try {
            const response = await axios.put(`${API_BASE_URL}/notes/${editingNote.id}`, newNote);
            setNotes(notes.map(note => note.id === editingNote.id ? response.data : note));
            setEditingNote(null);
            setNewNote({ title: '', content: '' });
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/notes${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const startEdit = (note) => {
        setEditingNote(note);
        setNewNote({ title: note.title, content: note.content });
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setNewNote({ title: '', content: '' });
    };

    const truncateContent = (content, maxLength = 100) => {
        return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    };

    const showDetails = (note) => {
        setSelectedNote(note);
    };

    const closeDetails = () => {
        setSelectedNote(null);
    };

    return (
        <div className="container">
            <h1>Notes App</h1>

            {alertMessage && (
                <div className="alert-popup">
                    <p>{alertMessage}</p>
                </div>
            )}

            <form onSubmit={(e) => {
                e.preventDefault();
                editingNote ? updateNote() : addNote();
            }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <textarea
                    placeholder="Content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <div className="form-buttons">
                    <button type="submit" className={editingNote ? 'update-btn' : 'add-btn'}>
                        {editingNote ? 'Update Note' : 'Add Note'}
                    </button>
                    {editingNote && (
                        <button type="button" className="cancel-btn" onClick={cancelEdit}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="notes-container">
                <ul>
                    {notes.map(note => (
                        <li key={note.id}>
                            <div>
                                <h2>{note.title}</h2>
                                <p>{truncateContent(note.content)}</p>
                                {note.content.length > 100 && (
                                    <button className="details-btn" onClick={() => showDetails(note)}>Details</button>
                                )}
                            </div>
                            <div className="button-container">
                                <button className="edit-btn" onClick={() => startEdit(note)}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteNote(note.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedNote && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedNote.title}</h2>
                        <p style={{ whiteSpace: 'pre-line' }}>{selectedNote.content}</p>
                        <button onClick={closeDetails}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
