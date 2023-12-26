# HarmonyConductor

Harmony: Conductor is a lightweight, easy-to-use event bus for managing application-level events. This simple yet powerful tool facilitates communication between different parts of your application without tight coupling.

## Features

- [**Event Subscriptions**](#event-subscriptions): Subscribe to events with custom handlers.
- [**Event Publishing**](#event-publishing): Publish events with optional payloads.
- [**Type Safety**](#type-safety): Generic support for event payloads.

## Installation

Install HarmonyConductor via npm:

```bash
npm install harmony-conductor
```

Or using Yarn:

```bash
yarn add harmony-conductor
```

## Usage

### Importing

First, import the HarmonyConductor library into your project:

```typescript
import { Conductor } from 'harmony-conductor';
```

### Event Subscriptions

To subscribe to an event, use the `Conductor.Subscribe` method. You can provide an event name and a handler function.

```typescript
Conductor.Subscribe('myEvent', payload => {
    console.log('Event payload:', payload);
});
```

For events without a payload:

```typescript
Conductor.Subscribe('simpleEvent', () => {
    console.log('Simple event triggered');
});
```

### Event Publishing

To trigger an event, use `Conductor.Publish`. You can provide the event name and an optional payload.

```typescript
Conductor.Publish('myEvent', { key: 'value' });
```

For events without a payload:

```typescript
Conductor.Publish('simpleEvent');
```

### Unsubscribing from Events

When you no longer need to listen to an event, you can unsubscribe from it. Use the UnSubscribe method available on the subscription object returned when subscribing:

```typescript
const subscription = Conductor.Subscribe('myEvent', payload => {
    console.log('Event payload:', payload);
});

// Later, when you want to unsubscribe
subscription.UnSubscribe();

```

## API

### Subscribe to an event.
`Conductor.Subscribe<TEvent>(eventName: string, handler: (payload: TEvent) => void, thisArg?: object): ISubscription<TEvent>`

- `eventName`: The name of the event to subscribe to.
- `handler`: The function to call when the event is published.
- `thisArg` (optional): An object to bind as `this` when calling the handler.

### Publish an event.
`Conductor.Publish<TEvent>(eventName: string, payload?: TEvent): void`

- `eventName`: The name of the event to publish.
- `payload` (optional): Data to pass to the event handler.

### Manage a subscription.

The `ISubscription<TEvent>` interface represents a subscription to an event.

- `Subscriber`: A function that will be called when the event is published, with an optional payload of type `TEvent`.
- `EventName`: The name of the event to which the subscription is associated.
- `UnSubscribe`: A parameterless method to unsubscribe from the event, removing the subscription.

You can use the `UnSubscribe` method to remove a subscription when it's no longer needed, preventing further callbacks to the `Subscriber` function.

## Advanced Usage

### Using Typed Events

You can create a typed event class to encapsulate the data you want to pass with the event. Define a typed event class:

```typescript
class UserCreatedEvent {
    constructor(userName?: string, email?: string) {
        this.UserName = userName;
        this.Email = email;
    }
    public UserName?: string
    public Email?: string
}
```

And an Enum to represent event names:

```typescript
enum AppEvents {
    UserCreated = "UserCreated"
}
```

### Subscribing with a Class Method

Subscribe to an event using a method of a TypeScript class, ensuring proper binding of the `this` context:

```typescript
class AppComponent {
    constructor() {
        Conductor.Subscribe(AppEvents.UserCreated, this.onUserCreated, this);
    }
    private onUserCreated(event: UserCreatedEvent): void {
        console.log(`New user created: ${event.UserName}, Email: ${event.Email}`);
    }
}
```

### Publishing Typed Events

Publishing typed events is straightforward. Pass the event name and the event object:

```typescript
const userCreatedEvent = new UserCreatedEvent('johndoe', 'john@example.com');
Conductor.Publish(AppEvents.UserCreated, userCreatedEvent);
```

This example shows how `Conductor` can be used with TypeScript classes and typed events, offering a clean and type-safe way to handle events in your application.

## Running Tests

To ensure `Conductor` functions as expected, there is a comprehensive test suite. After installing the necessary dependencies, run these tests using the following command:

```bash
npm test
```

## Contributing

Contributions to Harmony: Conductor are welcome! Please contact the author to get started.

## License

This project is licensed under the [MIT License](LICENSE).
