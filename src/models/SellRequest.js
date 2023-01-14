import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";
// eslint-disable-next-line import/no-extraneous-dependencies
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SellRequestSchema = new mongoose.Schema(
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

SellRequestSchema.plugin(paginator)
SellRequestSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model("SellRequest", SellRequestSchema);