# HarmonyConductor

Harmony: Conductor is a lightweight, easy-to-use event bus for managing application-level events. It allows components within your application to subscribe to specific events and react accordingly. This simple yet powerful tool facilitates communication between different parts of your application without tight coupling.

## Features

- **Event Subscriptions**: Subscribe to events with custom handlers.
- **Event Publishing**: Publish events with optional payloads.
- **Type Safety**: Generic support for event payloads.

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

```javascript
import { Bus } from 'harmony-conductor';
```

### Subscribing to an Event

To subscribe to an event, use `Bus.Subscribe`. You can provide an event name and a handler function.

```javascript
Conductor.Subscribe('myEvent', payload => {
    console.log('Event payload:', payload);
});
```

For events without a payload:

```javascript
Conductor.Subscribe('simpleEvent', () => {
    console.log('Simple event triggered');
});
```

### Publishing an Event

To trigger an event, use `Bus.Publish`. You can provide the event name and an optional payload.

```javascript
Conductor.Publish('myEvent', {key: 'value'});
```

For events without a payload:

```javascript
Conductor.Publish('simpleEvent');
```

## API

### `Bus.Subscribe<TEvent>(eventName: string, handler: (payload: TEvent) => void): void`

Subscribe to an event.

- `eventName`: The name of the event to subscribe to.
- `handler`: The function to call when the event is published.

### `Bus.Publish<TEvent>(eventName: string, payload?: TEvent): void`

Publish an event.

- `eventName`: The name of the event to publish.
- `payload`: (Optional) Data to pass to the event handler.

Certainly! Here's an enhanced example for your `README.md` that includes using a typed event class and subscribing to an event with a method from a TypeScript class. This example demonstrates how to use the `bind` method to set the `this` context correctly.

---

## Advanced Usage

### Using Typed Events

You can create a typed event class to encapsulate the data you want to pass with the event.

```typescript
// Define a typed event class
class UserCreatedEvent {
    constructor(userName?: string, email?: string) {
        this.UserName = userName;
        this.Email = email;
    }
    public UserName?: string
    public Email?: string
}
```

And you can create an Enum to represent event names.
```typescript
enum AppEvents {
    UserCreated = "UserCreated"
}
```

### Subscribing with a Class Method

You can subscribe to an event using a method of a class. Remember to use proper binding of the `this` context.

```typescript
class AppComponent {
    constructor() {
        Bus.Subscribe(AppEvents.UserCreated, this.onUserCreated.bind(this));
    }
    private onUserCreated(event: UserCreatedEvent): void {
        console.log(`New user created: ${event.UserName}, Email: ${event.Email}`);
    }
}

```

### Publishing Typed Events

Publishing typed events is straightforward. Just pass the event name and the event object.

```typescript
const userCreatedEvent = new UserCreatedEvent('johndoe', 'john@example.com');
Bus.Publish(AppEvents.UserCreated, userCreatedEvent);
```

This example shows how `HarmonyConductor` can be used with TypeScript classes and typed events, providing a clean and type-safe way to handle events across your application.

---

## Running Tests

To ensure `HarmonyConductor` works as expected, there is a test suite. After installing the necessary dependencies, you can run these tests using the following command:
```bash
npm test
```
---

## Contributing

Contributions are welcome! Please contact the author to get started.

## License

This project is licensed under the [MIT License](LICENSE).
