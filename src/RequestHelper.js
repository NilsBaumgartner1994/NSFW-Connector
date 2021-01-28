import {MyStorage} from "./MyStorage";

export class RequestHelper {

    static REQUEST_TYPE_GET = "GET";
    static REQUEST_TYPE_POST = "POST";
    static REQUEST_TYPE_PUT = "PUT";
    static REQUEST_TYPE_DELETE = "DELETE";


    static getAPIURL(){
        let base_url = window.location.origin;
        //console.log("base_url");
        //console.log(base_url);
        return base_url+"/api/";
    }

    static downloadFileFromUrl(fileName, url){
        let link = document.createElement("a");
        link.href = RequestHelper.getAPIURL()+url;
        link.setAttribute("download", fileName);
        link.click();
    }


    /**
     * Privater
     * @param requestType
     * @param resource_url
     * @param payload_json
     * @param headers
     * @returns {Promise<undefined|any>}
     */
    static async private_sendRequest(requestType, resource_url, payloadRaw, headers){
        if(payloadRaw === undefined){
            payloadRaw = "{}";
        }

        resource_url = RequestHelper.getAPIURL()+resource_url;
        console.warn("SendRequest resource_url: "+resource_url);
        //console.log("resource_url:");
        //console.log(resource_url);

        let response = undefined;

        if(requestType===RequestHelper.REQUEST_TYPE_GET){
            response = await fetch(resource_url, {
                method: requestType,
                credentials: 'include',
                headers: headers,
            });
        } else {
            console.log("Anything other than GET")
            response = await fetch(resource_url, {
                method: requestType,
                headers: headers,
                credentials: 'include',
                body: payloadRaw,
            });
        }
        try {

            //console.log(response);
            let answer = await response.json();
            //console.log(answer);
            return answer;
        } catch(e){
            console.log("Error at: ");
            console.log(e);
            console.log("requestType: "+requestType);
            console.log("resource_url: "+resource_url);
            console.log("payload_json: "+payloadRaw);
            return undefined;
        }
    }


    static async private_sendRequestWithJSONPayload(requestType, resource_url, payload_json = {}, headers){
        //console.warn("SendRequest to: "+url);
        let payload = JSON.stringify(payload_json);
        return await RequestHelper.private_sendRequest(requestType,resource_url,payload,headers);
    }

    static isSuccess(answer){
        return !!answer && answer.success;
    }

    static async sendRequestWithAccessToken(requestType, resource_url, payload_json){
        let headers = await RequestHelper.getHeadersWithAccessToken();
        let answer = await RequestHelper.private_sendRequestWithJSONPayload(requestType, resource_url, payload_json,headers);
        return answer;
    }

    static async getHeadersForFilesWithAccessToken(){
        let accessToken = await MyStorage.getAccessToken();
        let headers = new Headers({
            Authorization: "AccessToken " + accessToken,
            // No need for content type
        });
        //https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
        return headers;
    }

    static async sendFilesWithAccessToken(requestType,resource_url, fileList){
        console.log("sendFilesWithAccessToken");
        let formData = new FormData();
        for(let i=0; i<fileList.length; i++){
            let file = fileList[i];
            formData.append(i+"", file);
        }
        console.log(formData);

        let headers = await RequestHelper.getHeadersForFilesWithAccessToken();
        console.log(headers);
        console.log("Start now private request");
        return await RequestHelper.private_sendRequest(requestType,resource_url,formData,headers);
    }

    static async sendRequest(requestType, resource_url, payload_json){
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        return await RequestHelper.private_sendRequestWithJSONPayload(requestType, resource_url, payload_json,headers);
    }

    static async getHeadersWithAccessToken(){
        let accessToken = await MyStorage.getAccessToken();
        let headers = new Headers({
            Authorization: "AccessToken " + accessToken,
            "Content-Type": "application/json",
        });
        return headers;
    }

}

export default RequestHelper;
