import {SchemeHelper} from "./SchemeHelper";
import {NSFWConnector} from "./NSFWConnector";

export class RouteHelper{

	static getInstanceRoute(schemes, tableName){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api","");
		return getRoute;
	}

	static getInstanceRouteForParams(schemes, tableName, params){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		let paramKeys = Object.keys(params);
		for(let i=0;i<paramKeys.length; i++){
			let paramKey = paramKeys[i];
			getRoute = getRoute.replace(":"+paramKey,params[paramKey]);
		}
		return getRoute;
	}

	static getInstanceRouteForResource(schemes,modelscheme,tableName,resource){
		let primaryKeyFields = SchemeHelper.getPrimaryAttributeKeys(modelscheme);
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		for(let i=0; i<primaryKeyFields.length; i++){
			let primaryKeyField = primaryKeyFields[i];
			let value = resource[primaryKeyField];
			getRoute = getRoute.replace(":"+tableName+"_"+primaryKeyField,value)
		}
		return getRoute;
	}

	static async getIndexRouteForResourceAsync(tableName){
		let schemes = await NSFWConnector.getSchemes();
		return RouteHelper.getIndexRouteForResource(schemes,tableName);
	}

	static getIndexRouteForResource(schemes, tableName){
		let getRoute = schemes[tableName]["INDEX"];
		getRoute = getRoute.replace("/api/","");
		return getRoute;
	}

	static getCreateRouteForResource(schemes, tableName){
		let getRoute = RouteHelper.getIndexRouteForResource(schemes,tableName);
		getRoute = "/create/"+getRoute;
		return getRoute;
	}

	static getIndexRouteForAssociation(resourceClass, associationName){
		let resourceInstanceRoute = resourceClass.getInstanceRoute()
		let associationIndexRoute = resourceInstanceRoute+"/associations/"+associationName;
		return associationIndexRoute;
	}

	static getInstanceRouteForAssociatedResource(schemes,resourceClass, associationModelScheme, associationTableName,associationName, associationResource){
		let associationIndexRoute = RouteHelper.getIndexRouteForAssociation(resourceClass, associationName);
		let associationInstanceRoute = RouteHelper.getInstanceRouteForResource(schemes,associationModelScheme,associationTableName,associationResource);
		let primaryKeyParamsRoute = associationInstanceRoute.replace("models/"+associationTableName+"/","");
		let associationRoute = associationIndexRoute+"/"+primaryKeyParamsRoute;
		return associationRoute;
	}

}

export default RouteHelper;