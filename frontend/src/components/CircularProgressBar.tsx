interface CircularProgressBarProps {
    progress: number;
    size?: number
}

function CircularProgressBar({ progress, size = 40 }: CircularProgressBarProps) {
    const circumference = 2 * Math.PI * size
    const offset = circumference * ((100 - progress) / 100)
    return (
        <div>
            <svg width={size} viewBox="0 0 100 100" transform="rotate(90)">
                <circle r="40" cx="50" cy="50" fill="transparent" stroke="#e0e0e0" stroke-width="12px"></circle>
                <circle r="40" cx="50" cy="50" fill="transparent" stroke="#60e6a8" stroke-width="12px" stroke-linecap="round" stroke-dasharray={circumference} stroke-dashoffset={offset}></circle>
                <text x="-72" y="58" fill="#6bdba7" font-size="28" font-weight="bold" transform="rotate(-90)">{progress}%</text>

                {/* <circle r="40" cx="50" cy="50" fill="transparent" stroke="#e0e0e0" stroke-width="12px"></circle>
                <circle r="40" cx="50" cy="50" fill="transparent" stroke="#60e6a8" stroke-width="12px" stroke-dasharray="240" stroke-dashoffset="109.9px"></circle> */}
            </svg>
        </div>
    )
}
export default CircularProgressBar