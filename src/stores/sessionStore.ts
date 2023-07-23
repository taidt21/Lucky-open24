import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import sessionService from '../services/session/sessionService';

class SessionStore {
    currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();
    async getCurrentLoginInformations() {
        const result = await sessionService.getCurrentLoginInformations();
        this.currentLogin = result;
    }
    constructor() {
        makeAutoObservable(this);
    }
}

export default SessionStore;
