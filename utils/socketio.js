const NEW_CHAT_EVENT = "new_chat"
const DISCONNECT_EVENT = "disconnect"

exports.socketio = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        const { roomId } = socket.handshake.query
        socket.join(roomId)

        socket.on(NEW_CHAT_EVENT, (data) => {
            io.in(roomId).emit(NEW_CHAT_EVENT, data)
        })
        
        socket.on(DISCONNECT_EVENT, () => {
            socket.leave(roomId)
        })
    })

}