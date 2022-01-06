const {createId} = require('./functions');

exports.nameAllreadyExists = (name,members, id= null) => {
    for (let i = 0; i < members.length; i++) {
        if (members[i].name === name && members[i].id !== id) {
                return true;
        }
    }
    return false;
};

exports.createNewMember = (name,members) => {
    const id = createId(members);
    let newMember = {
        id: id,
        name: name
    };
    members.push(
        newMember
    );
    return newMember;
}

exports.getIndex = (id,members) => {
        for (let i = 0; i < members.length; i++) {
            if (members[i].id == id) {
                return i;
            }
        }
    return "invalid id";
}
