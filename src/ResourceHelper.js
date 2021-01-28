import {NSFWConnector} from "./NSFWConnector";
import {APIRequest} from "./APIRequest";
import {RouteHelper} from "./RouteHelper";
import {RequestHelper} from "./RequestHelper";

export class ResourceHelper {

    static async handleRequestTypeOnMultipleResources(resources, tableName, requestType, payloadResources=[], progessCallback=null){
        let amountResources = resources.length;
        let errorList = [];
        let successList = [];
        for(let i=0; i<amountResources; i++){
            let resource = resources[i];
            if(!!progessCallback){
                progessCallback(i, resource, successList, errorList);
            }
            let payloadResource = payloadResources[i] || {};
            let answer = await ResourceHelper.handleRequestTypeOnResource(resource, tableName, requestType, payloadResource);
            let success = RequestHelper.isSuccess(answer);
            if(success){
                successList.push(resource);
            } else {
                errorList.push(answer);
            }
        }
        return {
            success: successList,
            errors: errorList,
        }
    }

    static async handleRequestTypeOnResource(resource, tableName, requestType, payloadJSON){
        let schemes = await NSFWConnector.getSchemes();
        let scheme = await NSFWConnector.getScheme(tableName);
        let route = RouteHelper.getInstanceRouteForResource(schemes,scheme,tableName,resource);
        let answer = await APIRequest.sendRequestWithAutoAuthorize(requestType,route, payloadJSON);
        return answer;
    }

}

export default RequestHelper;