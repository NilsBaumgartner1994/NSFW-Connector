import StorageDict from "./StorageDict";

export class MyStorage{

    static storageImplementation = null;

    static setStorageImplementation(storageImplementation){
        MyStorage.storageImplementation = storageImplementation;
    }

    static getStorageImplementation(){
        if(!!MyStorage.storageImplementation){
            return MyStorage.storageImplementation
        } else {
            return StorageDict;
        }
    }

    static async saveAccessToken(data){
       return await MyStorage.getStorageImplementation().saveAccessToken(data);
    }

    static async getAccessToken(){
        return await MyStorage.getStorageImplementation().getAccessToken();
    }

    static async removeAccessToken(){
        return await MyStorage.getStorageImplementation().removeAccessToken();
    }



    static async saveRefreshToken(data){
        return await MyStorage.getStorageImplementation().saveRefreshToken(data);
    }

    static async getRefreshToken(){
        return await MyStorage.getStorageImplementation().getRefreshToken();
    }

    static async removeRefreshToken(){
        return await MyStorage.getStorageImplementation().removeRefreshToken();
    }



    static async saveRememberMe(bool){
        return await MyStorage.getStorageImplementation().saveRememberMe(bool);
    }

    static async getRememberMe(){
        return await MyStorage.getStorageImplementation().getRememberMe();
    }

    static async removeRememberMe(){
        return await MyStorage.getStorageImplementation().removeRememberMe();
    }




    static async saveAuthMethod(method){
        return await MyStorage.getStorageImplementation().saveAuthMethod(method);
    }

    static async getAuthMethod(){
        return await MyStorage.getStorageImplementation().getAuthMethod();
    }

    static async removeAuthMethod(){
        return await MyStorage.getStorageImplementation().removeAuthMethod();
    }



    static async saveCurrentUser(currentUserAsString){
        return await MyStorage.getStorageImplementation().saveCurrentUser(currentUserAsString);
    }

    static async getCurrentUser(){
        let currentUserAsString = await MyStorage.getStorageImplementation().getCurrentUser();
        if(!!currentUserAsString){
            return JSON.parse(currentUserAsString);
        }
        return null;
    }

    static async removeCurrentUser(){
        return await MyStorage.getStorageImplementation().removeCurrentUser();
    }


    static async clear(){
        await MyStorage.removeAccessToken();
        await MyStorage.removeRefreshToken();
        await MyStorage.removeRememberMe();
        await MyStorage.removeAuthMethod();
        await MyStorage.removeCurrentUser();
        try{
            await MyStorage.getStorageImplementation().clear();
        } catch (err){
            console.log(err);
        }
    }

}

export default MyStorage;