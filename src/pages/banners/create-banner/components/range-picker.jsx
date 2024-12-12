import { isAfter, isBefore } from 'date-fns'
import { useEffect } from 'react'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite-no-reset.min.css'

export default function RangeDatePicker({ onSelect }) {
  const today = new Date()
  const oneMonthAgo = new Date().setMonth(today.getMonth() - 1)
  const oneMonthAhead = new Date().setMonth(today.getMonth() + 1)
  useEffect(() => {
    // Create a <style> element
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
      .rs-picker-popup {
        z-index: 1500 !important; /* Ensure this is higher than the modal's z-index */
        position: fixed !important; /* Make the position fixed */
        top: 50% !important; /* Center vertically */
        left: 50% !important; /* Center horizontally */
        transform: translate(-50%, -50%) !important; /* Adjust for exact centering */
      }
      .rs-picker-header-date{
        text-transform: lowercase;
      }
      .rs-date-range-input{
        text-transform: lowercase;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <DateRangePicker size='lg' block appearance="subtle" character=" – "
      disabled={false} format="MM/dd/yyyy" cleanable={false}
      defaultValue={today}
      shouldDisableDate={date => isBefore(date, oneMonthAgo) || isAfter(date, oneMonthAhead)}
      onOk={onSelect} style={{ borderBottom: '1px solid #757575', borderRadius: '0px', width: '100%' }} />
  )
}
