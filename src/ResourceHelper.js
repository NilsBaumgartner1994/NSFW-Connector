import {APIRequest} from "./APIRequest";
import {RequestHelper} from "./RequestHelper";

export class ResourceHelper {

    static async handleRequestTypeOnMultipleResources(resources, requestType, payloadResources=[], progessCallback=null){
        let amountResources = resources.length;
        let errorList = [];
        let successList = [];
        for(let i=0; i<amountResources; i++){
            let resource = resources[i];
            if(!!progessCallback){
                progessCallback(i, resource, successList, errorList);
            }
            let payloadResource = {};
            if(!!payloadResources && !!payloadResources[i]){
                payloadResource = payloadResources[i];
            }
            let answer = await ResourceHelper.handleRequestTypeOnResource(resource, requestType, payloadResource);
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

    static async handleRequestTypeOnResource(resource, requestType, payloadJSON){
        let route = resource._metaInformations.instanceRoute;
        return await APIRequest.sendRequestWithAutoAuthorize(requestType, route, payloadJSON);
    }

}

export default ResourceHelper;