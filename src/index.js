/* eslint-disable no-console */
import { connectDB } from "./services/database"
import server from "./server"

let { PORT } = process.env

const serverStart = async () => {
    try {
        // Open MongoDB Connection

        const connect = await connectDB()
        console.log('Live DB: ', connect)

        // const testConnect = await connectTestDB()
        // console.log('Test DB: ', testConnect)

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

serverStart()