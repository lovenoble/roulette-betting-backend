import styled from 'styled-components'
import { motion } from 'framer-motion'

const SColorPicker = styled.div`
    width: 94%;
    height: 12px;
    display: flex;
`

const SColorPickerFill = styled.div<{ colorOption: string, isSelected: boolean }>`
    background: ${({ colorOption }) => colorOption};
    opacity: ${({ isSelected }) => isSelected ? '1' : '0.5'};
    height: 100%;
    flex: 1;
`

interface IColorPicker {
    selectedColor: string
    setSelectedColor: any
}

const colors: { [key: string]: string } = {
    pink: '#F72585',
    teal: '#3D5AFE',
}

function ColorPicker({
    selectedColor,
    setSelectedColor
}: IColorPicker) {

    return (
        <SColorPicker>
            {Object.keys(colors).map((color, idx) => (
                <SColorPickerFill
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    colorOption={colors[color]}
                    isSelected={selectedColor === color}
                />
            ))}
        </SColorPicker>
    )
}

export default ColorPicker