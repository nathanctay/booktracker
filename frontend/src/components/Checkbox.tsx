interface CheckboxProps {
    onChange: () => void
    checked?: boolean
}

function Checkbox({ onChange, checked = false }: CheckboxProps) {
    return (
        <div className='flex justify-center items-center size-full'>
            <input type='checkbox' checked={checked} onChange={onChange} />
        </div>
    )
}

export default Checkbox