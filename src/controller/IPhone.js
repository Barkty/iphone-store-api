/* eslint-disable no-await-in-loop */
import readXlsxFile from "read-excel-file/node";
import BadRequest from "../utils/badRequest";
import { error, success } from "../helpers/response";
import asyncWrapper from "../middleware/async";
import BuyRequest from "../models/BuyRequest";
import SellRequest from "../models/SellRequest";
import { paginate } from "../helpers/paginate";

class IPhoneController {

    uploadRequests = asyncWrapper(async (req, res) => {

        try {
            const { file } = req

            if(!file) {
                throw new BadRequest('Please upload an excel file!')
            }

            let newBuyRequests;
            let newSellRequests;

            const buyRequests = []
            const sellRequests = []
            
            // eslint-disable-next-line no-undef
            const path = `${__basedir}/${file.filename}`;

            const rows = await readXlsxFile(path)
            
            // skip header
            rows.shift();
            rows.shift();
            let num = 1
            let sell = 1

            rows.forEach((row) => {
                const buyIphone = {
                    _id: num++,
                    name: row[0],
                    storage: row[1],
                    condition: row[2],
                    price: row[3],
                    status: row[4],
                }

                buyRequests.push(buyIphone)

                const iphoneSell = {
                    _id: sell++,
                    name: row[7],
                    storage: row[8],
                    condition: row[9],
                    price: row[10],
                    status: row[11],
                }

                sellRequests.push(iphoneSell)
            })

            for (let i = 0; i < buyRequests.length; i++) {
        
                newBuyRequests = await BuyRequest.updateMany(
                    { _id: buyRequests[i]._id }, 
                    { $set: { name: buyRequests[i].name, storage:buyRequests[i].storage,
                                condition: buyRequests[i].condition, price:buyRequests[i].price,
                                status: buyRequests[i].status }},
                    { upsert: true }
                )
                
            }

            for (let i = 0; i < sellRequests.length; i++) {

                newSellRequests = await SellRequest.updateMany(
                    { _id: sellRequests[i]._id }, 
                    { $set: { name: sellRequests[i].name, storage: sellRequests[i].storage,
                        condition: sellRequests[i].condition, price: sellRequests[i].price,
                        status: sellRequests[i].status }},
                    { upsert: true }
                )
            }

            const data = { newSellRequests, newBuyRequests }

            if(data.newBuyRequests && data.newSellRequests) {

                return success(res, 201, data)
            }

            return error(res, 500, 'Could not load your excel sheet')


        } catch (e) {
            return error(res, 500, e, 'Something went wrong')
        }
    })

    getPhoneRequest = asyncWrapper(async (req, res) => {

        try {
            const { query: { request, page, limit } } = req
            const modelName = request === 'buy' ? 'BuyRequest' : 'SellRequest'
            const options = { page, limit, modelName, sort: { createdAt: -1 } };

            const data = await paginate(options);
            return success(res, 200, data);

        } catch (e) {
            return error(res, 500, e, 'Something went wrong')
        }
    })
}

export default IPhoneController;