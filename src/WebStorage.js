export class WebStorage{

    static async getStorage(){
        let rememberMeActive = await WebStorage.getRememberMe();
        if(rememberMeActive){
            return localStorage;
        } else {
            return sessionStorage;
        }
    }

    static KEY_ACCESSTOKEN = "AccessToken";
    static async saveAccessToken(data){
        let storage = await WebStorage.getStorage();
        return storage.setItem(WebStorage.KEY_ACCESSTOKEN, data);
    }

    static async getAccessToken(){
        let storage = await WebStorage.getStorage();
        return storage.getItem(WebStorage.KEY_ACCESSTOKEN);
    }

    static async removeAccessToken(){
        let storage = await WebStorage.getStorage();
        return storage.removeItem(WebStorage.KEY_ACCESSTOKEN);
    }



    static KEY_REFRESHTOKEN = "RefreshToken";
    static async saveRefreshToken(data){
        let storage = await WebStorage.getStorage();
        return storage.setItem(WebStorage.KEY_REFRESHTOKEN, data);
    }

    static async getRefreshToken(){
        let storage = await WebStorage.getStorage();
        return storage.getItem(WebStorage.KEY_REFRESHTOKEN);
    }

    static async removeRefreshToken(){
        let storage = await WebStorage.getStorage();
        return storage.removeItem(WebStorage.KEY_REFRESHTOKEN);
    }


    static KEY_REMEMBERME = "RememberMe";
    static async saveRememberMe(bool){
        //we use local storage, because we want to know it for the next session
        localStorage.setItem(WebStorage.KEY_REMEMBERME, bool+"");
        return true;
    }

    static async getRememberMe(){
        //we use local storage, because we want to know it for the next session
        let remember = true+""===localStorage.getItem(WebStorage.KEY_REMEMBERME);
        return remember;
    }

    static async removeRememberMe(){
        //we use local storage, because we want to know it for the next session
        localStorage.removeItem(WebStorage.KEY_REMEMBERME);
        return true;
    }


    static KEY_AUTHMETHOD = "AuthMethod";
    static async saveAuthMethod(method){
        let storage = await WebStorage.getStorage();
        return storage.setItem(WebStorage.KEY_AUTHMETHOD, method);
    }

    static async getAuthMethod(){
        let storage = await WebStorage.getStorage();
        return storage.getItem(WebStorage.KEY_AUTHMETHOD);
    }

    static async removeAuthMethod(){
        let storage = await WebStorage.getStorage();
        return storage.removeItem(WebStorage.KEY_AUTHMETHOD);
    }


    static KEY_CURRENTUSER = "CurrentUser";
    static async saveCurrentUser(currentUserAsString){
        let storage = await WebStorage.getStorage();
        return storage.setItem(WebStorage.KEY_CURRENTUSER, currentUserAsString);
    }

    static async getCurrentUser(){
        let storage = await WebStorage.getStorage();
        return storage.getItem(WebStorage.KEY_CURRENTUSER);
    }

    static async removeCurrentUser(){
        let storage = await WebStorage.getStorage();
        return storage.removeItem(WebStorage.KEY_CURRENTUSER);
    }

    static async clear(){
        localStorage.clear();
        sessionStorage.clear();
    }

}

export default WebStorage;