import { connectDB, connectTestDB } from "./services/database.js"
import server from "./server.js"

let { PORT } = process.env

const server_start = async () => {
    try {
        // Open MongoDB Connection

        const connect = await connectDB()
        console.log(connect)

        // const testConnect = await connectTestDB()
        // console.log(testConnect)

        if (PORT == '' || PORT == null) {
            PORT = 8069
        }

        server.listen(PORT, ()=> {
            console.log(`Server is running on port ${PORT}`)
        })

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

server_start()