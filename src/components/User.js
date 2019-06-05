import React from 'react'

function User(props) {
    const {nickname, email, ip} = props.user

    return (
        <tr className="user-container">
            <td>
                <p>{nickname}</p>
            </td>
            <td>
                <p>{email}</p>
            </td>
            <td>
                <p>{ip}</p>
            </td>
            <td align="center">
                <button 
                    onClick={(e) => {
                        if (window.confirm("Delete this user?")) { 
                            props.delUser(nickname)}
                            }
                    }>Delete
                </button>
            </td>
        </tr>
    )
}

export default User
