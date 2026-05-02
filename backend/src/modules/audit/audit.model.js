import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AuditSchema = new Schema(
    {
        action: {
            type: String,
            required: true
        },
        actor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        target: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        },
        status: {
            type: String,
            required: true
        },
        ip: String
    },{
        timestamps: true
    }
)

const AuditModel = mongoose.model("Audit",AuditSchema);

export default AuditModel;