export class StorageDict{

    static data = {};

    static KEY_ACCESSTOKEN = "AccessToken";
    static async saveAccessToken(data){
        StorageDict.data[StorageDict.KEY_ACCESSTOKEN] = data;
        return true;
    }

    static async getAccessToken(){
        return StorageDict.data[StorageDict.KEY_ACCESSTOKEN];
    }

    static async removeAccessToken(){
        delete StorageDict.data[StorageDict.KEY_ACCESSTOKEN];
        return true;
    }

    static KEY_REFRESHTOKEN = "RefreshToken";
    static async saveRefreshToken(data){
        StorageDict.data[StorageDict.KEY_REFRESHTOKEN] = data;
        return true;
    }

    static async getRefreshToken(){
        return StorageDict.data[StorageDict.KEY_REFRESHTOKEN];
    }

    static async removeRefreshToken(){
        delete StorageDict.data[StorageDict.KEY_REFRESHTOKEN];
        return true;
    }


    static KEY_REMEMBERME = "RememberMe";
    static async saveRememberMe(bool){
        StorageDict.data[StorageDict.KEY_REMEMBERME] = bool;
        return true;
    }

    static async getRememberMe(){
        return StorageDict.data[StorageDict.KEY_REMEMBERME];
    }

    static async removeRememberMe(){
        delete StorageDict.data[StorageDict.KEY_REMEMBERME];
        return true;
    }



    static KEY_AUTHMETHOD = "AuthMethod";
    static async saveAuthMethod(method){
        StorageDict.data[StorageDict.KEY_AUTHMETHOD] = method;
        return true;
    }

    static async getAuthMethod(){
        return StorageDict.data[StorageDict.KEY_AUTHMETHOD];
    }

    static async removeAuthMethod(){
        delete StorageDict.data[StorageDict.KEY_AUTHMETHOD];
        return true;
    }


    static KEY_CURRENTUSER = "CurrentUser";
    static async saveCurrentUser(currentUserAsString){
        StorageDict.data[StorageDict.KEY_CURRENTUSER] = currentUserAsString;
        return true;
    }

    static async getCurrentUser(){
        return StorageDict.data[StorageDict.KEY_CURRENTUSER];
    }

    static async removeCurrentUser(){
        delete StorageDict.data[StorageDict.KEY_CURRENTUSER];
        return true;
    }

    static async clear(){
        StorageDict.data = {};
    }

}

export default StorageDict;