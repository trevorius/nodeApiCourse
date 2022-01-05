exports.nameAllreadyExists = (name,members) => {
    for (let i = 0; i < members.length; i++) {
        if (members[i].name === name) {
            return true;
        }
    }
    return false;
};

exports.createNewMember = (name,members) => {
    let newMember = {
        id: members.length + 1,
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
