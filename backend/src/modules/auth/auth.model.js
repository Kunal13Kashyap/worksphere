import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin", "manager"],
            default: "user"
        },
        belongsTo: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("User",UserSchema);

export default UserModel;