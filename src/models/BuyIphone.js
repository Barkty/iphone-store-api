import { model, Schema} from "mongoose";

const BuyRequestSchema = new Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        storage: { type: String, required: true },
        condition: { type: String, required: true },
        price: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

export default model("BuyRequest", BuyRequestSchema);