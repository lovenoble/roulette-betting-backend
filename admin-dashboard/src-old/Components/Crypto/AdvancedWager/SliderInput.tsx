import { useState } from 'react'
import styled from 'styled-components'
import InputNumber from 'rc-input-number'
import Slider from 'react-input-slider'
import numeral from 'numeral'

const SSliderInput = styled.div`
    width: 100%;
    padding: 12px;
    padding-bottom: 6px;
    box-sizing: border-box;
    .rc-input-number-input {
        background: rgba(255, 255, 255, .24);
        color: #47ffca;
        border: 1px solid #47ffca;
        width: 100%;
        margin-bottom: 12px;
        padding: 8px 12px;
        box-sizing: border-box;
        font-size: 20px;
        font-weight: bold;
    }
`


function formatNumber(value: any) {
    return `${numeral(value).format('0,0')} FARE`
}

function parseNumer(value: any) {
    return value.replace(/[^\w\.-]*/g, '')
}

function SliderInput({
    amount,
    setAmount,
}: {
    amount: number
    setAmount: any
}) {
    return (
        <SSliderInput>
            <InputNumber
                className="input-number"
                placeholder="Enter FARE Amount..."
                value={amount}
                onChange={(value) => setAmount(value)}
                formatter={formatNumber}
                inputMode={'numeric'}
                parser={parseNumer}
            />
            <Slider
                xmin={500}
                xmax={50000}
                xstep={10}
                axis="x"
                x={amount}
                styles={{
                    track: {
                        width: '100%',
                        backgroundColor: '#47ffca',
                    },
                    active: {
                        backgroundColor: '#47ffca',
                    },
                    thumb: {
                        background: '#47ffca',
                        border: '2px solid black',
                        height: 28,
                        width: 28,
                    },
                    disabled: {
                        opacity: 0.5,
                    },
                }}
                onChange={({ x }) => setAmount(x)}
            />
        </SSliderInput>
    )
}

export default SliderInput