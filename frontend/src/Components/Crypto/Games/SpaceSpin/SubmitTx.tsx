import { useCallback, useEffect } from 'react'
import { Contract, utils } from 'ethers'
import styled from 'styled-components'

const SSubmitTx = styled.div`
    margin-top: 24px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 18px;
    width: 300px;
    > h2 {
        margin: 0px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        text-align: center;
    }
    select {
        margin-bottom: 12px;
    }
    input {
        margin-bottom: 12px;
    }
`

const SEntryForm = styled.form`
    display: flex;
    flex-direction: column;
`

interface ISubmitTx {
    color: string
    setColor: any
    amount: string
    setAmount: any
    contract: any
    getPearSignerContract: any
    provider: any
    pearGameAddress: string
}

function SubmitTx({
    color,
    setColor,
    amount,
    setAmount,
    contract,
    getPearSignerContract,
    pearGameAddress,
    provider,
}: ISubmitTx) {
    useEffect(() => {
        if (!contract) return

        // contract?.entryMap(0, 0).then((e: any) => console.log(e))
        // contract?.getRoundEntries(0).then((e: any) => console.log(e))
    }, [contract])

    const submitEntry = useCallback(
        async (ev) => {
            ev.preventDefault()
            if (!color) return alert("Please select a color.")
            if (!amount) return alert("Please enter an amount.")
            const pearToken = await getPearSignerContract(provider)

            const safeAmount = utils.parseUnits(amount, 18)
            const approveResp = await pearToken?.approve(
                pearGameAddress,
                safeAmount
            )

            await provider?.waitForTransaction(approveResp.hash)
            console.log('finished')

            await contract?.submitEntry(
                // (1 * 1e18).toLocaleString('fullwide', {
                //     useGrouping: false,
                // }),
                safeAmount,
                color === 'red' ? 0 : 1
            )
            setAmount('')
            console.log(color, amount)
        },
        [color, amount, contract]
    )

    return (
        <SSubmitTx>
            <h2>Submit Entry</h2>
            <SEntryForm onSubmit={submitEntry}>
                <label htmlFor="select-color">Select Color:</label>
                <select
                    id="select-color"
                    value={color}
                    onChange={(ev) => setColor(ev.target.value)}
                >
                    <option value="" disabled>
                        Select a color
                    </option>
                    <option value="red">Red</option>
                    <option value="black">Black</option>
                </select>
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(ev) => setAmount(ev.target.value)}
                />
                <button type="submit">Submit</button>
                <button
                    type="button"
                    onClick={() =>
                        contract
                            ?.runRandomSettle()
                            .then((e: any) => console.log(e))
                    }
                >
                    Settle
                </button>
            </SEntryForm>
        </SSubmitTx>
    )
}

export default SubmitTx