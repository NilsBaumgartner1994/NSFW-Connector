export class EnviromentHelper {

    static ENVIROMENT_WEB = "Web";
    static ENVIROMENT_REACT_NATIVE = "ReactNative";
    static ENVIROMENT_NODE = "Node";

    static getEnviroment(){
        if (typeof document != 'undefined') {
            return EnviromentHelper.ENVIROMENT_WEB;
        }
        else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
            return EnviromentHelper.ENVIROMENT_REACT_NATIVE;
        }
        else {
            return EnviromentHelper.ENVIROMENT_NODE;
        }
    }

}

export default EnviromentHelper;
