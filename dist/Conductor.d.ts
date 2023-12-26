import { ISubscription } from "./ISubscription";
export declare class Conductor {
    private static _subscriptions;
    static Subscribe<TEvent>(eventName: string, subscriber: ((payload: TEvent) => void) | (() => void), thisArg?: object): ISubscription<TEvent>;
    static Publish<TEvent>(eventName: string, payload?: TEvent): void;
}
