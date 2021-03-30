import {APIRequest} from "./APIRequest";
import {RequestHelper} from "./RequestHelper";
import ResourceAssociationHelper from "./ResourceAssociationHelper";

import NFSWResource from "./NSFWResource";

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

    static async loadResourcesFromServer(tableName, offset, limit, multiSortMeta, filterParams){
        let orderParam = "";
        if(!!multiSortMeta && multiSortMeta.length>0){
            orderParam = orderParam+"&order=[";
            for(let i=0; i<multiSortMeta.length; i++){
                if(i>0){
                    orderParam+=",";
                }
                let field = multiSortMeta[i].field;
                let ascending = multiSortMeta[i].order === 1;
                let ASCDESC = ascending ? "ASC" : "DESC";
                orderParam = orderParam+'["'+field+'","'+ASCDESC+'"]';
            }
            orderParam = orderParam+"]";
        }
        let limitParam = "";
        if(!!limit){
            limitParam = "&limit="+limit;
        }

        let offsetParam = "";
        if(!!offset){
            offsetParam="&offset="+offset;
        }

        let filterParam = ResourceAssociationHelper.getURLFilterParamsAddon(filterParams);

        let url = "models/"+tableName+"?"+limitParam+offsetParam+orderParam+filterParam;
        let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,url);
        if(RequestHelper.isSuccess(answer)){
            let resourceList = answer.data;
            let resourceClassList = [];
            for(let i=0; i<resourceList.length; i++){
                let resource = resourceList[i];
                let resourceClass = new NFSWResource(tableName);
                await resourceClass._setSynchronizedResource(resource);
                resourceClassList.push(resourceClass);
            }

            return resourceClassList;
        } else {
            return []; // gebe leere Liste aus
        }
    }

}

export default ResourceHelper;
