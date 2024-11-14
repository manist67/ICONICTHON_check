import { Icon } from '@iconify/react';
import '../assets/Title.css'

// eslint-disable-next-line react/prop-types
export default function Title({ iconName, children }) {
    return (
      <div className='title-wrapper'>
        <h1>
          <Icon icon={iconName} color='#068AFF' fontSize={56}/>
          <span>{children}</span>
        </h1>
      </div>
    )
}