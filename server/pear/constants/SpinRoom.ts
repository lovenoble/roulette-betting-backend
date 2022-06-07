export enum SpinEvent {
    /** Spin timer seconds updated */
    TimerUpdated = 'TimerUpdated',
    /** User sent new chat message */
    NewChatMessage = 'NewChatMessage',
    /** Only sent to a single guest client on connect (passes guestId) */
    GuestUserJoined = 'GuestUserJoined',
}

export enum ChatMessage {
    NewChatMessage = 'NewChatMessage',
}

export enum MediaStreamMessage {
    NEW_SCREEN_SHARE = 'NewScreenShare',
    TOGGLE_SCREEN_SHARE = 'ToggleScreenShare',
    STOP_SCREEN_SHARE = 'StopScreenShare',
}
