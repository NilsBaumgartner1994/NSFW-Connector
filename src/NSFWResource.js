import APIRequest from "./APIRequest";
import RequestHelper from "./RequestHelper";
import NSFWConnector from "./NSFWConnector";
import RouteHelper from "./RouteHelper";
import ResourceHelper from "./ResourceHelper";
import ResourceAssociationHelper from "./ResourceAssociationHelper";

export class NSFWResource {

    static async getAll(tableName, offset, limit, multiSortMeta, filterParams) {
        return await ResourceHelper.loadResourcesFromServer(
            tableName,
            offset,
            limit,
            multiSortMeta,
            filterParams
        );
    }

    static async create(tableName, resourceData) {
        let route = await RouteHelper.getIndexRouteForResourceAsync(tableName);
        let answer = await APIRequest.sendRequestWithAutoAuthorize(
            RequestHelper.REQUEST_TYPE_POST,
            route,
            resourceData
        );
        if (RequestHelper.isSuccess(answer)) {
            let resource = new NSFWResource(tableName);
            await resource._reloadInstanceRoute(answer.data);
            resource._setResource(answer.data);
            return resource;
        }
        return null;
    }

    static async load(tableName, primaryKeys) {
        let resource = new NSFWResource(tableName);
        await resource.loadByResource(primaryKeys);
        return resource;
    }

    /**
     * Call await resource.load ! After instantiation
     * @param tableName the Tablename of the Resource
     */
    constructor(tableName) {
        this._metaInformations = {
            tableName: tableName,
            synchronized: false,
            initialLoadSuccess: false,
        };
    }


    /**
     * Loads Resource by params from webpage
     * @param params {Exams_id: primaryKey}
     * @returns {Promise<void>}
     */
    async loadByParams(params){
        let schemes = await NSFWConnector.getSchemes();
        let route = RouteHelper.getInstanceRouteForParams(schemes,this._metaInformations.tableName,params);
        if(!!route){
            this._metaInformations.instanceRoute = route;
            await this.reload();
        }
    }

    /**
     * Loads Resource by resource dict
     * @param primaryKeys {id: primaryKey}
     * @returns {Promise<void>}
     */
    async loadByResource(primaryKeys){
        await this._reloadInstanceRoute(primaryKeys);
        if(!!this._metaInformations.instanceRoute){
            await this.reload();
        }
    }

    async reload(){
        if(!this.isSynchronized()){
            let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,this.getInstanceRoute());
            if(RequestHelper.isSuccess(answer)) {
                this._metaInformations.initialLoadSuccess = true;
                await this._reloadInstanceRoute(answer.data);
                this._setResource(answer.data);
            } else {
                //TODO how to handle no success
                //case not found, permission denied, ...
            }
        }
    }

    async destroy(){
        if(this._metaInformations.initialLoadSuccess) {
            return await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_DELETE, this.getInstanceRoute());
        }
        return false;
    }

    async save(){
        //updates changes to database
        let resource = this.toJSON();
        let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_PUT,this.getInstanceRoute(),resource);
        if(!RequestHelper.isSuccess(answer)){
            this._metaInformations.synchronized = false;
            if(!answer){
                return {
                    error: "Unkown error"
                }
            }
        } else {
            await this._reloadInstanceRoute(answer.data);
            this._setResource(answer.data);
        }
        return answer;
    }

    async getAssociations(associationName, associationTableName=associationName, filterParams) {
        return await ResourceAssociationHelper.handleGetAssociationsForResource(
            this,
            associationName,
            associationTableName,
            filterParams
        ) || [];
    }

    async addAssociationResource(associationName, associationResource) {
        let associationResources = null;
        if(Array.isArray(associationResource)){
            associationResources = associationResource;
            associationResource = associationResources[0];
        } else {
            associationResources = [associationResource];
        }

        let associationTableName = associationResource.getTablename();
        // m to n or 1 to n
        let toMultiple = associationTableName === associationName;
        if (toMultiple) { //to n
            let responseJSON = await ResourceAssociationHelper.handleRequestTypeOnMultiplePluralAssociation(
                this,
                associationTableName,
                associationName,
                associationResources,
                RequestHelper.REQUEST_TYPE_POST
            );
            return responseJSON;
        } else { //to 1
            let associationModelscheme = await NSFWConnector.getScheme(associationTableName);
            let schemes = await NSFWConnector.getSchemes();

            let route = RouteHelper.getInstanceRouteForAssociatedResource(schemes,this,associationModelscheme,associationTableName,associationName,associationResource);
            let responseJSON = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_POST,route);
            return responseJSON;
        }
    }

    // TODO setAssociations, addAssociation, removeAssociation

    async getScheme() {
        let tableName = this.getTablename();
        return await NSFWConnector.getScheme(tableName);
    }

    isSynchronized(){
        if(!this._metaInformations.synchronized){
            return false;
        }
        return this._isKeySynchronized();
    }

    getKeys(){
        let rawResource = this._metaInformations.rawResource;
        return Object.keys(rawResource);
    }

    resetResource(){
        if(this._metaInformations.initialLoadSuccess){
            this._setResource(this._metaInformations.rawResource);
        }
    }

    getTablename(){
        return this._metaInformations.tableName;
    }

    getInstanceRoute(){
        return this._metaInformations.instanceRoute;
    }

    restoreColumn(column){
        this[column] = this._metaInformations.rawResource[column];
    }

    /**
     * Customize JSON, because of metaInformations not needed
     * https://stackoverflow.com/questions/52895457/json-stringify-objects-custom-serializer
     * @returns {JSON}
     */
    toJSON(){
        let keys = this.getKeys();
        let json = {};
        for(let i = 0; i<keys.length; i++){
            let key = keys[i];
            json[key] = this[key];
        }
        return json;
    }

    async _reloadInstanceRoute(resource){
        let schemes = await NSFWConnector.getSchemes();
        let modelscheme = await this.getScheme();
        this._metaInformations.modelscheme = modelscheme;
        this._metaInformations.instanceRoute = RouteHelper.getInstanceRouteForResource(schemes, modelscheme, this._metaInformations.tableName, resource);
    }

    async _setSynchronizedResource(synchronizedResource){
        this._setResource(synchronizedResource);
        await this._reloadInstanceRoute(synchronizedResource);
    }

    _setResource(resource){
        this._metaInformations.rawResource = resource;
        this._mapRawResourceToInstance();
        this._metaInformations.synchronized = true;
        this._metaInformations.initialLoadSuccess = true;
    }

    _isKeySynchronized(){
        let keys = this.getKeys();
        let rawResource = this._metaInformations.rawResource;
        let keySynchronized = true;
        for(let i=0; i<keys.length; i++){
            let key = keys[i];
            // noinspection EqualityComparisonWithCoercionJS
            if(this[key] != rawResource[key]){ //since date is once a string and once an object, we need != not !==
                keySynchronized = false;
            }
        }
        return keySynchronized;
    }

    _mapRawResourceToInstance(){
        let keys = this.getKeys();
        let rawResource = this._metaInformations.rawResource;
        for(let i=0; i<keys.length; i++){
            let key = keys[i];
            this[key] = rawResource[key];
        }
    }
}

export default NSFWResource
