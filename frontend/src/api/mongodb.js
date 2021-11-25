import API from "./";

export const getDatabases = async (data) => {
    try {
        return (await API.get("mongodb/databases", { params: { ...data } }))
            .data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getCollections = async (data) => {
    try {
        return (await API.get("mongodb/collections", { params: { ...data } }))
            .data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getDocuments = async (data, filter) => {
    const query = [];
    if (filter.limit) query.push(`limit=${filter.limit}`);
    if (filter.skip) query.push(`skip=${filter.skip}`);
    try {
        return await API.get(
            `mongodb/documents${query.length > 0 && `?${query.join("&")}`}`,
            { params: { ...data } }
        );
    } catch (err) {
        throw err.response.data;
    }
};
