import mongoose from "mongoose"

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        default: "",
        maxlength: 500
    },
    orgId: {
        type: ObjectId,
        ref: "Organization",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "archived"],
        default: "active"
    },
    ownerId: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
});

projectSchema.index({ orgId: 1, isDeleted: 1, createdAt: -1 });
projectSchema.index({ orgId: 1, name: 1 },{ unique: true, partialFilterExpression: { isDeleted: false } });

const projectModel = mongoose.model("Project",projectSchema);

export default projectModel;