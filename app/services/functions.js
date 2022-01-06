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
