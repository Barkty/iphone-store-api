import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const memoryServer = new MongoMemoryServer();
mongoose.set('strictQuery', false);

const { DEV_DATABASE_URL, PRO_DATABASE_URL, NODE_ENV } = process.env

const DATABASE_URL = NODE_ENV === 'development' ? DEV_DATABASE_URL : PRO_DATABASE_URL

/**
 * Connect to database
 */
export const connect = async (uri) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    }
};

/**
 * Connect to test database
 */
export const connectTestDB = async () => {
    const uri = await memoryServer.getUri();
    connect(uri);
};

/**
 * Connect to other databases depending on environment
 */
export const connectDB = async () => {
    await connect(DATABASE_URL);
};

/**
 * Disconnect test database during teardowns
 */
export const disconnect = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

/**
 * Deletes all collections [it is meant for the test databases during teardowns]
 */
export const truncate = async () => {
    if (mongoose.connection.readyState !== 0) {
        const { collections } = mongoose.connection;
        const promises = Object.keys(collections).map((collection) =>
            mongoose.connection.collection(collection).deleteMany({})
        );
        await Promise.all(promises);
    }
};

export const startMemoryServer = () => memoryServer.start();
export const stopMemoryServer = () => memoryServer.stop();
export const getConnectionString = () => memoryServer.getUri();