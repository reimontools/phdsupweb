import axios from '../config/axios';

export async function getList(route) {
    try {
        var result = [];
        const res = await axios.get(route);
        if (!res.data.error) {
            result = res.data.result;
        } else {
            console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
        };
    } catch(e) {
        console.log('Err: ' + e);
    };
    return result;
};