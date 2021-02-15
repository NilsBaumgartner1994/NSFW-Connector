import {NSFWConnector} from "./NSFWConnector";
import {APIRequest} from "./APIRequest";
import {RouteHelper} from "./RouteHelper";
import {RequestHelper} from "./RequestHelper";
import NFSWResource from "./NFSWResource";

export class ResourceAssociationHelper {

    static async handlePostAssociationsForResource(resourceClass, associationTableName,associationResources){
        let route = RouteHelper.getIndexRouteForAssociation(resourceClass,associationTableName);

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

    static async handleGetAssociationsForResource(resourceClass, associationTableName,filterParams={}){
        if(!filterParams){
            filterParams = {};
        }
        let route = RouteHelper.getIndexRouteForAssociation(resourceClass,associationTableName);
        let filterParam = ResourceAssociationHelper.getURLFilterParamsAddon(filterParams);

        let url = route+"?"+filterParam;
        let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,url);
        if(RequestHelper.isSuccess(answer)) {
            if(answer.data.length >= 0){
                let listOfResources = [];
                for(let i=0; i<answer.data.length; i++){
                    let association = answer.data[i];
                    let synchronizedResource = association
                    let associationResourceClass = new NFSWResource(associationTableName, synchronizedResource);
                    await associationResourceClass._setSynchronizedResource(synchronizedResource);
                    listOfResources.push(associationResourceClass);
                }
                return listOfResources;
            } else {
                let synchronizedResource = answer.data
                let associationResourceClass = new NFSWResource(associationTableName, synchronizedResource);
                await associationResourceClass._setSynchronizedResource(synchronizedResource);
                return associationResourceClass;
            }
        }
        return null;
    }

    static async handleRequestTypeOnMultiplePluralAssociation(resourceClass, associationTableName, associationName, associationResources, requestType){
        let amountAssociatedResources = associationResources.length;
        let errorList = [];
        let successList = [];
        for(let i=0; i<amountAssociatedResources; i++){
            let associationResource = associationResources[i];
            let answer = await ResourceAssociationHelper.handleRequestTypeOnPluralAssociation(resourceClass, associationTableName, associationName, associationResource, requestType);
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

    static async handleRequestTypeOnPluralAssociation(resourceClass, associationTableName, associationName, associationResource, requestType){
        let associationModelscheme = await NSFWConnector.getScheme(associationTableName);
        let schemes = await NSFWConnector.getSchemes();
        let route = RouteHelper.getInstanceRouteForAssociatedResource(schemes,resourceClass,associationModelscheme,associationTableName,associationName,associationResource);
        let answer = await APIRequest.sendRequestWithAutoAuthorize(requestType,route);
        return answer;
    }

}

export default ResourceAssociationHelper;