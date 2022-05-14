const inMemoryJWTManager = () => {
    let inMemoryJWT = null;
    let expiresIn = null;

    const getExpiresIn = () => expiresIn;

    const setExpiresIn = (expiration) => {
        expiresIn = expiration;
    }

    const deleteExpiration = () => {
        expiresIn = null;
        return true;
    };
 
    const getToken = () => inMemoryJWT;
 
    const setToken = (token) => {
        inMemoryJWT = token;
        return true;
    };
 
    const deleteToken = () => {
        inMemoryJWT = null;
        return true;
    };
 
    return {
        getToken,
        setToken,
        deleteToken,
        getExpiresIn,
        setExpiresIn,
        deleteExpiration
    };
};
 
export default inMemoryJWTManager();