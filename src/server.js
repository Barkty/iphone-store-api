import compression from 'compression'
import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
import paginator from "mongoose-paginate-v2";
import morgan from 'morgan';
import helmet from 'helmet';
import expressSession from "express-session";
import MongoStore from 'connect-mongo'
import notFound from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';

// Import routes
import homeRoutes from './routes/home.js'

paginator.paginate.options = { lean: true, leanWithId: false };
const { NODE_ENV, SESSION_SECRET, SESSION_DATABASE_URL } = process.env;
const app = express();
app.use(compression());
app.set("trust proxy", 1);
app.use(express.json({ limit: "50MB" }));
app.use(express.urlencoded({ extended: false }));

const getOrigin = (origin, callback) => {
    const allowedOrigin = !origin || ["localhost", "sahcoplc.com.ng"].some((value) => origin.includes(value));
    if (allowedOrigin) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
};

const corsOptions = {
    credentials: true,
    origin: getOrigin
};

const options = {
    mongoUrl: SESSION_DATABASE_URL,
    // mongoOptions: ,
}

app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(helmet())

app.use(
    expressSession({
        name: "iphone-store",
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        store: MongoStore.create(options),
        cookie: {
            sameSite: NODE_ENV === "development" ? "lax" : "none",
            secure: NODE_ENV !== "development"
        }
    })
);

// Routes
const apiPath = "/api";
app.use(apiPath + "/", homeRoutes);

// Use middlewares
app.use(notFound);
app.use(errorHandlerMiddleware)

/**
 * HANDLING UNCAUGHT EXCEPTION ERRORS
 * Process.traceDeprecation = true;
 */
process.on("uncaughtException", (err) => {
    console.log(
      `UNCAUGHT EXCEPTION! Server Shutting down...\n
        ${err.name} \n ${err.message} \n ${err.stack}`
    );
    process.exit(1);
});

export default app;