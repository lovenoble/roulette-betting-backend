export interface IEntry {
    id?: string,
    publicAddress?: string,
    roundId: string,
    amount: string,
    pickedColor: string,
    isSettled: boolean,
    result: string,
    winAmount: string,
}

export interface IWallet {
    id: string,
    publicAddress?: string,
    ethBalance: string,
    pearBalance: string,
    depositBalance: string,
    queueBalance: string,
    prizeBalance: string,
}

export interface IGuestPlayer {
    guestUsername: string,
    pearBalance: string,
    depositBalance: string,
    queueBalance: string,
}

export interface IPearState {
    gamePlayers: Map<string, IWallet>
    guestPlayers: Map<string, IGuestPlayer>
    myWallet: IWallet
    pearSupply: string
    currentRoundId: string
    entries: Map<string, IEntry[]>
}
