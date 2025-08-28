import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, LogOut, User } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/notes/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setNotes(response.data.notes)
    } catch (error) {
      setError('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    
    if (!noteForm.title.trim()) {
      setError('Title is required')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/api/notes/`, noteForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNotes(prev => [response.data.note, ...prev])
      setNoteForm({ title: '', content: '' })
      setIsCreateModalOpen(false)
      setError('')
    } catch (error) {
      setError('Failed to create note')
    }
  }

  const handleEditNote = async (e) => {
    e.preventDefault()
    
    if (!noteForm.title.trim()) {
      setError('Title is required')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_BASE_URL}/api/notes/${currentNote._id}`, noteForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNotes(prev => prev.map(note => 
        note._id === currentNote._id ? response.data.note : note
      ))
      setNoteForm({ title: '', content: '' })
      setIsEditModalOpen(false)
      setCurrentNote(null)
      setError('')
    } catch (error) {
      setError('Failed to update note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNotes(prev => prev.filter(note => note._id !== noteId))
    } catch (error) {
      setError('Failed to delete note')
    }
  }

  const openEditModal = (note) => {
    setCurrentNote(note)
    setNoteForm({
      title: note.title,
      content: note.content
    })
    setIsEditModalOpen(true)
  }

  const openCreateModal = () => {
    setNoteForm({ title: '', content: '' })
    setIsCreateModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Take All Notes
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your notes and stay organized.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Create Note Button */}
        <div className="mb-6">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={noteForm.content}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Note
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No notes yet</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium text-gray-900 truncate">
                      {note.title}
                    </CardTitle>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Note Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditNote} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter note content"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default Dashboard

