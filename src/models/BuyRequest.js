import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";
// eslint-disable-next-line import/no-extraneous-dependencies
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const BuyRequestSchema = new mongoose.Schema(
    {
        _id: { type: Number, required: true },
        name: { type: String, required: true, trim: true },
        storage: { type: String, required: true, trim: true },
        condition: { type: String, required: true, trim: true },
        price: { type: String, required: true, trim: true },
        status: { type: String, required: true, trim: true },
        avatar: { type: String, trim: true }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

BuyRequestSchema.plugin(paginator);
BuyRequestSchema.plugin(mongooseAggregatePaginate);
export default mongoose.model("BuyRequest", BuyRequestSchema);