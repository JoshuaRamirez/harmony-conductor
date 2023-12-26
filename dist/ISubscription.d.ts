export interface ISubscription<TEvent> {
    Subscriber: (payload: TEvent) => void;
    EventName: string;
    UnSubscribe: () => void;
}
