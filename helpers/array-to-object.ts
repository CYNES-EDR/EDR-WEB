interface DataItem {
    field: string;
    value: string;
}

function arrayToObject(array: DataItem[]): { [key: string]: string } {
    const resultObject: { [key: string]: string } = {};

    array.forEach(item => {
        resultObject[item.field] = item.value;
    });

    return resultObject;
}

export default arrayToObject;