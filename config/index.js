import dotenv from "dotenv";
dotenv.config();

const venvs = {
  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || "dbname",
  MONGO_LOCAL_IP: process.env.MONGO_LOCAL_IP || "localhost",
  MONGO_LOCAL_PORT: process.env.MONGO_LOCAL_PORT || "27017",
  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || "root, admin",
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || "mongoAtlasPass",
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || "xxxxxmongoDb.net",
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || "dbname",
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY || "session secret key",
  PORT: process.env.PORT || 8080,
};

export default venvs;
