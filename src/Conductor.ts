import {ISubscription} from "./ISubscription";

export class Conductor {
    private static _subscriptions: ISubscription<unknown>[] = [];

    public static Subscribe<TEvent>(eventName: string, subscriber: ((payload: TEvent) => void) | (() => void), thisArg?: object): ISubscription<TEvent> {
        if (!eventName) {
            throw new Error("Missing eventName parameter.");
        }
        if (typeof subscriber !== 'function') {
            throw new Error("Missing a function in handler parameter.");
        }
        if (!subscriber) {
            throw new Error("Missing handler parameter.");
        }

        const newSubscription: ISubscription<TEvent> = {
            Subscriber: thisArg ? subscriber.bind(thisArg) : subscriber,
            EventName: eventName,
            UnSubscribe: () => {}
        };
        newSubscription.UnSubscribe = () => {
            this._subscriptions = this._subscriptions.filter(subscription => subscription !== newSubscription);
        }
        this._subscriptions.push(newSubscription as ISubscription<unknown>);
        return newSubscription;
    }

    public static Publish<TEvent>(eventName: string, payload?: TEvent): void {
        if (!eventName) {
            throw new Error("Missing eventName parameter.");
        }
        this._subscriptions
            .filter(subscription => subscription.EventName === eventName)
            .forEach(subscription => {
                subscription.Subscriber(payload);
            });
    }
}
