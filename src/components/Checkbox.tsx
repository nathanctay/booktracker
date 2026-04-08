import React from 'react'

function Checkbox(onChange: () => {}) {
    return (
        <div className='flex justify-center items-center size-full'>
            <input type='checkbox' onChange={onChange} />
        </div>
    )
}

export default Checkbox