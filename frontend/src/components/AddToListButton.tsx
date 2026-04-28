import { useState } from "react"

interface AddToListButtonProps {
    addToList: () => Promise<void>
}


function AddToListButton({ addToList }: AddToListButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            await addToList()
        } finally {
            setLoading(false)
        }
    }

    return (
        <button disabled={loading} className="cursor-pointer shadow px-1 py-2 rounded-md bg-[var(--primary)] text-white" onClick={handleClick} >
            {loading ? "Adding..." : "Add to List"}
        </button>
    )
}
export default AddToListButton