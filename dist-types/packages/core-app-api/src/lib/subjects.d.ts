import { Observable } from '@backstage/types';
/**
 * A basic implementation of ReactiveX publish subjects.
 *
 * A subject is a convenient way to create an observable when you want
 * to fan out a single value to all subscribers.
 *
 * See http://reactivex.io/documentation/subject.html
 */
export declare class PublishSubject<T> implements Observable<T>, ZenObservable.SubscriptionObserver<T> {
    private isClosed;
    private terminatingError?;
    private readonly observable;
    private readonly subscribers;
    [Symbol.observable](): this;
    get closed(): boolean;
    next(value: T): void;
    error(error: Error): void;
    complete(): void;
    subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
    subscribe(onNext: (value: T) => void, onError?: (error: any) => void, onComplete?: () => void): ZenObservable.Subscription;
}
/**
 * A basic implementation of ReactiveX behavior subjects.
 *
 * A subject is a convenient way to create an observable when you want
 * to fan out a single value to all subscribers.
 *
 * The BehaviorSubject will emit the most recently emitted value or error
 * whenever a new observer subscribes to the subject.
 *
 * See http://reactivex.io/documentation/subject.html
 */
export declare class BehaviorSubject<T> implements Observable<T>, ZenObservable.SubscriptionObserver<T> {
    private isClosed;
    private currentValue;
    private terminatingError;
    private readonly observable;
    constructor(value: T);
    private readonly subscribers;
    [Symbol.observable](): this;
    get closed(): boolean;
    next(value: T): void;
    error(error: Error): void;
    complete(): void;
    subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
    subscribe(onNext: (value: T) => void, onError?: (error: any) => void, onComplete?: () => void): ZenObservable.Subscription;
}
