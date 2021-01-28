import {RequestHelper} from "./RequestHelper";
import {APIRequest} from "./APIRequest";
import MyStorage from "./MyStorage";

export class NSFWConnector {

    static Callback_Logout = null;

    static schemes = null;
    static tableSchemes = {};
    static tableRoutes = {};
    static tableAssociations = {};

    constructor() {

    }

    static setStorageImplementation(storageImplementation){
        MyStorage.storageImplementation = storageImplementation;
    }

    static async handleLogout(){
        if(!!NSFWConnector.Callback_Logout){
            await NSFWConnector.Callback_Logout();
        }
    }

    static reset(){
        NSFWConnector.schemes = null;
        NSFWConnector.tableSchemes = {};
        NSFWConnector.tableRoutes = {};
        NSFWConnector.tableAssociations = {};
    }

    static async getSchemes(){
        if(!NSFWConnector.schemes){
            let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,"schemes");
            if(RequestHelper.isSuccess(answer)){
                NSFWConnector.schemes = answer.data || {};
            }
        }
        return NSFWConnector.schemes;
    }

    static async getScheme(tableName){
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET, "schemes/" + tableName);
        return await NSFWConnector.getVariableDownloadIt("tableSchemes",tableName,asyncFn);
    }

    static async getSchemeRoutes(tableName){
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET,"schemes/"+tableName+"/routes");
        return await NSFWConnector.getVariableDownloadIt("tableRoutes",tableName,asyncFn);
    }

    static async getSchemeAssociations(tableName){
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET,"schemes/"+tableName+"/associations");
        return await NSFWConnector.getVariableDownloadIt("tableAssociations",tableName,asyncFn);
    }

    static async getVariableDownloadIt(sequelizeConnectorSaveVariable,keyVariable,asyncFn){
        if(!NSFWConnector[sequelizeConnectorSaveVariable][keyVariable]){
            let answer = await asyncFn();
            if(RequestHelper.isSuccess(answer)){
                NSFWConnector[sequelizeConnectorSaveVariable][keyVariable] = answer.data;
            }
        }
        return NSFWConnector[sequelizeConnectorSaveVariable][keyVariable];
    }


}

export default NSFWConnector;