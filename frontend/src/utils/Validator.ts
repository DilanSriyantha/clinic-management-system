export const isValid = (object: any, exceptFields?: string[]): boolean => {
    if(typeof object !== 'object' || object === null || object === undefined)
        return false;

    const keys: string[] = Object.keys(object);
    const lkTelephoneRegex = /^(?:\+94|0)([1-9][0-9])[-]?[0-9]{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    for(var i = 0; i < keys.length; i++) {
        if(exceptFields?.includes(keys[i]))
            continue;

        if(keys[i].match("email")){
            if(!emailRegex.test(object[keys[i]]))
                throw new Error("invalid email");
        }

        if(keys[i].match("telephone")){
            if(!lkTelephoneRegex.test(object[keys[i]]))
                throw new Error("invalid telephone number");
        }

        if(object[keys[i]] === null || object[keys[i]] === undefined)
            return false;
    }

    return true;
};