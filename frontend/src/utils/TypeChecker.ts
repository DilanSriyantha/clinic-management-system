export const instanceOf = <T> (object: any, fields: string[]): object is T => {
    const isValidObject = (typeof object === 'object' && object !== null);
    if(isValidObject){
        for(var field in fields) {
            if(!(field in object))
                return false;
        }
        return true;
    }
    return false;
};

export const isNull = (object: any) => {
    return object === null;
};