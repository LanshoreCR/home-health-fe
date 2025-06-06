import { Button, Card, IconButton, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { toast } from 'sonner'

const DeleteToolModal = ({ open, onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        toast.promise((async () => {
            setIsLoading(true)

            const response = await onConfirm()
            if (response instanceof Error) {
                throw Error('Error while deleting the tool')
            }

            setIsLoading(false)
        })(), {
            loading: 'Deleting tool...',
            success: 'Tool deleted successfully.',
            error: 'Error while deleting tool.'
        })

    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-50'>
                <div className='flex w-full flex-col gap-y-6'>
                    <header className='flex item-center flex-col'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-bold text-md'>Are you sure?</h5>
                            <IconButton onClick={onClose}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </div>

                        <h6>Once you select yes, this tool will be permanently deleted.</h6>
                    </header>
                    <section className='flex flex-row justify-around w-full'>
                        <Button variant='contained' color='primary' onClick={handleSubmit} disabled={isLoading}>Yes</Button>
                        <Button variant='contained' color='primary' onClick={onClose} disabled={isLoading}>No</Button>
                    </section>
                </div>
            </Card>
        </Modal>
    )
}

export default DeleteToolModal