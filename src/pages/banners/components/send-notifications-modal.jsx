import { useEffect, useState } from 'react'
import { Autocomplete, Button, Card, Checkbox, FormControl, IconButton, Modal, TextField } from '@mui/material'
// import { getNotificationUsers, sendCAPANotification } from '../../../shared/services/api/endpoints/capa'
import CloseIcon from '@mui/icons-material/Close'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { toast } from 'sonner'

const SendNotificationModal = ({ isOpen, onClose, packageId }) => {
    const [notificationUsers, setNotificationUsers] = useState([])
    const [selectedNotificationUsers, setSelectedNotificationUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async () => {
        setIsLoading(true)
        // if (selectedNotificationUsers.length > 0) {
        //     const Receipts = selectedNotificationUsers.map(({ email, employeeID }) => ({ email, employeeID }))
        //     const response = await sendCAPANotification({
        //         Receipts,
        //         CAPALink: `${window.location.origin}/${packageId}/capa`,
        //         PackageID: packageId
        //     })
        //     if (response instanceof Error) {
        //         toast.error('error while sending capa notification')
        //         return
        //     }
        //     toast.success('capa notification sent successfully')
        // }
        setIsLoading(false)
        setSelectedNotificationUsers([])
        onClose()
    }

    useEffect(() => {
        if (!isOpen) return
        // getNotificationUsers().then(res => {
        //     if (res instanceof Error) {
        //         throw new Error('error getting notifications users')
        //     }
        //     setNotificationUsers(res)
        // }).catch(err => {
        //     toast.error(err)
        // })
    }, [isOpen])

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[475px] bg-white shadow-2xl p-6 pb-10 min-h-60'>
                <div className='flex w-full flex-col gap-y-6'>
                    <header className='flex items-center justify-between'>
                        <h5 className='font-bold text-md'>Send Notifications</h5>
                        <IconButton onClick={onClose}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </header>
                    <section className='flex flex-col gap-y-8 w-full'>
                        <FormControl size='small'>
                            <Autocomplete
                                multiple
                                id="users"
                                options={notificationUsers}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.email}
                                value={selectedNotificationUsers}
                                onChange={(event, newValue) => {
                                    setSelectedNotificationUsers(newValue)
                                }}
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props;
                                    return <li key={key} {...optionProps}>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.email}
                                    </li>
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label='Who needs to be notified?' />
                                )}
                            />

                        </FormControl>
                        <Button variant='contained' color='primary' onClick={onSubmit} disabled={isLoading} >Send</Button>
                    </section>
                </div>
            </Card>
        </Modal>
    )
}

export default SendNotificationModal
