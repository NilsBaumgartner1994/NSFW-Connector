import {NSFWConnector} from "./NSFWConnector";
import {APIRequest} from "./APIRequest";
import {RouteHelper} from "./RouteHelper";
import {RequestHelper} from "./RequestHelper";

export class ResourceAssociationHelper {

    static async handlePostAssociationsForResource(resource, tableName, associationTableName,associationResources){
        let schemes = await NSFWConnector.getSchemes();
        let scheme = await NSFWConnector.getScheme(tableName);
        let route = RouteHelper.getIndexRouteForAssociation(schemes,scheme,tableName,resource,associationTableName);

        let url = route;
        let amountAssociatedResources = associationResources.length;

        let errorList = [];
        let successList = [];
        for(let i=0; i<amountAssociatedResources; i++){
            let associationResource = associationResources[i];
            let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_POST,url,associationResource);
            let success = RequestHelper.isSuccess(answer);
            if(success){
                successList.push(associationResource);
            } else {
                errorList.push(answer);
            }
        }
        return {
            success: successList,
            errors: errorList,
        }
    }

    static getURLFilterParamsAddon(filterParams){
        let filterParam = "&params=";
        if(!!filterParams){
            let customFilterObject =  {};
            let attributeKeys = Object.keys(filterParams);
            for(let i=0; i<attributeKeys.length; i++){
                let attributeKey = attributeKeys[i];
                let content = filterParams[attributeKey];
                let hasValue = content.hasOwnProperty("value");
                if(hasValue){ //is from Datatablefilter Parsed
                    let value = content.value;
                    if(typeof value === "string" || typeof value === "number"){
                        customFilterObject[attributeKey] = {"substring":content.value};
                    } else {
                        customFilterObject[attributeKey] = value;
                    }
                } else { //User defined content
                    customFilterObject[attributeKey] = content;
                }
            }
            filterParam+=JSON.stringify(customFilterObject);
        }
        return filterParam;
    }

    static async handleGetAssociationsForResource(resource, tableName, associationTableName,filterParams={}){
        let schemes = await NSFWConnector.getSchemes();
        let scheme = await NSFWConnector.getScheme(tableName);
        let route = RouteHelper.getIndexRouteForAssociation(schemes,scheme,tableName,resource,associationTableName);
        let filterParam = ResourceAssociationHelper.getURLFilterParamsAddon(filterParams);

        let url = route+"?"+filterParam;
        let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,url);
        if(RequestHelper.isSuccess(answer)) {
            return answer.data;
        }
        return null;
    }

    static async handleRequestTypeOnMultiplePluralAssociation(resource, tableName, associationTableName, associationName, associationResources, requestType){
        let amountAssociatedResources = associationResources.length;
        let errorList = [];
        let successList = [];
        for(let i=0; i<amountAssociatedResources; i++){
            let associationResource = associationResources[i];
            let answer = await ResourceAssociationHelper.handleRequestTypeOnPluralAssociation(resource, tableName, associationTableName, associationName, associationResource, requestType);
            let success = RequestHelper.isSuccess(answer);
            if(success){
                successList.push(associationResource);
            } else {
                errorList.push(answer);
            }
        }
        return {
            success: successList,
            errors: errorList,
        }
    }

    static async handleRequestTypeOnPluralAssociation(resource, tableName, associationTableName, associationName, associationResource, requestType){
        let associationModelscheme = await NSFWConnector.getScheme(associationTableName);
        let schemes = await NSFWConnector.getSchemes();
        let scheme = await NSFWConnector.getScheme(tableName);
        let route = RouteHelper.getInstanceRouteForAssociatedResource(schemes,scheme,tableName,resource,associationModelscheme,associationTableName,associationName,associationResource);
        let answer = await APIRequest.sendRequestWithAutoAuthorize(requestType,route);
        return answer;
    }

}

export default ResourceAssociationHelper;