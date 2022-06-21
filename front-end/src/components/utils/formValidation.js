

export const anyFieldEmpty = (formData) => {
    for (const [key, value] of Object.entries(formData)) {
        if (key == "address") {
            for (const [key1, addressValue] of Object.entries(key)) {
                if (addressValue === "") return true;
            }
        }
        if (value === "")
            return true;
    }
    return false;
}

export const isEmail = (val) => {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regEmail.test(val)){
        return false;
    }
    return true;
}
