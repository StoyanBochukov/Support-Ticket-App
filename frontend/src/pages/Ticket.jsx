import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getTicket, closeTicket } from '../features/tickets/ticketSlice'
import { getNotes, createNote, reset as notesReset } from '../features/notes/noteSlice'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import {FaPlus} from 'react-icons/fa'


const customStyles = {
    content: {
        width: '600px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative'
    },
}

Modal.setAppElement('#root')


const Ticket = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [noteText, setNoteText] = useState('')

    const {ticket, isLoading, isSuccess, isError, message} = useSelector((state) => state.tickets)
    const {notes, isLoading: noteIsLoading} = useSelector((state) => state.notes)
    const params = useParams()
    const dispatch = useDispatch()
    const {ticketId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(isError){
            toast.error(message)
        }

        dispatch(getTicket(ticketId))
        dispatch(getNotes(ticketId))
    }, [isError, message, ticketId])

    if(isLoading || noteIsLoading){
        return <Spinner />
    }
    if(isError){
        <h3>Something went wrong</h3>
    }


    //Open/Close Modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    //On Note submit
    const onNoteSubmit = (e) => {
        e.preventDefault()
        dispatch(createNote({noteText, ticketId}))
        closeModal()
    }

    //Close Ticket
    const onTicketClose = () => {
        dispatch(closeTicket(ticketId))
        toast.success('Ticket closed')
        navigate('/tickets')
    }

  return (
    <div className='ticket-page'>
        <header className="ticket-header">
            <BackButton url='/tickets' />
            <h2>
                Ticket ID: {ticket._id}
                <span className={`status status-${ticket.status}`}>
                    {ticket.status}
                </span>
            </h2>
            <h3>Date Submitted {new Date(ticket.createdAt).toLocaleString('en-UK')} </h3>
            <h3>Product: {ticket.product}</h3>
            <hr />
            <div className="ticket-desc">
                <h3>Description of Issue</h3>
                <p> {ticket.description} </p>
            </div>
            <h2>Notes</h2>
        </header>

        {ticket.status !== 'closed' && (
            <button onClick={openModal} className='btn'> <FaPlus />Add Note</button>
        )}

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
            <h2>Add Note</h2>
            <button className='btn-close' onClick={closeModal}>X</button>
            <form onSubmit={onNoteSubmit}>
                <div className="form-group">
                    <textarea name="noteText" id="noteText" className='form-control'
                     placeholder='Note text' value={noteText} onChange={(e)=> setNoteText(e.target.value)} ></textarea>
                </div>
                <div className="form-group">
                    <button type='submit' className="btn">Submit</button>
                </div>
            </form>
        </Modal>

        {notes.map((note) => (
            <NoteItem key={note._id} note={note} />
        ))}
        {ticket.status !== 'closed' && (
            <button className="btn btn-block btn-danger" onClick={onTicketClose}>Close Ticket</button>
        )}
    </div>
  )
}

export default Ticket