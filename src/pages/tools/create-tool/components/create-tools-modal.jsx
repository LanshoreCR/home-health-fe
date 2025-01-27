// import { Add } from '@mui/icons-material'
// import { Box, Button, Card, Grid2, Modal, Select, Typography } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import { getLocations } from '../../../../shared/services/api/endpoints/location'
// import { getTools } from '../../../../shared/services/api/endpoints/tools'
// import { getToolTemplates } from '../../../../shared/services/api/endpoints/tool-template'


// const CreateToolsModal = ({ isOpen, onClose, id }) => {
//     const [locations, setLocations] = useState([])
//     const [toolsByLocation, setToolsByLocation] = useState({})
//     const [tools, setTools] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [availableToolsPerLocation, setAvailableToolsPerLocation] = useState({})
//     const [locationsWithAvailableTools, setLocationsWithAvailableTools] = useState([])
//     const [selectedLocations, setSelectedLocations] = useState([])
//     const [toolsCounter, setToolsCounter] = useState(0);
//     const [addToolForm, setAddToolForm] = useState({})

//     const handleCloseModal = () => {
//         onClose()
//     }
//     const getLocationsWithAvailableTools = (locations, availableTools) => {
//         const locationsWithAvailableTools = locations.filter(location => availableTools[location.id] ? availableTools[location.id].length > 0 : false)
//         return locationsWithAvailableTools
//     }
//     const getAvailableToolsPerLocation = (tools, location, toolTemplate) => {
//         if (location == null) return []
//         const locationTemplateTools = toolTemplate[location.id]
//         if (locationTemplateTools == null) return []
      
//         const toolsByLocation = tools.filter(tool => tool.auditPlaceLocation === location.id)
      
//         const availableLocationTools = locationTemplateTools.filter(tool => !toolsByLocation.map(tool => tool.templateId).includes(tool.templateId))
//         return availableLocationTools
//       }

//     const getAvailableTools = (locations, tools, toolTemplate) => {
//         const availableToolsPerLocation = {}
//         for (const location of locations) {
//           availableToolsPerLocation[location.id] = getAvailableToolsPerLocation(tools, location, toolTemplate)
//         }
//         return availableToolsPerLocation
//       }
      
//     const handleLocationChange = (value, index) => {
//         setAddToolForm(`tools.${index}.location`, value)
//         setAddToolForm(`tools.${index}.tool`, [])

//         const updatedSelectedLocations = watchFields.map(item => item.location).filter(loc => loc !== '')
//         setSelectedLocations(updatedSelectedLocations)
//     }
//     const filteredLocations = (index) => {
//         return locationsWithAvailableTools.filter(loc => !selectedLocations.includes(loc.id) || watchFields[index]?.location === loc.id)
//     }

//     useEffect(() => {
//         setIsLoading(true)
//         getLocations({ packageId: id })
//             .then((data) => {
//                 if (data instanceof Error) {
//                     throw new Error('Error getting locations by audit id')
//                 }
//                 setLocations(data)
//                 setIsLoading(false)
//             })
//             .catch(() => {
//                 toast.error('Error getting locations by audit id')
//             })
//     }, [id])
//     useEffect(() => {
//         setIsLoading(true)
//         getTools({ packageId: id })
//             .then((data) => {
//                 if (data instanceof Error) {
//                     throw new Error('Error getting tools by audit id')
//                 }
//                 setTools(data)
//                 setIsLoading(false)
//             })
//             .catch(() => {
//                 toast.error('Error getting tools by audit id')
//             })
//     }, [id])

//     useEffect(() => {
//         setIsLoading(true)
//         if (locations.length === 0) return
//         const fetchToolTemplates = async () => {
//             const updatedToolsByLocation = {}
//             for (const location of locations) {
//                 const data = await getToolTemplates({ locationId: location.id })
//                 if (data instanceof Error) {
//                     toast.error('Error getting tool template by location id')
//                 } else {
//                     updatedToolsByLocation[location.id] = data
//                 }
//             }
//             setToolsByLocation(updatedToolsByLocation)
//             setIsLoading(false)
//         }
//         fetchToolTemplates()
//     }, [locations])

//     useEffect(() => {
//         const availableToolsPerLocation = getAvailableTools(locations, tools, toolsByLocation)
//         setAvailableToolsPerLocation(availableToolsPerLocation)
//         const locationsWithAvailableTools = getLocationsWithAvailableTools(locations, availableToolsPerLocation)
//         setLocationsWithAvailableTools(locationsWithAvailableTools)
//     }, [locations, toolsByLocation, tools])
//     return (
//         <Modal
//             open={isOpen}
//             onClose={handleCloseModal}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//         >
//             <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] bg-white shadow-2xl  h-[70%]'>
//                 <Grid2 container sx={{ height: '100%' }}>
//                     <Grid2 container width='50%' spacing={2} direction='column' paddingX={3} paddingY={2}>
//                         <Grid2 container direction='column' >
//                             <Typography>Select a location</Typography>
//                             {/* <Select sx={{ flexGrow: 1 }}
//                                 onChange={(e) => handleLocationChange(e.target.value, index)}
//                                 value={field.value}

//                             >
//                                 {filteredLocations(index).map((option) => (
//                                     <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
//                                 ))}
//                             </Select> */}
//                         </Grid2>
//                         <Grid2 container direction='column' >
//                             <Typography>Select your tools</Typography>
//                             <Select sx={{ flexGrow: 1 }}>
//                             </Select>
//                         </Grid2>
//                         <Box alignSelf='flex-end'>
//                             <Button variant='contained' size='small' startIcon={<Add />}>Add tool</Button>
//                         </Box>
//                     </Grid2>
//                     <Grid2
//                         className='bg-blue-50'
//                         width='50%'
//                         container
//                         alignItems='center'
//                         direction='column'
//                         paddingX={3} paddingY={2}>
//                         <Box flexGrow={1} />
//                         <Grid2 container spacing={5}>
//                             <Button variant='contained' onClick={onClose}>Cancel</Button>
//                             <Button variant='contained'>Create</Button>
//                         </Grid2>
//                     </Grid2>
//                 </Grid2>
//             </Card>
//         </Modal >
//     )
// }

// export default CreateToolsModal