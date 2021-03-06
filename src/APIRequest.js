import {AuthConnector} from "./AuthConnector";
import {RequestHelper} from "./RequestHelper";
import NSFWConnector from "./NSFWConnector";

export class APIRequest {

    static async sendRequestWithAutoAuthorize(requestType, resource_url, payload_json){
        let answer = await RequestHelper.sendRequestWithAccessToken(requestType, resource_url, payload_json);
        if(RequestHelper.isSuccess(answer)){
            return answer;
        } else if(!!answer && !!answer.error) {
            let error = answer.error;
            if(error.message === "AccessTokenExpiredError" || error.message === "AccessTokenInvalid"){
                let refreshAnswer = await AuthConnector.refreshAccessToken();
                if(RequestHelper.isSuccess(refreshAnswer)){
                    return await RequestHelper.sendRequestWithAccessToken(requestType, resource_url, payload_json);
                } else if(!!refreshAnswer && !!refreshAnswer.error) {
                    error = refreshAnswer.error;
                    if(error.message === "RefreshTokenInvalid" || error.message === "RefreshTokenMissing"){
                        await NSFWConnector.handleLogout();
                    }
                }
            } else { //let the other handle the error
                return answer;
            }
        }
        return null;
    }
}

export default APIRequest;