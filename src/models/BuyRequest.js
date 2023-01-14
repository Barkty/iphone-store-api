import { model, Schema} from "mongoose";
import paginator from "mongoose-paginate-v2";
// eslint-disable-next-line import/no-extraneous-dependencies
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

BuyRequestSchema.plugin(paginator);
BuyRequestSchema.plugin(mongooseAggregatePaginate);
export default model("BuyRequest", BuyRequestSchema);