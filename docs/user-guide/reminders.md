---
id: reminders
title: Reminders
sidebar_label: Reminders
sidebar_position: 5
---

# Reminders

Reminders let you schedule follow-up actions for customers who have outstanding debts. You can set a date and time, define an amount threshold, and optionally send the reminder automatically via WhatsApp.

## Reminders List

Navigate to **Reminders** via the bottom navigation. The list is divided into:

- **Overdue** — reminders whose date/time has passed and haven't been completed
- **Today** — reminders due today
- **Upcoming** — future reminders

The bottom navigation tab shows a **badge** with the count of overdue + today's pending reminders.

---

## Creating a Reminder

You can create a reminder from two places:
1. **Reminders screen → +** button
2. **Customer profile → Reminders tab → +** button

### Reminder Form

| Field | Required | Notes |
|---|---|---|
| Customer | Yes | Select from customer list |
| Title | Yes | Short reminder title (e.g. "Collect payment") |
| Date & Time | Yes | When the reminder should fire |
| Amount Threshold | No | Only fire if customer's balance ≥ this amount |
| Note | No | Optional internal note |
| Send via WhatsApp | No | Toggle to send a WhatsApp message at the scheduled time |
| WhatsApp Message | If toggle on | The message to send (auto-filled from template) |

### Amount Threshold

If you set an **amount threshold**, the reminder will only appear (and only send the WhatsApp message) if the customer's current balance is **at or above** the threshold at the time the reminder fires.

Example: Set threshold 5,000 YER → if the customer's balance drops below 5,000 before the reminder fires (they paid), the reminder is silently skipped.

---

## WhatsApp Auto-Send

When **Send via WhatsApp** is toggled on:

1. At the scheduled date and time, the app (if running) checks whether WhatsApp is connected.
2. If connected and the amount threshold condition is met, it sends the configured message to the customer's WhatsApp number.
3. The reminder is then automatically marked as **Sent**.

The default auto-send message template is:
```
Dear {{customer_name}},

This is a friendly reminder from {{store_name}} that your current balance is {{balance}} YER.

Please contact us to arrange payment.

Thank you.
```

You can edit this template per reminder.

:::warning
WhatsApp auto-send only works if the app is running (or running in the background on Android) at the scheduled time. If the device is off or the app is force-closed, the reminder will not be sent automatically. You can manually send it later from the Reminders screen.
:::

---

## Pending Reminders Count (Badge)

The badge on the Reminders tab in the bottom navigation shows:

```
count = (overdue reminders) + (reminders due today not yet actioned)
```

This count updates in real time as reminders become due.

---

## Completing a Reminder

1. Tap the reminder row.
2. Tap **Mark as Complete**.
3. The reminder moves to the **Completed** tab and the badge count decreases.

---

## Snoozing a Reminder

If you need more time:

1. Tap the reminder row.
2. Tap **Snooze**.
3. Select a snooze duration:
   - 1 hour
   - 3 hours
   - Tomorrow 9 AM
   - Custom date/time
4. Tap **Confirm**.

The reminder re-appears at the new time.

---

## Editing a Reminder

1. Tap the reminder row.
2. Tap the **Edit** (pencil) icon.
3. Modify any field.
4. Tap **Save**.

---

## Deleting a Reminder

1. Tap the reminder row.
2. Tap **Delete** → confirm.

---

## Reminder History

Completed and sent reminders are visible in the **Completed** tab. This gives you an audit trail of all customer follow-ups.

---

## Sync Behavior

Reminders are synced across all devices like any other entity. If you create a reminder on your phone, it appears on the desktop app as well. The WhatsApp auto-send fires on whichever device is online and has WhatsApp connected at the scheduled time.

:::tip
If you have multiple devices, designate one as the "always-on" device for WhatsApp auto-send to ensure reminders are reliably sent.
:::
