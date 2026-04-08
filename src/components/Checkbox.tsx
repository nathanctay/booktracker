interface CheckboxProps {
    onChange: () => void
}

function Checkbox({ onChange }: CheckboxProps) {
    return (
        <div className='flex justify-center items-center size-full'>
            <input type='checkbox' onChange={onChange} />
        </div>
    )
}

export default Checkbox