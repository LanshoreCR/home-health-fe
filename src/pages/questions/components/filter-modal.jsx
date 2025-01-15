import Card from '@mui/material/Card'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function FilterModal({
  open,
  handleOpen,
  handleClose,
  handleOnChangeLocation,
  handleOnChangeToolTemplate,
  currentLocation,
  currentToolTemplate,
  locationOptions,
  toolTemplateOptions
}) {
  return (
    <div>
      <IconButton onClick={handleOpen}>
        <FilterAltIcon fontSize='small' />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-80'>
          <div className='flex w-full flex-col gap-y-6'>
            <header className='flex items-center justify-between'>
              <h5 className='font-bold text-md'>Filter By</h5>
              <IconButton onClick={handleClose}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </header>
            <section className='flex flex-col gap-y-8'>
              <FormControl className='max-w-60 w-full' size='small'>
                <InputLabel id="demo-simple-select-label">Filter by location</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Filter by location"
                  defaultValue={''}
                  value={currentLocation}
                  onChange={handleOnChangeLocation}
                >
                  <MenuItem value={''}>All</MenuItem>
                  {locationOptions.map((option) => (
                    <MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className='max-w-72 w-full' size='small'>
                <InputLabel id="demo-simple-select-label">Filter by template</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Filter by template"
                  disabled={currentLocation === ''}
                  value={currentToolTemplate}
                  onChange={handleOnChangeToolTemplate}
                >
                  <MenuItem value={''}>All</MenuItem>
                  {toolTemplateOptions.map((option) => (
                    <MenuItem value={option.templateId} key={option.templateId}>{option.templateDesc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>
          </div>
        </Card>
      </Modal>
    </div>
  )
}
