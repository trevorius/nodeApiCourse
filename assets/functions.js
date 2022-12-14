exports.success = (result) =>{
    return {
        status: 'success',
        result: result
    }
};

exports.error = (message) => {
    return {
        status: 'error',
        message: message
    }
}

exports.createId= (arrayOfIdedElements) => {
    return arrayOfIdedElements[arrayOfIdedElements.length-1].id + 1;
}

exports.isError = (result) =>{
    return result instanceof Error;
}

exports.checkAndChange = (object) =>{
    if (this.isError(object))
        return this.error(object.message);
    else
        return this.success(object);
}
