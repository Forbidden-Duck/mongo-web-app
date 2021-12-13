import API from "./";

export const getDatabases = async (data) => {
    try {
        return (await API.get("mongodb/databases", { params: { ...data } }))
            .data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getCollections = async (data, dbName) => {
    try {
        return (
            await API.get("mongodb/collections", {
                params: { ...data, dbname: dbName },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getDocuments = async (data, dbName, collName, filter) => {
    try {
        return await API.get(`mongodb/collection/${collName}`, {
            params: {
                ...data,
                dbname: dbName,
                limit: filter.limit,
                skip: filter.skip,
            },
        });
    } catch (err) {
        throw err.response.data;
    }
};
