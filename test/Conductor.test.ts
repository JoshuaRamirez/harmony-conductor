import { Conductor } from "../src/Conductor";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import {ISubscription} from "../src/ISubscription";

describe('Conductor Class Tests', () => {
    describe('Initial State', () => {
        it('should have an empty _subscriptions array on initialization', () => {
            // Access the private _subscriptions using any type casting, as it's private
            const subscriptions = (Conductor as any)._subscriptions;
            expect(subscriptions).toBeDefined();
            expect(subscriptions).toHaveLength(0);
        });
    });

    describe('Subscribe Method', () => {
        // Reset the state before each test
        beforeEach(() => {
            (Conductor as any)._subscriptions = [];
        });

        it('should add a subscription with valid Subscriber and EventName', () => {
            const testEventName = 'testEvent';
            const testSubscriber = jest.fn();

            const subscription = Conductor.Subscribe(testEventName, testSubscriber);

            const subscriptions = (Conductor as any)._subscriptions;
            expect(subscriptions).toHaveLength(1);
            expect(subscriptions[0].EventName).toBe(testEventName);
            expect(subscriptions[0].Subscriber).toBe(testSubscriber);
            expect(typeof subscription.UnSubscribe).toBe('function');
        });

        it('should bind Subscriber to thisArg when provided', () => {
            const testEventName = 'testEvent';
            const testSubscriber = jest.fn();
            const thisArg = { value: 'test' };

            Conductor.Subscribe(testEventName, testSubscriber, thisArg);

            const subscriptions = (Conductor as any)._subscriptions;
            const boundFunction = subscriptions[0].Subscriber;

            // Check if Subscriber is bound to the provided thisArg
            boundFunction();
            expect(testSubscriber.mock.instances[0]).toBe(thisArg);
        });

        it('should handle duplicate subscriptions', () => {
            const testEventName = 'testEvent';
            const testSubscriber = jest.fn();

            Conductor.Subscribe(testEventName, testSubscriber);
            Conductor.Subscribe(testEventName, testSubscriber);

            const subscriptions = (Conductor as any)._subscriptions;
            expect(subscriptions).toHaveLength(2);
        });

        it('should handle invalid or empty EventName in Subscribe', () => {
            const invalidEventName = '';
            const testSubscriber = jest.fn();

            expect(() => {
                Conductor.Subscribe(invalidEventName, testSubscriber);
            }).toThrow("Missing eventName parameter.");
        });

        it('should handle invalid or null Subscriber in Subscribe', () => {
            const testEventName = 'testEvent';
            const invalidSubscriber: any = null;

            expect(() => {
                Conductor.Subscribe(testEventName, invalidSubscriber);
            }).toThrow("Missing a function in handler parameter.");
        });

        it('should handle undefined EventName in Subscribe', () => {
            const testSubscriber = jest.fn();

            expect(() => {
                Conductor.Subscribe(undefined as any, testSubscriber);
            }).toThrow("Missing eventName parameter.");
        });

        it('should handle undefined Subscriber in Subscribe', () => {
            const testEventName = 'testEvent';

            expect(() => {
                Conductor.Subscribe(testEventName, undefined as any);
            }).toThrow("Missing a function in handler parameter.");
        });
    });

    describe('Publish Method', () => {
        // Reset the state before each test
        beforeEach(() => {
            (Conductor as any)._subscriptions = [];
        });

        it('should call the Subscriber when publishing to a subscribed event', () => {
            const testEventName = 'testEvent';
            const testPayload = { data: 'test' };
            const testSubscriber = jest.fn();

            Conductor.Subscribe(testEventName, testSubscriber);
            Conductor.Publish(testEventName, testPayload);

            expect(testSubscriber).toHaveBeenCalledWith(testPayload);
        });

        it('should not call any Subscribers when publishing with no subscribers', () => {
            const testEventName = 'testEvent';
            const testPayload = { data: 'test' };
            const testSubscriber = jest.fn();

            Conductor.Publish(testEventName, testPayload);

            expect(testSubscriber).not.toHaveBeenCalled();
        });

        it('should call all relevant Subscribers when publishing to an event with multiple subscribers', () => {
            const testEventName = 'testEvent';
            const testPayload = { data: 'test' };
            const firstSubscriber = jest.fn();
            const secondSubscriber = jest.fn();

            Conductor.Subscribe(testEventName, firstSubscriber);
            Conductor.Subscribe(testEventName, secondSubscriber);
            Conductor.Publish(testEventName, testPayload);

            expect(firstSubscriber).toHaveBeenCalledWith(testPayload);
            expect(secondSubscriber).toHaveBeenCalledWith(testPayload);
        });

        it('should handle invalid or empty EventName in Publish', () => {
            const invalidEventName = '';

            expect(() => {
                Conductor.Publish(invalidEventName);
            }).toThrow("Missing eventName parameter.");
        });

        it('should handle undefined EventName in Publish', () => {
            expect(() => {
                Conductor.Publish(undefined as any);
            }).toThrow("Missing eventName parameter.");
        });
    });

    describe('Integration Tests', () => {
        // Reset the state before each test
        beforeEach(() => {
            (Conductor as any)._subscriptions = [];
        });

        it('should correctly handle a series of Subscribe and Publish actions', () => {
            const firstEventName = 'firstEvent';
            const secondEventName = 'secondEvent';
            const firstPayload = { data: 'first' };
            const secondPayload = { data: 'second' };

            const firstSubscriber = jest.fn();
            const secondSubscriber = jest.fn();

            // Subscribe Subscribers to different events
            Conductor.Subscribe(firstEventName, firstSubscriber);
            Conductor.Subscribe(secondEventName, secondSubscriber);

            // Publish events
            Conductor.Publish(firstEventName, firstPayload);
            Conductor.Publish(secondEventName, secondPayload);

            // Verify if the correct Subscribers were called with the correct payloads
            expect(firstSubscriber).toHaveBeenCalledWith(firstPayload);
            expect(secondSubscriber).toHaveBeenCalledWith(secondPayload);
        });
    });

    describe('Unsubscribe Method', () => {
        // Reset the state before each test
        beforeEach(() => {
            (Conductor as any)._subscriptions = [];
        });

        it('should unsubscribe a subscriber from an event', () => {
            const testEventName = 'testEvent';
            const testPayload = { data: 'test' };
            const testSubscriber = jest.fn();

            // Subscribe the subscriber
            const subscription = Conductor.Subscribe(testEventName, testSubscriber);

            // Publish the event to verify it's subscribed
            Conductor.Publish(testEventName, testPayload);
            expect(testSubscriber).toHaveBeenCalledWith(testPayload);

            // Unsubscribe the subscriber
            subscription.UnSubscribe();

            // Publish the event again, subscriber should not be called
            Conductor.Publish(testEventName, testPayload);
            expect(testSubscriber).toHaveBeenCalledTimes(1); // Called only once
        });

        it('should handle multiple subscribers and unsubscribe the correct one', () => {
            const testEventName = 'testEvent';
            const testPayload = { data: 'test' };
            const firstSubscriber = jest.fn();
            const secondSubscriber = jest.fn();

            // Subscribe multiple subscribers to the same event
            Conductor.Subscribe(testEventName, firstSubscriber);
            Conductor.Subscribe(testEventName, secondSubscriber);

            // Publish the event to verify both subscribers are called
            Conductor.Publish(testEventName, testPayload);
            expect(firstSubscriber).toHaveBeenCalledWith(testPayload);
            expect(secondSubscriber).toHaveBeenCalledWith(testPayload);

            // Unsubscribe the first subscriber
            const firstSubscription = (Conductor as any)._subscriptions.find(
                (subscription: ISubscription<any>) => subscription.Subscriber === firstSubscriber
            );
            firstSubscription.UnSubscribe();

            // Publish the event again, only the second subscriber should be called
            Conductor.Publish(testEventName, testPayload);
            expect(firstSubscriber).toHaveBeenCalledTimes(1); // Called once before unsubscribing
            expect(secondSubscriber).toHaveBeenCalledTimes(2); // Called twice (including the first publish)
        });

        it('should not throw an error when unsubscribing a non-existent subscriber', () => {
            const testEventName = 'testEvent';
            const testSubscriber = jest.fn();

            // Subscribe the subscriber
            const subscription = Conductor.Subscribe(testEventName, testSubscriber);

            // Unsubscribe the subscriber
            subscription.UnSubscribe();

            // Unsubscribe again, should not throw an error
            expect(() => {
                subscription.UnSubscribe();
            }).not.toThrow();
        });
    });


});
