import { useMemo } from 'react'
import shortId from 'shortid'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-bottts-sprites'

function UserAvatar({
    publicAddress = '',
    ...props
}) {
    const defaultAvatar = useMemo(
        () =>
            createAvatar(style, {
                seed: publicAddress || shortId(),
                base64: true,
                colorful: true,
            }),
        [publicAddress]
    )

    return <img alt="User Avatar" src={defaultAvatar} {...props} />
}

export default UserAvatar