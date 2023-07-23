import { action, makeAutoObservable, makeObservable, observable, observe } from 'mobx';

// import AppConsts from './../lib/appconst'
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import Cookies from 'js-cookie';

//declare let abp: any

class AuthenticationStore {
    loginModel: LoginModel = new LoginModel();

    get isAuthenticated(): boolean {
        if (!Cookies.get('userId')) {
            return false;
        }

        return true;
    }

    public async login(model: LoginModel) {
        const result = await tokenAuthService.authenticate({
            userNameOrEmailAddress: model.userNameOrEmailAddress,
            password: model.password,
            rememberClient: model.rememberMe
        });

        const tokenExpireDate = model.rememberMe
            ? new Date(new Date().getTime() + 1000 * result.expireInSeconds)
            : undefined;
        Cookies.set('accessToken', result.accessToken, { expires: tokenExpireDate });
        Cookies.set('encrptedAuthTokenName', result.encryptedAccessToken, {
            expires: tokenExpireDate,
            path: '/'
        });
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        // get an array of all cookie names
        const cookieNames = Object.keys(Cookies.get());

        // loop through each cookie name and remove the cookie
        cookieNames.forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
    }

    constructor() {
        makeAutoObservable(this);
    }
}
export default AuthenticationStore;
