import { model } from "mongoose";

export const generateFilter = (data) => {

    const { search } = data

    let filter = { }

    if(search === '') {
        filter = { ...filter }
    }

    if(search !== '' && !search?.includes(',')) {
        filter = { ...filter, condition: search, storage: search }
    }

    // eslint-disable-next-line no-unsafe-optional-chaining
    const [name, condition, storage] = search?.split(',')

    if(name && condition) {
        filter = { ...filter, name, condition }
    }

    if(storage) {
        filter = { ...filter, storage }
    }

    return filter
}

const simplePagination = async (data) => {
    const { modelName, filter, projection, page, populate, sort } = data;
    let limit = !data.limit || data.limit > 20 ? 20 : data.limit;
    if (data.exportLimit > 0) {
        limit = data.exportLimit;
    }
    const options = { projection, page: page || 1, limit, lean: true, populate, sort: sort || { _id: -1 } };
    const result = await model(modelName).paginate({ ...filter }, options);
    return result;
};

const aggregatePagination = async (data) => {
    const { modelName, page, pipeline, sort } = data;
    let limit = !data.limit || data.limit > 20 ? 20 : data.limit;
    if (data.exportLimit > 0) {
        limit = data.exportLimit;
    }
    const options = { page: page || 1, limit, lean: true, sort: sort || { _id: -1 } };
    const aggregate = model(modelName).aggregate(pipeline);
    const result = await model(modelName).aggregatePaginate(aggregate, options);
    return result;
};

export const paginate = async (data) => data.pipeline ? aggregatePagination(data) : simplePagination(data);