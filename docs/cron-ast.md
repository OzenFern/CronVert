# Cron Parser Object Shape

The cron parser converts a 5-field cron expression into a JavaScript object representing the **meaning of each field**.

For example:

```text
30 14 * * 1-5
```

becomes:

```js
{
    minute: {
        type: "exact",
        value: 30
    },

    hour: {
        type: "exact",
        value: 14
    },

    dayOfMonth: {
        type: "any"
    },

    month: {
        type: "any"
    },

    dayOfWeek: {
        type: "range",
        start: 1,
        end: 5
    }
}
```

## Why this object exists

The parser should separate **understanding the cron expression** from **generating human-readable text**.

```text
Cron expression
      ↓
    Parser
      ↓
Structured JavaScript object
      ↓
   Formatter
      ↓
Human-readable text
```

The formatter should not need to understand cron syntax such as `*`, `-`, `,`, or `/`. It should only need to understand this object.

---

## Cron expression structure

The project supports the standard 5-field cron format:

```text
┌──────── minute       0–59
│ ┌────── hour         0–23
│ │ ┌──── day of month 1–31
│ │ │ ┌── month        1–12
│ │ │ │ ┌ day of week  0–7
│ │ │ │ │
* * * * *
```

The parser always returns these five properties:

```js
{
  (minute, hour, dayOfMonth, month, dayOfWeek);
}
```

---

# Field types

Each field has a `type` property that describes what kind of cron expression was found.

Currently supported types:

```text
any
exact
range
list
step
```

---

## 1. `any`

Represents `*`.

Example:

```text
*
```

Object:

```js
{
  type: "any";
}
```

Meaning:

> Any value in this field.

Examples:

```text
* * * * *
```

```text
0 9 * * *
```

---

## 2. `exact`

Represents a single value.

Example:

```text
30
```

Object:

```js
{
    type: "exact",
    value: 30
}
```

Another example:

```text
14
```

becomes:

```js
{
    type: "exact",
    value: 14
}
```

The value is always stored as a JavaScript `number`, not a string.

Therefore:

```js
value: 30;
```

is correct.

```js
value: "30";
```

is not.

---

## 3. `range`

Represents a continuous range of values.

Example:

```text
1-5
```

Object:

```js
{
    type: "range",
    start: 1,
    end: 5
}
```

For the day-of-week field:

```text
1-5
```

means:

> Monday through Friday

---

## 4. `list`

Represents multiple individual values separated by commas.

Example:

```text
1,3,5
```

Object:

```js
{
    type: "list",
    values: [1, 3, 5]
}
```

The values are stored as numbers.

Not:

```js
values: ["1", "3", "5"];
```

but:

```js
values: [1, 3, 5];
```

---

## 5. `step`

Represents an interval using `/`.

There are two forms.

### Step from the beginning

```text
*/15
```

Object:

```js
{
    type: "step",
    start: null,
    end: null,
    step: 15
}
```

Meaning:

> Every 15 units of this field.

For the minute field:

> Every 15 minutes.

### Stepped range

```text
1-10/2
```

Object:

```js
{
    type: "step",
    start: 1,
    end: 10,
    step: 2
}
```

Meaning:

> Every 2 units from 1 through 10.

---

# Field-specific ranges

The same field type can have different valid values depending on the field.

| Field      | Minimum | Maximum |
| ---------- | ------: | ------: |
| minute     |       0 |      59 |
| hour       |       0 |      23 |
| dayOfMonth |       1 |      31 |
| month      |       1 |      12 |
| dayOfWeek  |       0 |       7 |

`dayOfWeek` uses the standard cron convention where both `0` and `7` can represent Sunday.

---

# Complete example

Cron:

```text
30 14 * * 1-5
```

Parsed object:

```js
{
    minute: {
        type: "exact",
        value: 30
    },

    hour: {
        type: "exact",
        value: 14
    },

    dayOfMonth: {
        type: "any"
    },

    month: {
        type: "any"
    },

    dayOfWeek: {
        type: "range",
        start: 1,
        end: 5
    }
}
```

Interpretation:

```text
minute → exactly 30
hour → exactly 14
day of month → any
month → any
day of week → Monday through Friday
```

The formatter can therefore produce:

> At 2:30 PM, Monday through Friday.

---

# Design principle

The parser represents **meaning**, not the original syntax.

For example:

```text
*/15
```

should not simply become:

```js
{
    type: "step",
    value: "*/15"
}
```

Instead, it becomes structured information:

```js
{
    type: "step",
    start: null,
    end: null,
    step: 15
}
```

This makes the object useful to the formatter.

The parser's job is:

> Cron syntax → structured meaning

The formatter's job is:

> Structured meaning → natural language

The two responsibilities should remain separate.
