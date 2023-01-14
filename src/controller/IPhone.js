import readXlsxFile from "read-excel-file/node";
import { Mongoose } from "mongoose";
import BadRequest from "../utils/badRequest";
import { error, success } from "../helpers/response";
import asyncWrapper from "../middleware/async";
import BuyRequest from "../models/BuyRequest";
import SellRequest from "../models/SellRequest";

const {
    startSession
} = Mongoose;

class IPhoneController {

    uploadRequests = asyncWrapper(async (req, res) => {

        try {
            const { file } = req

            if(!file) {
                throw new BadRequest('Please upload an excel file!')
            }

            let data;

            const session = await startSession();
            await session.withTransaction(async () => {

                const buyRequests = []
                const sellRequests = []
                // eslint-disable-next-line no-undef
                const path = `${__basedir}/${file.filename}`;
    
                readXlsxFile(path).then(async (rows) => {
    
                    // skip header
                    rows.shift();
                    
                    rows.forEach((row) => {
                        const buyIphone = {
                            status: row[0],
                            name: row[1],
                            storage: row[2],
                            condition: row[3],
                            price: row[4]
                        }

                        const iphoneSell = {
                            status: row[0],
                            name: row[1],
                            storage: row[2],
                            condition: row[3],
                            price: row[4]
                        }
                        buyRequests.push(buyIphone)
                        sellRequests.push(iphoneSell)
                    })
                })
    
    
                const newBuyRequests = await BuyRequest.insertMany(buyRequests, { ordered: true, session})
                const newSellRequests = await SellRequest.insertMany(buyRequests, { ordered: true, session})
                data = { newBuyRequests, newSellRequests }
            })


            session.endSession()

            return success(res, 201, data)

        } catch (e) {
            return error(res, 500, e, 'Something went wrong')
        }
    })

    getPhoneRequest = asyncWrapper(async (req, res) => {

        try {
            const { query: { request } } = req

            if(request === 'buy') {

                const buyGadgets = await BuyRequest.find()
                return success(res, 200, buyGadgets)

            }

            const sellGadgets = await SellRequest.find()
            return success(res, 200, sellGadgets)

        } catch (e) {
            return error(res, 500, e, 'Something went wrong')
        }
    })
}

export default IPhoneController;