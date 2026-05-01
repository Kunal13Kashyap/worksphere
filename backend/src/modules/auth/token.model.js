import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
},{
    timestamps: true
})

const TokenModel = mongoose.model("Token",TokenSchema);
TokenModel.syncIndexes();

export default TokenModel;