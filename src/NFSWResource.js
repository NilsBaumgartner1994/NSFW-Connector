import APIRequest from "./APIRequest";
import RequestHelper from "./RequestHelper";
import NSFWConnector from "./NSFWConnector";
import RouteHelper from "./RouteHelper";

export class NFSWResource {

    /**
     * Call await resource.load ! After instantiation
     * @param tableName the Tablename of the Resource
     * @param params can be a resource or just a dict like: {id: primKey}
     */
    constructor(tableName, params) {
        this._metaInformations = {
            tableName: tableName,
            params: params,
            synchronized: false,
            initialLoadSuccess: false
        };
    }

    /**
     * Every Resource needs to be loaded
     * @returns {Promise<void>}
     * @private
     */
    async load(){
        let schemes = await NSFWConnector.getSchemes();
        let route = RouteHelper.getInstanceRouteForParams(schemes,this._metaInformations.tableName,this._metaInformations.params);
        if(!!route){
            this._metaInformations.instanceRoute = route;
            await this.reload();
        }
    }

    async _setSynchronizedResource(synchronizedResource){
        this._setResource(synchronizedResource);
        await this._reloadInstanceRoute(synchronizedResource);
    }

    async reload(){
        if(!this.isSynchronized()){
            let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,this.getInstanceRoute());
            if(RequestHelper.isSuccess(answer)) {
                this._metaInformations.initialLoadSuccess = true;
                await this._reloadInstanceRoute(answer.data);
                this._setResource(answer.data);
            }
        }
    }

    async destroy(){
        if(this._metaInformations.initialLoadSuccess) {
            return await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_DELETE, this.getInstanceRoute());
        }
        return false;
    }

    async _reloadInstanceRoute(resource){
        let schemes = await NSFWConnector.getSchemes();
        this._metaInformations.instanceRoute = RouteHelper.getInstanceRouteForParams(schemes, this._metaInformations.tableName, resource);
    }

    _setResource(resource){
        this._metaInformations.rawResource = resource;
        this._mapRawResourceToInstance();
        this._metaInformations.synchronized = true;
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

    _mapRawResourceToInstance(){
        let keys = this.getKeys();
        let rawResource = this._metaInformations.rawResource;
        for(let i=0; i<keys.length; i++){
            let key = keys[i];
            this[key] = rawResource[key];
        }
    }

    isSynchronized(){
        if(!this._metaInformations.synchronized){
            return false;
        }
        return this._isKeySynchronized();
    }

    _isKeySynchronized(){
        let keys = this.getKeys();
        let rawResource = this._metaInformations.rawResource;
        let keySynchronized = true;
        for(let i=0; i<keys.length; i++){
            let key = keys[i];
            if(this[key] !== rawResource[key]){
                keySynchronized = false;
            }
        }
        return keySynchronized;
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

}

export default NFSWResource
