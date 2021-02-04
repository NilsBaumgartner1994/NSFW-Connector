import {RequestHelper} from "./RequestHelper";
import {MyStorage} from "./MyStorage";
import {APIRequest} from "./APIRequest";
import NSFWConnector from "./NSFWConnector";

export class AuthConnector {

    static auths = null;

    static async getAuths(){
        if(!AuthConnector.auths){
            let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_GET,"auth/methods");
            if(RequestHelper.isSuccess(answer)){
                AuthConnector.auths = answer.data;
            }
        }
        return AuthConnector.auths || {};
    }

    static async createAccessToken(authObject){
        let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_POST,"auth/accessToken",{auth: authObject});
        if(RequestHelper.isSuccess(answer)){
            let accessToken = answer.data.accessToken;
            await MyStorage.saveAccessToken(accessToken);
        }
        return answer;
    }

    static async refreshAccessToken(){
        let refreshToken = await MyStorage.getRefreshToken();
        let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_POST,"auth/refresh", {refreshToken: refreshToken});
        if(RequestHelper.isSuccess(answer)){
            let accessToken = answer.data.accessToken;
            await MyStorage.saveAccessToken(accessToken);
        } else {
            await MyStorage.removeRefreshToken();
        }
        return answer;
    }

    static async authorize(authObject, rememberMe=false){

        let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_POST,"auth/authorize",{auth: authObject, rememberMe: rememberMe});
        if(RequestHelper.isSuccess(answer)){
            let data = answer.data;
            let currentUser = data.currentUser;
            let accessToken = data.accessToken;
            let refreshToken = data.refreshToken;
            await MyStorage.saveRememberMe(rememberMe);
            await MyStorage.saveAuthMethod(authObject["authMethod"]);
            await MyStorage.saveCurrentUser(JSON.stringify(currentUser));
            await MyStorage.saveAccessToken(accessToken);
            await MyStorage.saveRefreshToken(refreshToken);
        } else {
            await MyStorage.clear();
        }
        return answer;
    }

    static async loadFromServerCurrentUser(){
        let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,"auth/currentUser");
        if(RequestHelper.isSuccess(answer)){
            return answer.data;
        }
        return null;
    }

    static async isLoggedInUser(){
        let currentUser = await AuthConnector.loadFromServerCurrentUser();
        return !!currentUser;
    }

    static async logout(){
        let refreshToken = MyStorage.getRefreshToken();
        let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_POST,"auth/logout", {refreshToken: refreshToken});
        await MyStorage.clear();
        await NSFWConnector.handleLogout();
        return answer;
    }

    static async logoutFromAllDevices(authObject){
        let answer = await RequestHelper.sendRequest(RequestHelper.REQUEST_TYPE_POST,"auth/logoutFromAllDevices", {auth: authObject});
        if(RequestHelper.isSuccess(answer)){
            await MyStorage.clear();
            await NSFWConnector.handleLogout();
            return answer.data;
        }
        return null;
    }

}

export default AuthConnector;