import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async ()=> {
    mongoose.set('strictQuery', true);

    if(isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "Mailing_System",
            serverSelectionTimeoutMS: 5000, // Increase timeout for server selection
            socketTimeoutMS: 45000, // Increase socket timeout
        })
        isConnected=true;
        console.log('MongoDB connected')

    } catch (error) {
        console.log(error);
    }
}
