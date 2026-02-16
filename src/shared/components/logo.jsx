import logo from '../../assets/logo-brightspring_white.svg'

const Logo = () => {
  return (
   <picture>
        <img src={logo} alt='Home Health App' className='w-36' />
   </picture>
  )
}

export default Logo