import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InviteSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    orgId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Organization"
    },
    status: {
        type: String,
        enum: ["pending","accepted"],
        default: "pending"
    }
},{
    timestamps: true
});

const InviteModel = mongoose.model("Invite",InviteSchema);

export default InviteModel;