import { useState } from "react"

interface CheckboxProps {
    onChange: () => void
    checked?: boolean
}

function Checkbox({ onChange, checked = false }: CheckboxProps) {
    const [visualChecked, setVisualChecked] = useState(checked)

    return (
        <div className='flex justify-center items-center size-full'>
            <input
                type='checkbox'
                checked={visualChecked}
                onChange={() => {
                    setVisualChecked(v => !v)
                    onChange()
                }}
            />
        </div>
    )
}

export default Checkbox