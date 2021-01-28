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
        return WebStorage.getStorage().setItem(WebStorage.KEY_ACCESSTOKEN, data);
    }

    static async getAccessToken(){
        return WebStorage.getStorage().getItem(WebStorage.KEY_ACCESSTOKEN);
    }

    static async removeAccessToken(){
        return WebStorage.getStorage().removeItem(WebStorage.KEY_ACCESSTOKEN);
    }



    static KEY_REFRESHTOKEN = "RefreshToken";
    static async saveRefreshToken(data){
        return WebStorage.getStorage().setItem(WebStorage.KEY_REFRESHTOKEN, data);
    }

    static async getRefreshToken(){
        return WebStorage.getStorage().getItem(WebStorage.KEY_REFRESHTOKEN);
    }

    static async removeRefreshToken(){
        return WebStorage.getStorage().removeItem(WebStorage.KEY_REFRESHTOKEN);
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
        return WebStorage.getStorage().setItem(WebStorage.KEY_AUTHMETHOD, method);
    }

    static async getAuthMethod(){
        return WebStorage.getStorage().getItem(WebStorage.KEY_AUTHMETHOD);
    }

    static async removeAuthMethod(){
        return WebStorage.getStorage().removeItem(WebStorage.KEY_AUTHMETHOD);
    }


    static KEY_CURRENTUSER = "CurrentUser";
    static async saveCurrentUser(currentUserAsString){
        return WebStorage.getStorage().setItem(WebStorage.KEY_CURRENTUSER, currentUserAsString);
    }

    static async getCurrentUser(){
        return WebStorage.getStorage().getItem(WebStorage.KEY_CURRENTUSER);
    }

    static async removeCurrentUser(){
        return WebStorage.getStorage().removeItem(WebStorage.KEY_CURRENTUSER);
    }

    static async clear(){
        localStorage.clear();
        sessionStorage.clear();
    }

}

export default WebStorage;